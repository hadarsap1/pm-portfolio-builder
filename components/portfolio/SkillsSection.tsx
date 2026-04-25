"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface SkillsSectionProps {
  skills: SkillCategory[];
  accent: AccentConfig;
}

export default function SkillsSection({ skills, accent }: SkillsSectionProps): React.JSX.Element | null {
  if (skills.length === 0) return null;

  return (
    <div className="space-y-3">
      {skills.map((cat) => (
        <div key={cat.id}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">
            {cat.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cat.items.map((item) => (
              <span
                key={item}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  accent.badge
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
