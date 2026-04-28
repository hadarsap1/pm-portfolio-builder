"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { BasicInfo } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface TerminalHeroProps {
  basicInfo: BasicInfo;
  accent: AccentConfig;
  variant?: "full" | "header";
}

/**
 * Terminal-presentation hero. Renders as if the user just typed a shell
 * command and the program responded. Inspired by hadarsap1.github.io's
 * `$ fetch-skills.sh` opener — signals "developer-friendly PM" before
 * the visitor reads a single sentence.
 */
export default function TerminalHero({
  basicInfo,
  accent,
  variant = "full",
}: TerminalHeroProps): React.JSX.Element {
  const slug = (basicInfo.name || "you")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  const command = `$ fetch-portfolio.sh --who=${slug || "you"}`;
  const accentStyle = accent.customHex ? { color: accent.customHex } : undefined;

  return (
    <div className="space-y-3">
      {/* Avatar stays separate — terminal aesthetic is text, the avatar is humanizing */}
      {basicInfo.avatarUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={basicInfo.avatarUrl}
          alt={basicInfo.name || "Avatar"}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-zinc-100"
        />
      )}

      {/* Command prompt — the "you typed this" line */}
      <div className="flex items-baseline gap-2 text-xs text-zinc-400">
        <span className="text-emerald-600">~/portfolio</span>
        <span>{command}</span>
      </div>

      {/* Output: name and title styled like a structured shell response */}
      <div className="space-y-1">
        <p className="text-xs text-zinc-500">
          <span className="text-zinc-400">name:</span>{" "}
          <span
            className={cn("font-bold text-2xl text-zinc-900 align-middle", accent.heading)}
            style={accentStyle}
          >
            {basicInfo.name || "anonymous"}
          </span>
        </p>
        <p className="text-xs text-zinc-500">
          <span className="text-zinc-400">role:</span>{" "}
          <span className="text-zinc-700">{basicInfo.title || "tbd"}</span>
        </p>
        {basicInfo.location && (
          <p className="text-xs text-zinc-500">
            <span className="text-zinc-400">loc: </span>
            <span className="text-zinc-700">{basicInfo.location}</span>
          </p>
        )}
      </div>

      {/* Tagline as a shell-output line — keeps the terminal register. The
          previous blockquote treatment broke the metaphor mid-stream. */}
      {basicInfo.tagline && (
        <p className="text-zinc-900 font-semibold text-base leading-snug">
          <span className={cn("me-1", accent.heading)} style={accentStyle} aria-hidden>
            &gt;
          </span>
          &ldquo;{basicInfo.tagline}&rdquo;
        </p>
      )}

      {/* Contact links rendered as command-style flags */}
      {(basicInfo.email || basicInfo.linkedin || basicInfo.github) && (
        <div className="text-xs text-zinc-500 space-y-0.5">
          {basicInfo.email && (
            <p>
              <span className="text-zinc-400">--email </span>
              <span>{basicInfo.email}</span>
            </p>
          )}
          {basicInfo.linkedin && (
            <p>
              <span className="text-zinc-400">--linkedin </span>
              <span>{basicInfo.linkedin}</span>
            </p>
          )}
          {basicInfo.github && (
            <p>
              <span className="text-zinc-400">--github </span>
              <span>{basicInfo.github}</span>
            </p>
          )}
        </div>
      )}

      {/* Summary as a stdout block when in full variant */}
      {variant === "full" && basicInfo.summary && (
        <p className="text-sm text-zinc-700 leading-relaxed pt-2">{basicInfo.summary}</p>
      )}
    </div>
  );
}
