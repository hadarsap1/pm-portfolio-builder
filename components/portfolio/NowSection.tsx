"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { NowItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface NowSectionProps {
  now: NowItem[];
  accent: AccentConfig;
}

export default function NowSection({
  now,
  accent,
}: NowSectionProps): React.JSX.Element | null {
  if (now.length === 0) return null;

  return (
    <div className="space-y-3">
      {now.map((item) => (
        <div key={item.id} className="flex gap-3 items-baseline">
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-widest shrink-0 w-32",
              accent.heading
            )}
            style={accent.customHex ? { color: accent.customHex } : undefined}
          >
            {item.label || "Now"}
          </span>
          <p className="text-sm text-zinc-700 flex-1 leading-snug">
            {item.content}
          </p>
        </div>
      ))}
    </div>
  );
}
