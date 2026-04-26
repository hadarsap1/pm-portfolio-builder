import React from "react";
import Link from "next/link";
import Image from "next/image";
import { listGallery } from "@/lib/server/gallery-store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PM Portfolio Gallery",
  description: "Browse PM portfolios shared by other product managers.",
};

const SUPERPOWER_LABEL: Record<string, string> = {
  growth: "Growth",
  "zero-to-one": "Zero-to-One",
  technical: "Technical",
};

const THEME_DOT: Record<string, string> = {
  minimal: "bg-slate-400",
  bold: "bg-violet-500",
  technical: "bg-emerald-500",
};

export default function GalleryPage(): React.JSX.Element {
  const entries = listGallery();

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">PM Portfolio Gallery</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Public portfolios from other product managers. Browse for inspiration.
            </p>
          </div>
          <Link
            href="/builder"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            Build yours
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-white py-12 px-8 text-center space-y-5">
            <Image
              src="/gallery-empty.png"
              alt=""
              width={600}
              height={400}
              className="w-full max-w-md mx-auto h-auto"
            />
            <p className="text-sm font-semibold text-zinc-900">
              The gallery is waiting for its first portfolio.
            </p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Build yours, then click <span className="font-medium text-zinc-700">List in Public Gallery</span> on the completion screen to be the first.
            </p>
            <Link
              href="/builder"
              className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
            >
              Start building →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <a
                key={entry.portfolioId}
                href={entry.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">
                      {entry.name}
                    </p>
                    {entry.title && (
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">
                        {entry.title}
                      </p>
                    )}
                  </div>
                  <span
                    className={`mt-1 h-2 w-2 rounded-full shrink-0 ${THEME_DOT[entry.colorTheme] ?? THEME_DOT.minimal}`}
                    aria-hidden
                  />
                </div>

                {entry.summary && (
                  <p className="mt-3 text-xs text-zinc-600 leading-relaxed line-clamp-3">
                    {entry.summary}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  {entry.superpower && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      {SUPERPOWER_LABEL[entry.superpower] ?? entry.superpower}
                    </span>
                  )}
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
                    View →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
