"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { BasicInfo } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";
import Typewriter from "@/components/portfolio/motion/Typewriter";
import ParallaxAvatar from "@/components/portfolio/motion/ParallaxAvatar";
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
      {/* Bespoke hero illustration — full-width feature image above the
          name when present. Carries the visual identity of the portfolio.
          Only renders in the full variant; sidebar (header) stays text. */}
      {basicInfo.heroImageUrl && variant === "full" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={basicInfo.heroImageUrl}
          alt=""
          className={cn(
            "w-full aspect-[16/9] object-cover rounded-2xl mb-6 border",
            accent.border
          )}
        />
      )}

      {basicInfo.avatarUrl && (
        <ParallaxAvatar
          src={basicInfo.avatarUrl}
          alt={basicInfo.name || "Avatar"}
          className="h-16 w-16 mb-4"
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

      {/* Personal positioning line — drops below title in both variants and
          carries more weight than the corporate "summary" paragraph. This is
          the "Some people talk about the long game. I run it." slot. The
          Typewriter is the single most "this is alive" cue in the hero. */}
      {basicInfo.tagline && (
        <p
          className={cn(
            "mt-3 font-semibold leading-snug",
            variant === "full" ? "text-xl text-zinc-900" : "text-base text-zinc-900"
          )}
        >
          <Typewriter text={basicInfo.tagline} />
        </p>
      )}

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
