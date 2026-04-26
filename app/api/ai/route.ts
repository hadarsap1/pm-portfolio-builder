import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

// ── Input limits ──────────────────────────────────────────────────
// Caps prevent prompt-injection at scale and keep our Anthropic bill bounded.
// Numbers chosen to exceed any realistic legitimate input.
const LIMITS = {
  resumeText: 50_000,
  jdText: 10_000,
  bulletsCount: 30,
  bulletChars: 2_000,
  experienceCount: 50,
  skillsCount: 50,
  shortField: 500,
} as const;

function tooLong(value: string | undefined, max: number): boolean {
  return typeof value === "string" && value.length > max;
}

// ── Request shapes ────────────────────────────────────────────────

interface ImproveBulletsRequest {
  operation: "improve-bullets";
  role: string;
  company: string;
  bullets: string[];
  superpower: string;
  toneKeywords: string[];
}

interface ImportResumeRequest {
  operation: "import-resume";
  text: string;
}

interface GenerateSummaryRequest {
  operation: "generate-summary";
  name: string;
  title: string;
  experience: { role: string; company: string; bullets: string[] }[];
  skills: string[];
  superpower: string;
  toneKeywords: string[];
}

interface ScorePortfolioRequest {
  operation: "score-portfolio";
  name: string;
  title: string;
  summary: string;
  experience: { role: string; company: string; bullets: string[]; metrics: { label: string; value: string }[] }[];
  skills: { label: string; items: string[] }[];
  globalMetrics: { label: string; value: string }[];
  toneKeywords: string[];
  emphasizedSections: string[];
}

interface TailorToJDRequest {
  operation: "tailor-to-jd";
  jd: string;
  name: string;
  title: string;
  summary: string;
  experience: { id: string; role: string; company: string; bullets: string[] }[];
  toneKeywords: string[];
}

interface CoverLetterRequest {
  operation: "cover-letter";
  jd: string;
  companyName: string;
  roleName: string;
  name: string;
  title: string;
  summary: string;
  experience: { role: string; company: string; bullets: string[] }[];
  superpower: string;
  toneKeywords: string[];
}

interface InterviewPrepRequest {
  operation: "interview-prep";
  name: string;
  title: string;
  summary: string;
  experience: { role: string; company: string; bullets: string[]; metrics: { label: string; value: string }[] }[];
  skills: { label: string; items: string[] }[];
  superpower: string;
  jd?: string;
}

interface GenerateProjectOutcomeRequest {
  operation: "generate-project-outcome";
  title: string;
  company: string;
  problem: string;
  solution: string;
}

type AIRequest =
  | ImproveBulletsRequest
  | GenerateSummaryRequest
  | ImportResumeRequest
  | ScorePortfolioRequest
  | TailorToJDRequest
  | CoverLetterRequest
  | InterviewPrepRequest
  | GenerateProjectOutcomeRequest;

// ── Prompts ───────────────────────────────────────────────────────

function buildImproveBulletsPrompt(req: ImproveBulletsRequest): string {
  const tone = req.toneKeywords.length ? req.toneKeywords.join(", ") : "professional, results-driven";
  return `You are a senior PM career coach helping a ${req.superpower === "growth" ? "growth-focused" : req.superpower === "zero-to-one" ? "zero-to-one builder" : "technical"} Product Manager improve their resume.

Role: ${req.role} at ${req.company}
Tone keywords: ${tone}

Current bullet points:
${req.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Rewrite each bullet to be more impactful. Rules:
- Lead with a strong action verb
- Quantify impact where plausible (use ranges like "10–15%" if no number exists)
- Keep each bullet under 20 words
- Match the tone: ${tone}
- Do NOT invent specific metrics that weren't implied
- Return ONLY a JSON array of strings, one per bullet, same count as input

Example output: ["Launched redesigned checkout flow, reducing drop-off by 12–18% across mobile", "Led cross-functional squad of 6 engineers and 2 designers to ship v2 in 6 weeks"]`;
}

function buildGenerateSummaryPrompt(req: GenerateSummaryRequest): string {
  const tone = req.toneKeywords.length ? req.toneKeywords.join(", ") : "professional, results-driven";
  const superpowerLabel =
    req.superpower === "growth" ? "scaling products and driving revenue growth"
    : req.superpower === "zero-to-one" ? "building products from zero to one"
    : "bridging technical complexity with product strategy";

  const expSummary = req.experience
    .slice(0, 3)
    .map((e) => `${e.role} at ${e.company}: ${e.bullets.slice(0, 2).join("; ")}`)
    .join("\n");

  return `You are a senior PM career coach. Write a 2–3 sentence professional summary for a Product Manager resume.

Name: ${req.name}
Title: ${req.title}
Superpower: ${superpowerLabel}
Tone: ${tone}
Top skills: ${req.skills.slice(0, 8).join(", ")}

Recent experience highlights:
${expSummary || "No experience listed yet."}

Rules:
- 2–3 sentences maximum
- Lead with years of experience or a defining trait
- Include the superpower theme naturally
- Match the tone: ${tone}
- No fluff, no "I am a passionate..." clichés
- Return ONLY the plain text summary, no JSON, no quotes`;
}

// ── Handler ───────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI features require ANTHROPIC_API_KEY." }, { status: 503 });
  }

  // Rate limit: 20 calls per IP per minute. Protects the Anthropic key from
  // unauthenticated abuse / accidental client bugs.
  const ip = clientIp(request.headers);
  const limit = rateLimit(`ai:${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${limit.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: AIRequest;
  try {
    body = (await request.json()) as AIRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Length guards — reject before we burn tokens on absurd input.
  if (body.operation === "import-resume" && tooLong(body.text, LIMITS.resumeText)) {
    return NextResponse.json(
      { error: `Resume text exceeds ${LIMITS.resumeText} characters.` },
      { status: 413 }
    );
  }
  if (body.operation === "tailor-to-jd" || body.operation === "cover-letter") {
    if (tooLong(body.jd, LIMITS.jdText)) {
      return NextResponse.json(
        { error: `Job description exceeds ${LIMITS.jdText} characters.` },
        { status: 413 }
      );
    }
  }
  if (body.operation === "improve-bullets") {
    if ((body.bullets?.length ?? 0) > LIMITS.bulletsCount) {
      return NextResponse.json(
        { error: `Too many bullets (max ${LIMITS.bulletsCount}).` },
        { status: 413 }
      );
    }
    if (body.bullets?.some((b) => tooLong(b, LIMITS.bulletChars))) {
      return NextResponse.json(
        { error: `Each bullet must be ≤${LIMITS.bulletChars} characters.` },
        { status: 413 }
      );
    }
  }

  const client = new Anthropic({ apiKey });

  if (body.operation === "improve-bullets") {
    if (!body.bullets?.length) {
      return NextResponse.json({ error: "No bullets provided." }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: buildImproveBulletsPrompt(body) }],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";

    let improved: string[];
    try {
      improved = JSON.parse(text) as string[];
      if (!Array.isArray(improved)) throw new Error("not array");
    } catch {
      // Fallback: split by newlines if JSON parse fails
      improved = text
        .split("\n")
        .map((l) => l.replace(/^[\d\-\*\.\s]+/, "").trim())
        .filter(Boolean);
    }

    return NextResponse.json({ bullets: improved });
  }

  if (body.operation === "generate-summary") {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [{ role: "user", content: buildGenerateSummaryPrompt(body) }],
    });

    const summary = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";
    return NextResponse.json({ summary });
  }

  if (body.operation === "import-resume") {
    if (!body.text?.trim()) {
      return NextResponse.json({ error: "No resume text provided." }, { status: 400 });
    }

    const prompt = `You are a PM career coach and resume parser. Extract structured data from the resume text below.

Return ONLY a valid JSON object matching this exact schema — no markdown, no explanation:
{
  "basicInfo": {
    "name": "string",
    "title": "string (most recent job title)",
    "email": "string",
    "location": "string",
    "linkedin": "string (url or empty)",
    "github": "string (url or empty)",
    "summary": "string (2-3 sentences written in third person if present, else empty)"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string (e.g. Jan 2021)",
      "endDate": "string (e.g. Present or Dec 2023)",
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "year": "string"
    }
  ],
  "skills": [
    { "label": "string (category name)", "items": ["string"] }
  ],
  "globalMetrics": [
    { "label": "string", "value": "string (e.g. $12M or 340%)", "context": "string or empty" }
  ]
}

Rules:
- Extract up to 5 key metrics from the experience bullets into globalMetrics
- Group skills into logical categories (e.g. "Product", "Data & Analytics", "Tools")
- Keep bullet text as-is from the resume
- If a field is missing, use an empty string or empty array

Resume text:
${body.text}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";
    // Strip possible markdown code fences
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

    try {
      const parsed = JSON.parse(cleaned) as Record<string, unknown>;
      return NextResponse.json({ data: parsed });
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON. Try again." }, { status: 502 });
    }
  }

  if (body.operation === "score-portfolio") {
    const expSummary = body.experience
      .slice(0, 4)
      .map((e) => `${e.role} at ${e.company}: ${e.bullets.slice(0, 3).join("; ")} | Metrics: ${e.metrics.map((m) => `${m.value} ${m.label}`).join(", ")}`)
      .join("\n");

    const prompt = `You are a PM career coach evaluating a portfolio for strength and market-readiness. Score the portfolio across 4 dimensions (0–100 each) and provide exactly 3 actionable suggestions.

Portfolio:
Name: ${body.name}
Title: ${body.title}
Summary: ${body.summary || "(empty)"}
Tone keywords: ${body.toneKeywords.join(", ") || "(none)"}
Experience highlights:
${expSummary || "(no experience)"}
Skills: ${body.skills.map((s) => `${s.label}: ${s.items.join(", ")}`).join(" | ") || "(none)"}
Global metrics: ${body.globalMetrics.map((m) => `${m.value} ${m.label}`).join(", ") || "(none)"}
Emphasized sections: ${body.emphasizedSections.join(", ") || "all"}

Scoring rubric:
- impactClarity (0-100): Are achievements quantified? Do bullets show real business impact?
- keywordStrength (0-100): Are PM keywords present? (strategy, roadmap, stakeholders, metrics, launch, etc.)
- sectionCompleteness (0-100): Are all major sections filled (summary, 2+ experiences, skills, metrics)?
- summaryQuality (0-100): Is the summary concise, specific, and compelling?
- overall: weighted average (impact 35%, keyword 20%, completeness 25%, summary 20%)

Return ONLY a JSON object, no markdown:
{
  "overall": <number>,
  "impactClarity": <number>,
  "keywordStrength": <number>,
  "sectionCompleteness": <number>,
  "summaryQuality": <number>,
  "suggestions": ["<string>", "<string>", "<string>"]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    try {
      const score = JSON.parse(cleaned) as Record<string, unknown>;
      return NextResponse.json({ score });
    } catch {
      return NextResponse.json({ error: "AI returned invalid score JSON." }, { status: 502 });
    }
  }

  if (body.operation === "tailor-to-jd") {
    const expSummary = body.experience
      .map((e) => `ID: ${e.id}\nRole: ${e.role} at ${e.company}\nBullets:\n${e.bullets.map((b, i) => `  ${i + 1}. ${b}`).join("\n")}`)
      .join("\n\n");

    const prompt = `You are a PM career coach helping tailor a resume to a specific job description.

Job Description:
${body.jd}

Candidate:
Name: ${body.name}
Current title: ${body.title}
Current summary: ${body.summary || "(empty)"}
Tone keywords: ${body.toneKeywords.join(", ") || "(none)"}

Experience:
${expSummary || "(none)"}

Instructions:
1. Rewrite the summary (2-3 sentences) to directly speak to this JD's language and priorities
2. For each experience entry, rewrite the bullets to highlight skills and keywords from the JD
3. Keep the same number of bullets per role
4. Do NOT invent metrics — only reframe existing ones
5. Match the tone keywords: ${body.toneKeywords.join(", ")}

Return ONLY a JSON object, no markdown:
{
  "summary": "<rewritten summary>",
  "experience": [
    { "id": "<same id>", "bullets": ["<bullet>", ...] }
  ]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    try {
      const result = JSON.parse(cleaned) as { summary: string; experience: { id: string; bullets: string[] }[] };
      return NextResponse.json({ result });
    } catch {
      return NextResponse.json({ error: "AI returned invalid tailor JSON." }, { status: 502 });
    }
  }

  if (body.operation === "cover-letter") {
    if (!body.jd?.trim()) {
      return NextResponse.json({ error: "Job description required." }, { status: 400 });
    }

    const expHighlights = body.experience
      .slice(0, 3)
      .map((e) => `${e.role} at ${e.company}: ${e.bullets.slice(0, 2).join("; ")}`)
      .join("\n");

    const tone = body.toneKeywords.length ? body.toneKeywords.join(", ") : "professional, results-driven";
    const superpowerDesc =
      body.superpower === "growth" ? "scaling products and driving growth"
      : body.superpower === "zero-to-one" ? "building products from zero to one"
      : "bridging technical and product strategy";

    const prompt = `You are a PM career coach writing a compelling, tailored cover letter.

Candidate: ${body.name}, ${body.title}
Summary: ${body.summary || "(none)"}
Superpower: ${superpowerDesc}
Tone: ${tone}
Top experience:
${expHighlights || "(none)"}

Job:
Company: ${body.companyName || "the company"}
Role: ${body.roleName || "this position"}
Job description:
${body.jd}

Write a 3-paragraph cover letter (opening, value proposition, closing + CTA).
Rules:
- Open with a specific hook tied to the company/role, not "I am writing to apply"
- Second paragraph: 2-3 specific achievements that match the JD's needs
- Close with confidence, mention interest in discussing further
- Tone: ${tone}
- Length: 250-320 words
- Return ONLY the plain text letter, no subject line, no JSON, no markdown`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const letter = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";
    return NextResponse.json({ letter });
  }

  if (body.operation === "interview-prep") {
    const expSummary = body.experience
      .slice(0, 3)
      .map((e) => `${e.role} at ${e.company}: ${e.bullets.slice(0, 2).join("; ")} | Metrics: ${e.metrics.map((m) => `${m.value} ${m.label}`).join(", ")}`)
      .join("\n");

    const prompt = `You are a PM interview coach preparing a candidate for interviews.

Candidate: ${body.name}, ${body.title}
Superpower: ${body.superpower}
Summary: ${body.summary || "(none)"}
Experience highlights:
${expSummary || "(none)"}
Skills: ${body.skills.map((s) => `${s.label}: ${s.items.join(", ")}`).join(" | ") || "(none)"}
${body.jd ? `\nTarget job description:\n${body.jd.slice(0, 1000)}` : ""}

Generate exactly 7 interview questions this candidate is likely to face, with a one-sentence coaching tip for each (what to emphasize in the answer given their background).

Format as JSON array:
[
  { "question": "...", "tip": "..." },
  ...
]

Mix question types: behavioral (2-3), product sense (2), metrics/analytical (1-2), leadership/stakeholder (1).
Return ONLY valid JSON, no markdown.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    try {
      const questions = JSON.parse(cleaned) as { question: string; tip: string }[];
      return NextResponse.json({ questions });
    } catch {
      return NextResponse.json({ error: "AI returned invalid questions JSON." }, { status: 502 });
    }
  }

  if (body.operation === "generate-project-outcome") {
    const prompt = `You are a PM career coach helping write a concise, impact-focused project outcome statement.

Project: ${body.title || "Product initiative"}
Company: ${body.company || ""}
Problem: ${body.problem || "(not specified)"}
Solution: ${body.solution || "(not specified)"}

Write 1-2 sentences describing the measurable outcome of this initiative. Rules:
- Lead with a strong metric or business result
- If no metrics are stated, use plausible qualitative outcomes ("Reduced time-to-value by ~30%", "Increased adoption across 3 enterprise accounts")
- Do NOT invent specific numbers that contradict the problem/solution
- Keep it under 35 words
- Return ONLY the plain outcome text, no JSON, no quotes, no explanation`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 128,
      messages: [{ role: "user", content: prompt }],
    });

    const outcome = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";
    return NextResponse.json({ outcome });
  }

  return NextResponse.json({ error: "Unknown operation." }, { status: 400 });
}
