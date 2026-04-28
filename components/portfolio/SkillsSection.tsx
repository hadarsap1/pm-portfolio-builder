"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";
import { motion, useReducedMotion } from "motion/react";

interface SkillsSectionProps {
  skills: SkillCategory[];
  accent: AccentConfig;
}

/**
 * Skill tags become tactile: hover lifts and tilts each tag, click toggles
 * a selected/dim state across siblings so the visitor can "filter" what
 * matters to them. No real functionality — pure interactive delight, the
 * "I see you" cue you get on hadarsap1's site.
 */
export default function SkillsSection({ skills, accent }: SkillsSectionProps): React.JSX.Element | null {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const reduced = useReducedMotion();

  if (skills.length === 0) return null;

  function toggle(item: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  const anySelected = selected.size > 0;

  return (
    <div className="space-y-3">
      {anySelected && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            Clear filter
          </button>
        </div>
      )}
      {skills.map((cat) => (
        <div key={cat.id}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">
            {cat.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cat.items.map((item) => {
              const isSelected = selected.has(item);
              const dimmed = anySelected && !isSelected;
              return (
                <motion.button
                  key={item}
                  type="button"
                  onClick={() => toggle(item)}
                  whileHover={reduced ? undefined : { y: -2, scale: 1.03 }}
                  whileTap={reduced ? undefined : { scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-opacity",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-900",
                    accent.badge,
                    isSelected && "ring-2 ring-offset-1 ring-zinc-900",
                    dimmed && "opacity-40"
                  )}
                >
                  {item}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
