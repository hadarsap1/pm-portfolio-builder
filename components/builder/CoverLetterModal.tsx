"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CoverLetterModal({ open, onClose }: Props): React.JSX.Element | null {
  const basicInfo = usePortfolioStore((s) => s.portfolio.basicInfo);
  const experience = usePortfolioStore((s) => s.portfolio.experience);
  const strategy = usePortfolioStore((s) => s.strategy);

  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [jd, setJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");

  if (!open) return null;

  function handleClose(): void {
    setCompanyName("");
    setRoleName("");
    setJD("");
    setLetter("");
    onClose();
  }

  async function handleGenerate(): Promise<void> {
    if (!jd.trim()) return;
    setLoading(true);
    setLetter("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "cover-letter",
          jd,
          companyName,
          roleName,
          name: basicInfo.name,
          title: basicInfo.title,
          summary: basicInfo.summary,
          experience: experience.map((e) => ({
            role: e.role,
            company: e.company,
            bullets: e.bullets,
          })),
          superpower: strategy.superpower,
          toneKeywords: strategy.toneKeywords,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { letter?: string };
        if (data.letter) setLetter(data.letter);
        else toast.error("Couldn't generate letter — try again");
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

  function handleDownload(): void {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${companyName || "company"}.txt`.replace(/\s+/g, "-").toLowerCase();
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopy(): void {
    void navigator.clipboard.writeText(letter).then(() => toast.success("Copied to clipboard"));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h2 className="font-semibold text-zinc-900">Cover Letter Generator</h2>
            <p className="text-xs text-zinc-500 mt-0.5">AI writes a tailored letter based on your portfolio and the job description.</p>
          </div>
          <button onClick={handleClose} className="text-zinc-400 hover:text-zinc-700 text-xl leading-none transition-colors">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">Company name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">Role name</label>
              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Head of Product"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Job description <span className="text-red-400">*</span></label>
            <textarea
              value={jd}
              onChange={(e) => setJD(e.target.value)}
              placeholder="Paste the job description here…"
              rows={6}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none transition-colors"
            />
          </div>

          {letter && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-700">Generated letter</p>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Copy</button>
                  <button onClick={handleDownload} className="text-xs font-medium text-zinc-900 hover:text-zinc-600 transition-colors">↓ Download .txt</button>
                </div>
              </div>
              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                rows={14}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0">
          <button onClick={handleClose} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Cancel</button>
          <button
            onClick={handleGenerate}
            disabled={loading || !jd.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Writing…" : letter ? "↺ Regenerate" : "✦ Generate Letter"}
          </button>
        </div>
      </div>
    </div>
  );
}
