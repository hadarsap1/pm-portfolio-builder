"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface TerminalExperienceProps {
  experience: ExperienceItem[];
  accent: AccentConfig;
}

/**
 * Deterministic 7-char hex from a string. Looks like a git commit
 * short-hash to anyone who's ever rebased anything. Stable across
 * renders so the same experience entry always gets the same hash.
 */
function pseudoSha(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  // 7 hex chars, unsigned
  return (h >>> 0).toString(16).padStart(7, "0").slice(-7);
}

function formatRange(start: string, end: string): string {
  const s = start || "????";
  const e = end || "present";
  return `${s} → ${e}`;
}

/**
 * Experience rendered as a `git log --oneline --graph` view. Each role
 * is a commit, bullets are the diff. Plays directly to the engineer
 * audience and signals product-engineer fluency.
 */
export default function TerminalExperience({
  experience,
  accent,
}: TerminalExperienceProps): React.JSX.Element | null {
  if (experience.length === 0) return null;
  const accentStyle = accent.customHex ? { color: accent.customHex } : undefined;

  return (
    <div className="space-y-5 text-xs leading-relaxed">
      <p className="text-zinc-400">$ git log --oneline --graph experience.git</p>
      {experience.map((e, i) => {
        const sha = pseudoSha(`${e.id}:${e.company}:${e.role}`);
        return (
          <div key={e.id} className="flex gap-3">
            {/* Graph rail — connects commits visually */}
            <div className="flex flex-col items-center shrink-0 pt-1" aria-hidden>
              <span
                className={cn("text-base font-bold leading-none", accent.heading)}
                style={accentStyle}
              >
                ●
              </span>
              {i < experience.length - 1 && (
                <span className="block w-px flex-1 bg-zinc-200 mt-1" />
              )}
            </div>

            {/* Commit body */}
            <div className="flex-1 min-w-0 space-y-1.5 pb-2">
              <p>
                <span
                  className={cn("font-semibold", accent.heading)}
                  style={accentStyle}
                >
                  commit {sha}
                </span>{" "}
                <span className="text-zinc-400">({formatRange(e.startDate, e.endDate)})</span>
              </p>
              <p className="text-zinc-700">
                <span className="text-zinc-400">Author: </span>
                <span className="font-semibold text-zinc-900">{e.role || "untitled"}</span>
                <span className="text-zinc-400"> @ </span>
                <span>{e.company || "unknown"}</span>
              </p>

              {e.bullets.length > 0 && (
                <ul className="ms-4 space-y-1 text-zinc-700">
                  {e.bullets.map((b, bi) => (
                    <li key={bi} className="leading-relaxed">
                      <span className="text-zinc-400">- </span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {e.metrics.length > 0 && (
                <ul className="ms-4 space-y-0.5 text-zinc-500">
                  {e.metrics.map((m) => (
                    <li key={m.id}>
                      <span className="text-zinc-400">+ </span>
                      <span className="text-zinc-700 font-semibold">{m.value}</span>{" "}
                      <span>{m.label}</span>
                      {m.context && <span className="text-zinc-400"> · {m.context}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
