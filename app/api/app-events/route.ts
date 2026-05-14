import { type NextRequest, NextResponse } from "next/server";
import { recordAppEvent, getAllEvents } from "@/lib/server/app-events";
import type { AppEventType } from "@/lib/server/app-events";

export const dynamic = "force-dynamic";

const VALID_TYPES = new Set<AppEventType>([
  "builder_open", "wizard_complete", "resume_import", "template_apply",
  "ai_polish", "ai_bespoke", "export_html", "export_pdf",
  "deploy_github", "deploy_vercel", "gallery_submit", "share_view",
]);

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { type?: unknown; meta?: unknown };
  try {
    body = (await request.json()) as { type?: unknown; meta?: unknown };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const type = body.type as AppEventType;
  if (!VALID_TYPES.has(type)) {
    return NextResponse.json({ ok: false, error: "Unknown event type" }, { status: 400 });
  }

  const meta =
    typeof body.meta === "object" && body.meta !== null
      ? (body.meta as Record<string, string>)
      : undefined;

  recordAppEvent(type, meta);
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const key = request.nextUrl.searchParams.get("key");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || key !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = getAllEvents();
  return NextResponse.json({ events, count: events.length });
}
