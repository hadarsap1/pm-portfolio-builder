import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";
// Image generation is slow — give it room to breathe before Vercel cuts it off.
export const maxDuration = 90;

interface BespokeRequest {
  /**
   * Which image to generate. Each kind ships with its own prompt template.
   * `hero` is the marquee illustration; `passion` is a small mood image
   * for one of the user's passions.
   */
  kind: "hero" | "passion";
  /**
   * Voice content the model should reference when composing the image.
   * For hero: tagline + mission body. For passion: title + body of one passion.
   */
  voice: {
    tagline?: string;
    mission?: string;
    passionTitle?: string;
    passionBody?: string;
  };
  /** Color theme — drives the accent palette in the prompt */
  colorTheme?: "minimal" | "bold" | "technical";
}

const ACCENT_NOTE: Record<string, string> = {
  minimal: "restrained slate-gray palette with charcoal accents, no bright colors",
  bold: "white background with restrained zinc grays, single deep violet (#7c3aed) accent used sparingly",
  technical: "white background with restrained zinc grays, single deep emerald (#059669) accent used sparingly",
};

const STYLE_BASELINE =
  "Editorial-style illustration, sophisticated and modern, like New York Times graphics or Stripe / Linear / Vercel marketing pages. Clean geometric lines. Generous negative space. NOT cartoonish, NOT 3D-rendered, NOT photorealistic, NOT child-friendly. Minimal palette. No text. No people. No faces.";

function buildHeroPrompt(voice: BespokeRequest["voice"], theme: string): string {
  const themeNote = ACCENT_NOTE[theme] ?? ACCENT_NOTE.minimal;
  // All voice strings sliced before interpolation — prevents prompt-injection
  // through long crafted user inputs and keeps model spend bounded.
  const taglineLine = voice.tagline?.trim()
    ? `\nThe author's one-line positioning is: "${voice.tagline.trim().slice(0, 200)}"`
    : "";
  const missionLine = voice.mission?.trim()
    ? `\nWhat they care about: "${voice.mission.trim().slice(0, 400)}"`
    : "";

  return `An editorial hero illustration for a Product Manager's personal portfolio website. ${STYLE_BASELINE}

The illustration should visually evoke this person's voice and what they care about — abstract, conceptual, NOT a literal interpretation. Think of it as a mood board for them.${taglineLine}${missionLine}

Composition: a layered arrangement of 3–5 abstract symbolic objects (a rising chart, a stack of cards, a partial circle, an abstract path or trajectory) that suggest progress, craft, and intention. Generous negative space on the left and right sides. Wide 16:9 composition with subject centered.

Palette: ${themeNote}.

Output a single image. No watermark, no signature, no caption text.`;
}

function buildPassionPrompt(voice: BespokeRequest["voice"], theme: string): string {
  const themeNote = ACCENT_NOTE[theme] ?? ACCENT_NOTE.minimal;
  // Title cap: 100 chars is enough for any real passion ("Trail running",
  // "Mechanical keyboards", "Sourdough"). Longer is almost certainly a
  // prompt-injection attempt or accidental paste.
  const title = voice.passionTitle?.trim().slice(0, 100) || "the subject";
  const detail = voice.passionBody?.trim()
    ? ` Context: "${voice.passionBody.trim().slice(0, 300)}"`
    : "";

  return `A small editorial mood illustration about ${title}. ${STYLE_BASELINE}${detail}

Composition: one or two iconic objects from the world of ${title}, arranged simply on a mostly-empty background. Square 1:1 composition, subject centered, generous negative space. Subtle drop shadow.

Palette: ${themeNote}.

Output a single image. No watermark, no signature, no caption text, no name labels.`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Bespoke imagery requires GEMINI_API_KEY." },
      { status: 503 }
    );
  }

  // Image generation is expensive — tighter rate limit than text AI.
  const ip = clientIp(request.headers);
  const limit = rateLimit(`bespoke:${ip}`, 8, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Too many bespoke requests. Try again in ${limit.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: BespokeRequest;
  try {
    body = (await request.json()) as BespokeRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.kind !== "hero" && body.kind !== "passion") {
    return NextResponse.json({ error: "Unknown kind." }, { status: 400 });
  }

  const theme = body.colorTheme ?? "minimal";
  const prompt =
    body.kind === "hero"
      ? buildHeroPrompt(body.voice, theme)
      : buildPassionPrompt(body.voice, theme);

  try {
    const client = new GoogleGenAI({ apiKey });
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Walk the response to find the inline image part.
    const parts = result.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);
    if (!imagePart?.inlineData?.data) {
      return NextResponse.json(
        { error: "No image returned. Try again with more voice content." },
        { status: 502 }
      );
    }

    const mime = imagePart.inlineData.mimeType ?? "image/png";
    const dataUrl = `data:${mime};base64,${imagePart.inlineData.data}`;
    return NextResponse.json({ kind: body.kind, dataUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Image generation failed: ${message.slice(0, 200)}` },
      { status: 502 }
    );
  }
}
