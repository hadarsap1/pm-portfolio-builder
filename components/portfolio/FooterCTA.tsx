import React from "react";
import { cn } from "@/lib/utils";
import type { BasicInfo } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface FooterCTAProps {
  basicInfo: BasicInfo;
  accent: AccentConfig;
}

export default function FooterCTA({ basicInfo, accent }: FooterCTAProps): React.JSX.Element {
  const hasContact = basicInfo.email || basicInfo.linkedin;

  return (
    <div className={cn("rounded-2xl px-10 py-14 text-center", accent.heroBg)}>
      <p
        className={cn("text-xs font-semibold uppercase tracking-widest mb-3", accent.heading)}
        style={accent.customHex ? { color: accent.customHex } : undefined}
      >
        Get in touch
      </p>
      <h2 className="text-3xl font-bold text-zinc-900 leading-tight mb-6">
        Let&apos;s build something together.
      </h2>
      {hasContact && (
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {basicInfo.email && (
            <a
              href={`mailto:${basicInfo.email}`}
              className={cn("text-sm font-semibold hover:opacity-70 transition-opacity", accent.heading)}
              style={accent.customHex ? { color: accent.customHex } : undefined}
            >
              {basicInfo.email}
            </a>
          )}
          {basicInfo.linkedin && (
            <a
              href={basicInfo.linkedin.startsWith("http") ? basicInfo.linkedin : `https://${basicInfo.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className={cn("text-sm font-semibold hover:opacity-70 transition-opacity", accent.heading)}
              style={accent.customHex ? { color: accent.customHex } : undefined}
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
