"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { useVersionsStore } from "@/lib/store/versions-store";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface TailorResult {
  summary: string;
  experience: { id: string; bullets: string[] }[];
}

export default function TailorJDModal({ open, onClose }: Props): React.JSX.Element | null {
  const basicInfo = usePortfolioStore((s) => s.portfolio.basicInfo);
  const experience = usePortfolioStore((s) => s.portfolio.experience);
  const strategy = usePortfolioStore((s) => s.strategy);
  const setBasicInfo = usePortfolioStore((s) => s.setBasicInfo);
  const updateExperience = usePortfolioStore((s) => s.updateExperience);
  const saveVersion = useVersionsStore((s) => s.saveVersion);

  const [jd, setJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<TailorResult | null>(null);

  if (!open) return null;

  function handleClose(): void {
    setJD("");
    setPreview(null);
    onClose();
  }

  async function handleAnalyze(): Promise<void> {
    if (!jd.trim()) return;
    setLoading(true);
    setPreview(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "tailor-to-jd",
          jd,
          name: basicInfo.name,
          title: basicInfo.title,
          summary: basicInfo.summary,
          experience: experience.map((e) => ({
            id: e.id,
            role: e.role,
            company: e.company,
            bullets: e.bullets,
          })),
          toneKeywords: strategy.toneKeywords,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { result?: TailorResult };
        if (data.result) setPreview(data.result);
        else toast.error("Couldn't parse AI result — try again");
      } else {
        const err = (await res.json()) as { error?: string };
        toast.error(err.error ?? "Tailoring failed");
      }
    } catch {
      toast.error("Network error — AI unavailable");
    } finally {
      setLoading(false);
    }
  }

  function handleApply(): void {
    if (!preview) return;
    // Save a pre-tailor snapshot first
    saveVersion("Pre-Tailor snapshot");
    // Apply changes
    setBasicInfo({ summary: preview.summary });
    for (const { id, bullets } of preview.experience) {
      updateExperience(id, { bullets });
    }
    toast.success("Portfolio tailored — pre-tailor snapshot saved");
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h2 className="font-semibold text-zinc-900">Tailor to Job Description</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              AI rewrites your summary and bullets to match the JD. A snapshot is saved before applying.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-700 text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Job Description</label>
            <textarea
              value={jd}
              onChange={(e) => setJD(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={8}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 resize-none transition-colors"
            />
          </div>

          {preview && (
            <div className="space-y-4 rounded-xl border border-zinc-200 p-4 bg-zinc-50">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Preview — changes to apply</p>

              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-700">Summary</p>
                <p className="text-sm text-zinc-600 leading-relaxed">{preview.summary}</p>
              </div>

              {preview.experience.map(({ id, bullets }) => {
                const orig = experience.find((e) => e.id === id);
                if (!orig || !bullets.length) return null;
                return (
                  <div key={id} className="space-y-1">
                    <p className="text-xs font-medium text-zinc-700">{orig.role} @ {orig.company}</p>
                    <ul className="space-y-1">
                      {bullets.map((b, i) => (
                        <li key={i} className="text-xs text-zinc-600 flex gap-2">
                          <span className="text-zinc-300 shrink-0">·</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0">
          <button
            onClick={handleClose}
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          {preview ? (
            <button
              onClick={handleApply}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Apply Changes
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={loading || !jd.trim()}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Analyzing…" : "✦ Tailor with AI"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
