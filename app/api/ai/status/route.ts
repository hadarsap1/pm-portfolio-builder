import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(): NextResponse {
  return NextResponse.json({ available: !!process.env.ANTHROPIC_API_KEY });
}
