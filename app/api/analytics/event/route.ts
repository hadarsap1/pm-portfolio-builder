import { type NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/server/analytics-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { id?: string; referrer?: string; ua?: string };
  try {
    body = (await request.json()) as { id?: string; referrer?: string; ua?: string };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { id, referrer = "", ua = "" } = body;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  recordEvent(id, { referrer: referrer.slice(0, 512), ua: ua.slice(0, 256) });
  return NextResponse.json({ ok: true });
}
