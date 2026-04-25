"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { useAIAvailable } from "@/hooks/useAIAvailable";
import { Button } from "@/components/ui/button";
import PortfolioScoreCard from "@/components/wizard/PortfolioScoreCard";
import AnalyticsDashboard from "@/components/wizard/AnalyticsDashboard";
import InterviewPrepCard from "@/components/wizard/InterviewPrepCard";

function buildPayload() {
  const s = usePortfolioStore.getState();
  return { portfolio: s.portfolio, design: s.design, strategy: s.strategy };
}

function buildShareUrl(): string {
  const s = usePortfolioStore.getState();
  // Omit avatarUrl from shared payload to keep URL manageable
  const payload = {
    portfolio: { ...s.portfolio, basicInfo: { ...s.portfolio.basicInfo, avatarUrl: undefined } },
    design: s.design,
    strategy: s.strategy,
  };
  const json = JSON.stringify(payload);
  // URL-safe base64
  const encoded = btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${window.location.origin}/share#${encoded}`;
}

export default function CompletionPanel(): React.JSX.Element {
  const basicInfo = usePortfolioStore((s) => s.portfolio.basicInfo);
  const portfolioId = usePortfolioStore((s) => s.portfolio.portfolioId);
  const experience = usePortfolioStore((s) => s.portfolio.experience);
  const skills = usePortfolioStore((s) => s.portfolio.skills);
  const globalMetrics = usePortfolioStore((s) => s.portfolio.globalMetrics);
  const superpower = usePortfolioStore((s) => s.strategy.superpower);
  const colorTheme = usePortfolioStore((s) => s.design.colorTheme);
  const resumeEditing = usePortfolioStore((s) => s.resumeEditing);
  const aiAvailable = useAIAvailable();
  const [shareUrl, setShareUrl] = useState("");
  const [galleryListed, setGalleryListed] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);

  async function handleDownload(): Promise<void> {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const match = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/);
    a.download = match?.[1] ?? "portfolio.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleShare(): void {
    const url = buildShareUrl();
    setShareUrl(url);
    void navigator.clipboard.writeText(url).then(() => toast.success("Share link copied to clipboard"));
  }

  async function handleListInGallery(): Promise<void> {
    const url = shareUrl || buildShareUrl();
    if (!url) return;
    setShareUrl(url);
    setGalleryBusy(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioId,
          name: basicInfo.name,
          title: basicInfo.title,
          summary: basicInfo.summary,
          superpower,
          colorTheme,
          shareUrl: url,
        }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) {
        toast.error(body.error ?? "Could not list in gallery");
        return;
      }
      setGalleryListed(true);
      toast.success("Listed in the public gallery");
    } catch {
      toast.error("Could not reach the gallery service");
    } finally {
      setGalleryBusy(false);
    }
  }

  async function handleRemoveFromGallery(): Promise<void> {
    setGalleryBusy(true);
    try {
      const res = await fetch(
        `/api/gallery?portfolioId=${encodeURIComponent(portfolioId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        toast.error("Could not remove from gallery");
        return;
      }
      setGalleryListed(false);
      toast.success("Removed from the public gallery");
    } catch {
      toast.error("Could not reach the gallery service");
    } finally {
      setGalleryBusy(false);
    }
  }

  const stats = [
    { label: "Roles", value: experience.length },
    { label: "Skill groups", value: skills.length },
    { label: "Key metrics", value: globalMetrics.length },
  ].filter((s) => s.value > 0);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-10 text-center space-y-7">
      {/* Check */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white text-2xl">
        ✓
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-zinc-900">
          {basicInfo.name ? `${basicInfo.name.split(" ")[0]}'s portfolio is ready` : "Your portfolio is ready"}
        </h2>
        <p className="text-sm text-zinc-500">
          Review the live preview on the right, then export or deploy.
        </p>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="flex gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-zinc-900">{s.value}</p>
              <p className="text-xs text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        <Link href="/preview" target="_blank" rel="noreferrer">
          <Button className="w-full" variant="outline">Open Full Preview ↗</Button>
        </Link>
        <Button className="w-full" onClick={handleDownload}>Download HTML</Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => window.open("/preview?print=1", "_blank", "noreferrer")}
        >
          Download PDF
        </Button>
        <Button className="w-full" variant="outline" onClick={handleShare}>
          Share Link ↗
        </Button>
      </div>

      {/* Share URL display */}
      {shareUrl && (
        <div className="w-full max-w-xs space-y-2">
          <div className="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2 flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 truncate flex-1">{shareUrl}</span>
            <button
              onClick={() => { void navigator.clipboard.writeText(shareUrl); toast.success("Copied"); }}
              className="text-[11px] font-medium text-zinc-700 hover:text-zinc-900 shrink-0 transition-colors"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => {
              if (galleryListed) void handleRemoveFromGallery();
              else void handleListInGallery();
            }}
            disabled={galleryBusy}
            className="w-full text-[11px] text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors disabled:opacity-50"
          >
            {galleryListed ? "Remove from public gallery" : "Also list in the public gallery →"}
          </button>
        </div>
      )}

      {/* AI Score */}
      {aiAvailable && (
        <div className="w-full max-w-xs">
          <PortfolioScoreCard />
        </div>
      )}

      {/* Interview Prep */}
      {aiAvailable && (
        <div className="w-full max-w-xs">
          <InterviewPrepCard />
        </div>
      )}

      {/* Analytics */}
      <div className="w-full max-w-xs">
        <AnalyticsDashboard />
      </div>

      <button
        onClick={resumeEditing}
        className="text-xs text-zinc-400 hover:text-zinc-700 underline underline-offset-2 transition-colors"
      >
        Keep editing
      </button>
    </div>
  );
}
