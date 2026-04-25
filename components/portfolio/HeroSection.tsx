"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { BasicInfo } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";
// AccentConfig.customHex is applied as inline style when present

interface HeroSectionProps {
  basicInfo: BasicInfo;
  accent: AccentConfig;
  /** "full" = name + title + contact + summary stacked (one-column)
   *  "header" = name + title + contact only (two-column sidebar) */
  variant?: "full" | "header";
}

export default function HeroSection({
  basicInfo,
  accent,
  variant = "full",
}: HeroSectionProps): React.JSX.Element {
  const contactItems = [
    basicInfo.email,
    basicInfo.location,
    basicInfo.linkedin,
    basicInfo.github,
  ].filter(Boolean) as string[];

  return (
    <div>
      {basicInfo.avatarUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={basicInfo.avatarUrl}
          alt={basicInfo.name || "Avatar"}
          className="h-16 w-16 rounded-full object-cover mb-4 ring-2 ring-zinc-100"
        />
      )}
      <h1
        className={cn("text-3xl font-bold tracking-tight leading-tight", accent.heading)}
        style={accent.customHex ? { color: accent.customHex } : undefined}
      >
        {basicInfo.name || "Your Name"}
      </h1>
      <p className="mt-1 text-zinc-500 font-medium">
        {basicInfo.title || "Your Title"}
      </p>

      {contactItems.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {contactItems.map((item) => (
            <span key={item} className="text-xs text-zinc-400">
              {item}
            </span>
          ))}
        </div>
      )}

      {variant === "full" && basicInfo.summary && (
        <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
          {basicInfo.summary}
        </p>
      )}
    </div>
  );
}
