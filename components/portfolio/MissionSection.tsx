"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { MissionSection as MissionData } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface MissionSectionProps {
  mission: MissionData | null;
  accent: AccentConfig;
}

export default function MissionSection({
  mission,
  accent,
}: MissionSectionProps): React.JSX.Element | null {
  if (!mission || (!mission.title && !mission.body)) return null;

  // Split into paragraphs on blank lines so the wizard can capture multi-para
  // mission statements without a markdown processor.
  const paragraphs = mission.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex gap-6 items-start">
      {mission.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mission.imageUrl}
          alt=""
          className={cn(
            "h-24 w-24 rounded-lg object-cover shrink-0 border",
            accent.border
          )}
        />
      )}
      <div className="space-y-2 flex-1 min-w-0">
        {mission.title && (
          <h3 className="text-base font-semibold text-zinc-900">
            {mission.title}
          </h3>
        )}
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-zinc-600 leading-relaxed">
            {p}
          </p>
        ))}
        {mission.link && (
          <a
            href={mission.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-xs font-medium hover:underline underline-offset-2",
              accent.heading
            )}
            style={accent.customHex ? { color: accent.customHex } : undefined}
          >
            Learn more ↗
          </a>
        )}
      </div>
    </div>
  );
}
