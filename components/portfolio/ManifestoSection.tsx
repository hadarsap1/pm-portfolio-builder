"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { ManifestoItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";
import Stagger from "@/components/portfolio/motion/Stagger";

interface ManifestoSectionProps {
  manifesto: ManifestoItem[];
  accent: AccentConfig;
}

export default function ManifestoSection({
  manifesto,
  accent,
}: ManifestoSectionProps): React.JSX.Element | null {
  if (manifesto.length === 0) return null;

  // Stagger renders each belief in sequence — feels like a thinker laying
  // out an argument rather than a static list.
  return (
    <Stagger className="space-y-3" step={0.12}>
      {manifesto.map((item, i) => (
        <div key={item.id} className="flex gap-4 items-start">
          <span
            className={cn(
              "text-2xl font-bold leading-none tabular-nums shrink-0 w-7",
              accent.heading
            )}
            style={accent.customHex ? { color: accent.customHex } : undefined}
            aria-hidden
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900 leading-snug">
              {item.statement || "Untitled belief"}
            </p>
            {item.detail && (
              <p className="text-xs text-zinc-500 leading-relaxed">
                {item.detail}
              </p>
            )}
          </div>
        </div>
      ))}
    </Stagger>
  );
}
