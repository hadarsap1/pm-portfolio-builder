import { type NextRequest, NextResponse } from "next/server";
import { generatePortfolioHTML } from "@/lib/export/generate-html";
import type { PortfolioData, DesignPreferences, StrategicFocus } from "@/lib/types/portfolio";
import { recordAppEvent } from "@/lib/server/app-events";

export const dynamic = "force-dynamic";

interface ExportPayload {
  portfolio: PortfolioData;
  design: DesignPreferences;
  strategy: StrategicFocus;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let payload: ExportPayload;

  try {
    payload = (await request.json()) as ExportPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { portfolio, design, strategy } = payload;
  if (!portfolio || !design || !strategy) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const html = generatePortfolioHTML(portfolio, design, strategy);
  const name = portfolio.basicInfo.name?.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "portfolio";

  recordAppEvent("export_html");
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}-portfolio.html"`,
    },
  });
}
