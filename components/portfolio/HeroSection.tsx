"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { BasicInfo } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";
import Typewriter from "@/components/portfolio/motion/Typewriter";
import ParallaxAvatar from "@/components/portfolio/motion/ParallaxAvatar";

interface HeroSectionProps {
  basicInfo: BasicInfo;
  accent: AccentConfig;
  /** "full" = display-scale hero (one-column)
   *  "header" = compact sidebar version (two-column) */
  variant?: "full" | "header";
}

function buildContactLinks(basicInfo: BasicInfo): { href: string | null; label: string }[] {
  return [
    basicInfo.email ? { href: `mailto:${basicInfo.email}`, label: basicInfo.email } : null,
    basicInfo.location ? { href: null, label: basicInfo.location } : null,
    basicInfo.linkedin
      ? {
          href: basicInfo.linkedin.startsWith("http") ? basicInfo.linkedin : `https://${basicInfo.linkedin}`,
          label: basicInfo.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
        }
      : null,
    basicInfo.github
      ? {
          href: basicInfo.github.startsWith("http") ? basicInfo.github : `https://github.com/${basicInfo.github}`,
          label: basicInfo.github.replace(/^https?:\/\/(www\.)?/, ""),
        }
      : null,
  ].filter((x): x is { href: string | null; label: string } => x !== null);
}

export default function HeroSection({
  basicInfo,
  accent,
  variant = "full",
}: HeroSectionProps): React.JSX.Element {
  const contactLinks = buildContactLinks(basicInfo);

  // ── Sidebar (two-column) variant ──────────────────────────────────
  if (variant === "header") {
    return (
      <div>
        {basicInfo.avatarUrl && (
          <ParallaxAvatar
            src={basicInfo.avatarUrl}
            alt={basicInfo.name || "Avatar"}
            className="h-14 w-14 mb-4"
          />
        )}
        <h1
          className={cn("text-xl font-bold tracking-tight leading-tight", accent.heading)}
          style={accent.customHex ? { color: accent.customHex } : undefined}
        >
          {basicInfo.name || "Your Name"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 font-medium">
          {basicInfo.title || "Your Title"}
        </p>

        {basicInfo.tagline && (
          <p className="mt-2 text-sm font-semibold text-zinc-800 leading-snug">
            <Typewriter text={basicInfo.tagline} />
          </p>
        )}

        {contactLinks.length > 0 && (
          <div className="mt-3 flex flex-col gap-1">
            {contactLinks.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors truncate"
                >
                  {item.label}
                </a>
              ) : (
                <span key={item.label} className="text-xs text-zinc-400">{item.label}</span>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Full (one-column) variant ─────────────────────────────────────
  return (
    <div>
      <div className={cn("flex items-start gap-10", basicInfo.avatarUrl ? "justify-between" : "")}>
        <div className="flex-1 min-w-0">
          <h1
            className={cn("font-heading text-5xl font-bold tracking-tight leading-tight", accent.heading)}
            style={accent.customHex ? { color: accent.customHex } : undefined}
          >
            {basicInfo.name || "Your Name"}
          </h1>

          <p className="mt-2 text-lg text-zinc-500 font-medium">
            {basicInfo.title || "Your Title"}
          </p>

          {basicInfo.tagline && (
            <p className="mt-4 text-xl font-semibold text-zinc-900 leading-snug max-w-2xl">
              <Typewriter text={basicInfo.tagline} />
            </p>
          )}

          {contactLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
              {contactLinks.map((item) =>
                item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span key={item.label} className="text-sm text-zinc-500">{item.label}</span>
                )
              )}
            </div>
          )}

          {basicInfo.summary && (
            <p className="mt-5 text-base text-zinc-600 leading-relaxed max-w-2xl">
              {basicInfo.summary}
            </p>
          )}
        </div>

        {basicInfo.avatarUrl && (
          <ParallaxAvatar
            src={basicInfo.avatarUrl}
            alt={basicInfo.name || "Avatar"}
            className="h-32 w-32 rounded-full shrink-0"
          />
        )}
      </div>

      {basicInfo.heroImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={basicInfo.heroImageUrl}
          alt=""
          className={cn(
            "w-full aspect-[16/9] object-cover rounded-2xl mt-8 border",
            accent.border
          )}
        />
      )}
    </div>
  );
}
