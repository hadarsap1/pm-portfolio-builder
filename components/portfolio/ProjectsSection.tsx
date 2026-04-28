import React from "react";
import { cn } from "@/lib/utils";
import type { ProjectItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

export default function ProjectsSection({
  projects,
  accent,
}: {
  projects: ProjectItem[];
  accent: AccentConfig;
}): React.JSX.Element {
  if (!projects.length) return <></>;

  return (
    <div className="space-y-5">
      {projects.map((p) => (
        <div
          key={p.id}
          className={cn(
            "rounded-xl border bg-white overflow-hidden transition-all duration-300",
            "hover:-translate-y-0.5 hover:shadow-md",
            accent.border
          )}
        >
          {/* Optional screenshot — full-bleed at the top of the card */}
          {p.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.imageUrl}
              alt=""
              className="w-full h-40 object-cover border-b"
            />
          )}

          <div className="p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 leading-snug">{p.title || "Untitled Project"}</p>
                <p
                  className={cn("text-xs font-medium mt-0.5", accent.heading)}
                  style={accent.customHex ? { color: accent.customHex } : undefined}
                >
                  {[p.company, p.duration].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 mt-0.5">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      "text-[11px] font-semibold transition-colors",
                      accent.heading
                    )}
                    style={accent.customHex ? { color: accent.customHex } : undefined}
                  >
                    Live ↗
                  </a>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[11px] font-medium text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    Case study ↗
                  </a>
                )}
              </div>
            </div>

            {/* Three-step flow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Problem", text: p.problem },
                { label: "Solution", text: p.solution },
                { label: "Outcome", text: p.outcome },
              ].map(({ label, text }) =>
                text ? (
                  <div key={label} className="space-y-1">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
                    <p className="text-xs text-zinc-600 leading-relaxed">{text}</p>
                  </div>
                ) : null
              )}
            </div>

            {/* Tags */}
            {p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                      accent.badge
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
