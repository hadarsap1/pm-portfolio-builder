import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { decodeSharePayload } from "@/lib/share/payload";

export const runtime = "edge";

const ACCENT: Record<string, string> = {
  minimal: "#334155",
  bold: "#7c3aed",
  technical: "#059669",
};

const SUPERPOWER_LABEL: Record<string, string> = {
  growth: "Growth PM",
  "zero-to-one": "Zero-to-One PM",
  technical: "Technical PM",
};

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1).trim()}…` : s;
}

// Cap raw payload length on the edge worker — every Slack/Twitter/LinkedIn
// crawler hits this path and we don't want a crafted multi-MB ?d= to chew CPU.
const MAX_PAYLOAD_LENGTH = 20_000;

export async function GET(request: NextRequest): Promise<Response> {
  const d = request.nextUrl.searchParams.get("d") ?? "";
  const payload = d.length > MAX_PAYLOAD_LENGTH ? null : decodeSharePayload(d);

  const name = payload?.portfolio.basicInfo.name || "PM Portfolio";
  const title = payload?.portfolio.basicInfo.title || "Product Manager";
  const summary = payload?.portfolio.basicInfo.summary
    ? truncate(payload.portfolio.basicInfo.summary, 180)
    : "A portfolio built with PM Portfolio Builder.";
  const accent = ACCENT[payload?.design.colorTheme ?? "minimal"] ?? ACCENT.minimal;
  const superpower = payload
    ? SUPERPOWER_LABEL[payload.strategy.superpower] ?? "Product Manager"
    : "Product Manager";

  // Pull up to 3 headline metrics for the card
  const metrics = (payload?.portfolio.globalMetrics ?? []).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "white",
          padding: "60px 64px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: "flex",
            height: 8,
            width: 96,
            background: accent,
            borderRadius: 4,
            marginBottom: 32,
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#71717a",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          {superpower}
        </div>

        {/* Name */}
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 800,
            color: "#18181b",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 12,
          }}
        >
          {truncate(name, 40)}
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: accent,
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          {truncate(title, 60)}
        </div>

        {/* Summary */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#52525b",
            lineHeight: 1.45,
            maxWidth: 1000,
          }}
        >
          {summary}
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flexGrow: 1 }} />

        {/* Metrics row */}
        {metrics.length > 0 && (
          <div style={{ display: "flex", gap: 48, marginBottom: 24 }}>
            {metrics.map((m) => (
              <div key={m.id} style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#18181b",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {truncate(m.value, 12)}
                </div>
                <div style={{ fontSize: 16, color: "#71717a", marginTop: 2 }}>
                  {truncate(m.label, 24)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#a1a1aa",
            borderTop: "1px solid #e4e4e7",
            paddingTop: 20,
          }}
        >
          PM Portfolio Builder
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
