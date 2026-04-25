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
    <div className="space-y-5">
      {experience.map((item, i) => (
        <div key={item.id} className="relative ps-5">
          {/* Timeline dot */}
          <div
            className={cn(
              "absolute start-0 top-1.5 h-2 w-2 rounded-full border-2",
              accent.border,
              "bg-white"
            )}
          />
          {/* Vertical line between items */}
          {i < experience.length - 1 && (
            <div
              className={cn(
                "absolute start-[3px] top-3.5 bottom-[-1.25rem] w-px",
                accent.border,
                "border-s"
              )}
            />
          )}

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-zinc-900 text-sm leading-snug">
                {item.role || "Role"}
              </p>
              <p className={cn("text-xs font-medium mt-0.5", accent.heading)}>
                {item.company || "Company"}
              </p>
            </div>
            <p className="text-[11px] text-zinc-400 shrink-0 pt-0.5">
              {[item.startDate, item.endDate].filter(Boolean).join(" — ") || "Dates"}
            </p>
          </div>

          {item.bullets.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {item.bullets.map((bullet, bi) => (
                <li key={bi} className="text-xs text-zinc-600 leading-relaxed flex gap-2">
                  <span className={cn("mt-1.5 h-1 w-1 rounded-full shrink-0", accent.heading.replace("text-", "bg-"))} />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Inline role metrics */}
          {item.metrics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.metrics.map((m) => (
                <span
                  key={m.id}
                  className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", accent.badge)}
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
