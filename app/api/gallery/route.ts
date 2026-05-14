import { type NextRequest, NextResponse } from "next/server";
import {
  listGallery,
  removeGalleryEntry,
  upsertGalleryEntry,
} from "@/lib/server/gallery-store";
import { recordAppEvent } from "@/lib/server/app-events";

export const dynamic = "force-dynamic";

interface UpsertBody {
  portfolioId?: unknown;
  name?: unknown;
  title?: unknown;
  summary?: unknown;
  superpower?: unknown;
  colorTheme?: unknown;
  shareUrl?: unknown;
}

function asString(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  return v.slice(0, max);
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ entries: listGallery() });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: UpsertBody;
  try {
    body = (await request.json()) as UpsertBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const portfolioId = asString(body.portfolioId, 64);
  const name = asString(body.name, 120);
  const title = asString(body.title, 160);
  const summary = asString(body.summary, 600);
  const superpower = asString(body.superpower, 32);
  const colorTheme = asString(body.colorTheme, 32);
  const shareUrl = asString(body.shareUrl, 8192);

  if (!portfolioId || !name || !shareUrl) {
    return NextResponse.json(
      { ok: false, error: "portfolioId, name, and shareUrl are required" },
      { status: 400 }
    );
  }

  // Only allow our own /share URLs to prevent the gallery from being weaponised
  // for arbitrary outbound link spam (open-redirect-style attack: a card in
  // the gallery linking to evil.example.com/share/anything).
  let parsed: URL;
  try {
    parsed = new URL(shareUrl);
  } catch {
    return NextResponse.json(
      { ok: false, error: "shareUrl must be a valid absolute URL" },
      { status: 400 }
    );
  }
  if (!parsed.pathname.startsWith("/share")) {
    return NextResponse.json(
      { ok: false, error: "shareUrl must point to /share" },
      { status: 400 }
    );
  }
  // Hostname must match this app. Origin from the request is authoritative
  // because it's what the browser actually saw — don't trust an env var to
  // be set in every deploy environment.
  const expectedHost = request.headers.get("host");
  if (expectedHost && parsed.host !== expectedHost) {
    return NextResponse.json(
      { ok: false, error: "shareUrl must be on this domain" },
      { status: 400 }
    );
  }

  const entry = upsertGalleryEntry({
    portfolioId,
    name,
    title: title ?? "",
    summary: summary ?? "",
    superpower: superpower ?? "",
    colorTheme: colorTheme ?? "minimal",
    shareUrl,
  });

  recordAppEvent("gallery_submit");
  return NextResponse.json({ ok: true, entry });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const portfolioId = request.nextUrl.searchParams.get("portfolioId");
  if (!portfolioId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const removed = removeGalleryEntry(portfolioId);
  return NextResponse.json({ ok: true, removed });
}
