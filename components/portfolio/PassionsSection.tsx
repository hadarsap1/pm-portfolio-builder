"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { PassionItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface PassionsSectionProps {
  passions: PassionItem[];
  accent: AccentConfig;
}

export default function PassionsSection({
  passions,
  accent,
}: PassionsSectionProps): React.JSX.Element | null {
  if (passions.length === 0) return null;

  return (
    <div className="space-y-6">
      {passions.map((p) => {
        const paragraphs = p.body
          .split(/\n\s*\n/)
          .map((s) => s.trim())
          .filter(Boolean);
        return (
          <article
            key={p.id}
            className="grid grid-cols-1 sm:grid-cols-[96px_1fr] gap-4 items-start"
          >
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.imageUrl}
                alt=""
                className={cn(
                  "h-24 w-24 rounded-lg object-cover border",
                  accent.border
                )}
              />
            ) : (
              // Spacer to keep alignment when there's no image — only on sm+
              <div className="hidden sm:block" />
            )}
            <div className="space-y-2 min-w-0">
              <h3 className="text-base font-semibold text-zinc-900">
                {p.title || "Untitled"}
              </h3>
              {paragraphs.map((para, i) => (
                <p key={i} className="text-sm text-zinc-600 leading-relaxed">
                  {para}
                </p>
              ))}
              {p.highlights.length > 0 && (
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {p.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-block text-xs font-medium hover:underline underline-offset-2 pt-1",
                    accent.heading
                  )}
                  style={accent.customHex ? { color: accent.customHex } : undefined}
                >
                  More ↗
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
