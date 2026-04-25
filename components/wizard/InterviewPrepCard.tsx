"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";

interface Question {
  question: string;
  tip: string;
}

export default function InterviewPrepCard(): React.JSX.Element {
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const strategy = usePortfolioStore((s) => s.strategy);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [jd, setJD] = useState("");
  const [showJDInput, setShowJDInput] = useState(false);

  async function handleGenerate(): Promise<void> {
    setLoading(true);
    setQuestions([]);
    setExpandedIdx(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "interview-prep",
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
          superpower: strategy.superpower,
          jd: jd.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { questions?: Question[] };
        if (data.questions?.length) setQuestions(data.questions);
        else toast.error("Couldn't generate questions — try again");
      } else {
        const err = (await res.json()) as { error?: string };
        toast.error(err.error ?? "Generation failed");
      }
    } catch {
      toast.error("Network error — AI unavailable");
    } finally {
      setLoading(false);
    }
  }

  if (!questions.length) {
    return (
      <div className="rounded-xl border border-zinc-200 p-5 space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-900">Interview Prep</p>
          <p className="text-xs text-zinc-500">AI generates 7 likely interview questions tailored to your background.</p>
        </div>

        {showJDInput ? (
          <div className="space-y-2">
            <textarea
              value={jd}
              onChange={(e) => setJD(e.target.value)}
              placeholder="Paste a job description to get targeted questions (optional)…"
              rows={4}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Generating…" : "✦ Generate"}
              </button>
              <button
                onClick={() => { setShowJDInput(false); setJD(""); }}
                className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                Skip JD
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Generating…" : "✦ Generate Questions"}
            </button>
            <button
              onClick={() => setShowJDInput(true)}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
            >
              + Add JD
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900">Interview Questions</p>
        <button
          onClick={() => { setQuestions([]); setJD(""); }}
          className="text-[10px] text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          Regenerate
        </button>
      </div>

      <div className="space-y-1.5">
        {questions.map((q, i) => (
          <div key={i} className="rounded-lg border border-zinc-100 overflow-hidden">
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              className="w-full flex items-start justify-between gap-3 px-3 py-2.5 text-start hover:bg-zinc-50 transition-colors"
            >
              <span className="text-xs font-medium text-zinc-900 leading-snug">{q.question}</span>
              <span className="text-zinc-300 shrink-0 mt-0.5 text-xs">{expandedIdx === i ? "−" : "+"}</span>
            </button>
            {expandedIdx === i && (
              <div className="px-3 pb-3 border-t border-zinc-100 bg-zinc-50">
                <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                  <span className="font-semibold text-zinc-700">Coach tip: </span>{q.tip}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
