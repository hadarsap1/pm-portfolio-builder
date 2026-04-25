import { type NextRequest, NextResponse } from "next/server";
import { generatePortfolioHTML } from "@/lib/export/generate-html";
import type { PortfolioData, DesignPreferences, StrategicFocus } from "@/lib/types/portfolio";

export const dynamic = "force-dynamic";

interface DeployPayload {
  portfolio: PortfolioData;
  design: DesignPreferences;
  strategy: StrategicFocus;
  projectName?: string;
}

interface VercelFile {
  file: string;
  data: string;
  encoding: "base64";
}

interface VercelDeploymentResponse {
  id: string;
  url: string;
  readyState?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "VERCEL_TOKEN is not configured." },
      { status: 503 }
    );
  }

  let payload: DeployPayload;
  try {
    payload = (await request.json()) as DeployPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { portfolio, design, strategy, projectName = "pm-portfolio" } = payload;

  // Sanitize project name
  const name = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 52) || "pm-portfolio";

  const html = generatePortfolioHTML(portfolio, design, strategy);
  const encoded = Buffer.from(html).toString("base64");

  const files: VercelFile[] = [
    { file: "index.html", data: encoded, encoding: "base64" },
  ];

  const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      files,
      projectSettings: { framework: null },
      target: "production",
    }),
  });

  if (!deployRes.ok) {
    const err = (await deployRes.json()) as { error?: { message?: string } };
    return NextResponse.json(
      { error: err.error?.message ?? "Vercel deploy failed." },
      { status: 502 }
    );
  }

  const data = (await deployRes.json()) as VercelDeploymentResponse;
  const url = `https://${data.url}`;

  return NextResponse.json({ url });
}
