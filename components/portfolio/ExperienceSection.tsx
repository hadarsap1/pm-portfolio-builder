"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  accent: AccentConfig;
}

export default function ExperienceSection({ experience, accent }: ExperienceSectionProps): React.JSX.Element | null {
  if (experience.length === 0) return null;

  return (
    <div className="space-y-10">
      {experience.map((item) => (
        <div key={item.id} className={cn("ps-6 border-s-2", accent.border)}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p
                className={cn("text-xl font-bold leading-tight", accent.heading)}
                style={accent.customHex ? { color: accent.customHex } : undefined}
              >
                {item.company || "Company"}
              </p>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mt-1">
                {item.role || "Role"}
              </p>
            </div>
            <p className="text-xs text-zinc-400 shrink-0 pt-1 tabular-nums">
              {[item.startDate, item.endDate].filter(Boolean).join(" — ") || "Dates"}
            </p>
          </div>

          {item.bullets.length > 0 && (
            <ul className="space-y-2">
              {item.bullets.map((bullet, bi) => (
                <li key={bi} className="text-sm text-zinc-600 leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {item.metrics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.metrics.map((m) => (
                <span
                  key={m.id}
                  className={cn("rounded-full px-3 py-1 text-xs font-semibold", accent.badge)}
                >
                  {m.value} {m.label}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
