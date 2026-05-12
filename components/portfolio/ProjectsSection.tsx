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
    <div className="space-y-6">
      {projects.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Accent header band */}
          <div className={cn("px-6 py-5", accent.heroBg)}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p
                  className={cn("text-xl font-bold leading-snug", accent.heading)}
                  style={accent.customHex ? { color: accent.customHex } : undefined}
                >
                  {p.title || "Untitled Project"}
                </p>
                {(p.company || p.duration) && (
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {[p.company, p.duration].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0 mt-0.5">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn("text-sm font-semibold transition-opacity hover:opacity-70", accent.heading)}
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
                    className="text-sm font-medium text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    Case study ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 bg-white space-y-4">
            {p.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt="" className="w-full h-48 object-cover rounded-lg" />
            )}

            {(p.problem || p.solution || p.outcome) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x sm:divide-zinc-100">
                {[
                  { label: "Problem", text: p.problem },
                  { label: "Solution", text: p.solution },
                  { label: "Outcome", text: p.outcome },
                ]
                  .filter(({ text }) => text)
                  .map(({ label, text }, i) => (
                    <div key={label} className={cn("space-y-1.5", i > 0 && "sm:ps-4")}>
                      <p
                        className={cn("text-[10px] font-bold uppercase tracking-widest", accent.heading)}
                        style={accent.customHex ? { color: accent.customHex } : undefined}
                      >
                        {label}
                      </p>
                      <p className="text-sm text-zinc-600 leading-relaxed">{text}</p>
                    </div>
                  ))}
              </div>
            )}

            {p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", accent.badge)}
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
