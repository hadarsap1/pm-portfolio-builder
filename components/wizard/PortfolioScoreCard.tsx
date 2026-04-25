"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import type { PortfolioScore } from "@/lib/types/portfolio";

function ScoreBar({ value, label }: { value: number; label: string }): React.JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-500">{label}</span>
        <span className="font-semibold text-zinc-900">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function PortfolioScoreCard(): React.JSX.Element {
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const strategy = usePortfolioStore((s) => s.strategy);

  const [score, setScore] = useState<PortfolioScore | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleScore(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "score-portfolio",
          name: portfolio.basicInfo.name,
          title: portfolio.basicInfo.title,
          summary: portfolio.basicInfo.summary,
          experience: portfolio.experience.map((e) => ({
            role: e.role,
            company: e.company,
            bullets: e.bullets,
            metrics: e.metrics,
          })),
          skills: portfolio.skills,
          globalMetrics: portfolio.globalMetrics,
          toneKeywords: strategy.toneKeywords,
          emphasizedSections: strategy.emphasizedSections,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { score?: PortfolioScore };
        if (data.score) setScore(data.score);
        else toast.error("Couldn't parse score — try again");
      } else {
        const err = (await res.json()) as { error?: string };
        toast.error(err.error ?? "Scoring failed");
      }
    } catch {
      toast.error("Network error — AI unavailable");
    } finally {
      setLoading(false);
    }
  }

  if (!score) {
    return (
      <div className="rounded-xl border border-zinc-200 p-5 text-center space-y-3">
        <p className="text-sm font-medium text-zinc-900">AI Portfolio Score</p>
        <p className="text-xs text-zinc-500">
          Get an objective 0–100 score across impact, keywords, completeness, and summary quality.
        </p>
        <button
          onClick={handleScore}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Analyzing…" : "✦ Score My Portfolio"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900">Portfolio Score</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-zinc-900">{score.overall}</span>
          <span className="text-xs text-zinc-400">/100</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <ScoreBar value={score.impactClarity} label="Impact Clarity" />
        <ScoreBar value={score.keywordStrength} label="Keyword Strength" />
        <ScoreBar value={score.sectionCompleteness} label="Section Completeness" />
        <ScoreBar value={score.summaryQuality} label="Summary Quality" />
      </div>

      <div className="space-y-1.5 pt-1 border-t border-zinc-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Suggestions</p>
        <ul className="space-y-1.5">
          {score.suggestions.map((s, i) => (
            <li key={i} className="flex gap-2 text-xs text-zinc-600">
              <span className="text-zinc-300 shrink-0">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setScore(null)}
        className="text-[10px] text-zinc-400 hover:text-zinc-600 transition-colors"
      >
        Re-score
      </button>
    </div>
  );
}
