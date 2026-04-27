import React from "react";
import type { Metadata } from "next";
import ShareRenderer from "./ShareRenderer";
import { decodeSharePayload } from "@/lib/share/payload";

interface PageProps {
  searchParams: Promise<{ d?: string }>;
}

const SUPERPOWER_LABEL: Record<string, string> = {
  growth: "Growth PM",
  "zero-to-one": "Zero-to-One PM",
  technical: "Technical PM",
};

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1).trim()}…` : s;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { d } = await searchParams;
  const payload = d ? decodeSharePayload(d) : null;

  // Hash-based legacy links land here without `d=` — fall back to generic meta.
  if (!payload) {
    return {
      title: "PM Portfolio",
      description: "View this PM portfolio.",
    };
  }

  const { basicInfo } = payload.portfolio;
  const name = basicInfo.name || "PM Portfolio";
  const title = basicInfo.title || "Product Manager";
  const headline = `${name} — ${title}`;
  const summary = basicInfo.summary
    ? truncate(basicInfo.summary, 200)
    : `${SUPERPOWER_LABEL[payload.strategy.superpower] ?? "Product Manager"} portfolio.`;

  // Pass the encoded payload through to the OG image route so it can
  // render the same name/title/summary on the card.
  const ogImagePath = `/share/og-card?d=${encodeURIComponent(d ?? "")}`;
  const apiPath = `/api/profile?d=${encodeURIComponent(d ?? "")}`;

  return {
    title: headline,
    description: summary,
    // <link rel="alternate" type="application/json"> is a standard hint that
    // the same resource is available as JSON. Slack/LinkedIn ignore it;
    // anyone who view-sources the page or runs `curl -I` will find the API.
    alternates: {
      types: { "application/json": apiPath },
    },
    openGraph: {
      title: headline,
      description: summary,
      type: "profile",
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: headline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description: summary,
      images: [ogImagePath],
    },
  };
}

export default function SharePage(): React.JSX.Element {
  return <ShareRenderer />;
}
