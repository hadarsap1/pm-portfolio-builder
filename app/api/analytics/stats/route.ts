import { type NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/server/analytics-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const events = getEvents(id);
  const views = events.length;

  const uniqueDates = [...new Set(
    events.map((e) => new Date(e.ts).toISOString().split("T")[0])
  )].sort().reverse();

  const referrerCounts = new Map<string, number>();
  for (const e of events) {
    const ref = e.referrer || "direct";
    referrerCounts.set(ref, (referrerCounts.get(ref) ?? 0) + 1);
  }
  const referrers = [...referrerCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([url, count]) => ({ url, count }));

  return NextResponse.json({ views, uniqueDates, referrers });
}
