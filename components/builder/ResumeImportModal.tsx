"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { Button } from "@/components/ui/button";
import type { PortfolioData } from "@/lib/types/portfolio";

interface Props {
  open: boolean;
  onClose: () => void;
}

function addIds(arr: unknown[]): (Record<string, unknown> & { id: string })[] {
  return (arr as Record<string, unknown>[]).map((item) => ({ ...item, id: crypto.randomUUID() }));
}

export default function ResumeImportModal({ open, onClose }: Props): React.JSX.Element | null {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleImport(): Promise<void> {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "import-resume", text }),
      });

      const body = (await res.json()) as { data?: Record<string, unknown>; error?: string };

      if (!res.ok || !body.data) {
        toast.error(body.error ?? "Import failed. Try again.");
        return;
      }

      const d = body.data;

      // Hydrate store — add IDs to every nested item
      const portfolio: PortfolioData = {
        portfolioId: usePortfolioStore.getState().portfolio.portfolioId,
        basicInfo: {
          name: String(d.basicInfo && (d.basicInfo as Record<string, unknown>).name || ""),
          title: String(d.basicInfo && (d.basicInfo as Record<string, unknown>).title || ""),
          email: String(d.basicInfo && (d.basicInfo as Record<string, unknown>).email || ""),
          location: String(d.basicInfo && (d.basicInfo as Record<string, unknown>).location || ""),
          linkedin: String(d.basicInfo && (d.basicInfo as Record<string, unknown>).linkedin || ""),
          github: String(d.basicInfo && (d.basicInfo as Record<string, unknown>).github || ""),
          summary: String(d.basicInfo && (d.basicInfo as Record<string, unknown>).summary || ""),
        },
        experience: addIds(Array.isArray(d.experience) ? d.experience : []).map((e) => ({
          id: e.id,
          company: String(e.company ?? ""),
          role: String(e.role ?? ""),
          startDate: String(e.startDate ?? ""),
          endDate: String(e.endDate ?? ""),
          bullets: Array.isArray(e.bullets) ? (e.bullets as string[]) : [],
          metrics: [],
        })),
        education: addIds(Array.isArray(d.education) ? d.education : []).map((e) => ({
          id: e.id,
          institution: String(e.institution ?? ""),
          degree: String(e.degree ?? ""),
          field: String(e.field ?? ""),
          year: String(e.year ?? ""),
        })),
        skills: addIds(Array.isArray(d.skills) ? d.skills : []).map((s) => ({
          id: s.id,
          label: String(s.label ?? ""),
          items: Array.isArray(s.items) ? (s.items as string[]) : [],
        })),
        globalMetrics: addIds(Array.isArray(d.globalMetrics) ? d.globalMetrics : []).map((m) => ({
          id: m.id,
          label: String(m.label ?? ""),
          value: String(m.value ?? ""),
          context: m.context ? String(m.context) : undefined,
        })),
        projects: [],
        certifications: [],
        recommendations: [],
      };

      usePortfolioStore.setState({ portfolio });
      toast.success("Resume imported — review each step to refine.");
      setText("");
      onClose();
    } catch {
      toast.error("Network error — AI unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Import Resume</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Paste your resume text — AI will parse and fill the wizard.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 text-xl leading-none">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your full resume here — plain text works best. Include job titles, companies, dates, bullets, education, and skills."
            className="w-full h-64 text-sm text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-zinc-50 rounded-b-2xl">
          <p className="text-[11px] text-zinc-400">Your data never leaves this server.</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleImport} disabled={loading || !text.trim()}>
              {loading ? "Importing…" : "✦ Import with AI"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
