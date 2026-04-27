"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { ManifestoItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface ManifestoSectionProps {
  manifesto: ManifestoItem[];
  accent: AccentConfig;
}

export default function ManifestoSection({
  manifesto,
  accent,
}: ManifestoSectionProps): React.JSX.Element | null {
  if (manifesto.length === 0) return null;

  return (
    <ol className="space-y-3 list-none">
      {manifesto.map((item, i) => (
        <li key={item.id} className="flex gap-4 items-start">
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
        </li>
      ))}
    </ol>
  );
}
