"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { RecommendationItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface RecommendationsSectionProps {
  recommendations: RecommendationItem[];
  accent: AccentConfig;
}

export default function RecommendationsSection({
  recommendations,
  accent,
}: RecommendationsSectionProps): React.JSX.Element | null {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => {
        const attribution = [rec.role, rec.company].filter(Boolean).join(", ");
        return (
          <figure
            key={rec.id}
            className={cn(
              "rounded-xl border bg-zinc-50/60 p-4 transition-all duration-300",
              "hover:-translate-y-0.5 hover:bg-white hover:shadow-sm",
              accent.border
            )}
          >
            <blockquote
              className="text-sm leading-relaxed text-zinc-700 before:content-['“'] after:content-['”'] before:me-0.5 after:ms-0.5 before:text-zinc-300 after:text-zinc-300"
            >
              {rec.quote || "Quote pending"}
            </blockquote>
            <figcaption className="mt-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-zinc-900">
                  {rec.name || "Recommender"}
                </p>
                {attribution && (
                  <p
                    className={cn("text-[11px] mt-0.5", accent.heading)}
                    style={
                      accent.customHex ? { color: accent.customHex } : undefined
                    }
                  >
                    {attribution}
                  </p>
                )}
                {rec.relationship && (
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {rec.relationship}
                  </p>
                )}
              </div>
              {rec.linkedin && (
                <a
                  href={rec.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-zinc-400 hover:text-zinc-700 transition-colors shrink-0"
                >
                  LinkedIn ↗
                </a>
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
