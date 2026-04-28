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
import BespokePanel from "@/components/wizard/BespokePanel";

function buildPayload() {
  const s = usePortfolioStore.getState();
  return { portfolio: s.portfolio, design: s.design, strategy: s.strategy };
}

function buildShareUrl(): string {
  const s = usePortfolioStore.getState();
  // Strip everything heavy from the share payload — share URLs have a hard
  // practical ceiling (~16KB for some servers) and base64 images blow it.
  // Bespoke imagery lives on in the user's own preview and exported HTML.
  const payload = {
    portfolio: {
      ...s.portfolio,
      basicInfo: {
        ...s.portfolio.basicInfo,
        avatarUrl: undefined,
        heroImageUrl: undefined,
      },
      mission: s.portfolio.mission
        ? { ...s.portfolio.mission, imageUrl: undefined }
        : null,
      passions: s.portfolio.passions.map((p) => ({ ...p, imageUrl: undefined })),
      projects: s.portfolio.projects.map((p) => ({ ...p, imageUrl: undefined })),
    },
    design: s.design,
    strategy: s.strategy,
  };
  const json = JSON.stringify(payload);
  // btoa only handles Latin1, so a tagline with an emoji or Hebrew char
  // crashes. Encode to UTF-8 bytes first, then map each byte to a Latin1
  // char so btoa is happy. Produces the same output decodeSharePayload
  // already accepts on the server (Buffer.from(..., 'base64')).
  const utf8 = new TextEncoder().encode(json);
  const binary = Array.from(utf8, (b) => String.fromCharCode(b)).join("");
  const encoded = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  // Use ?d= so the server can read the payload and emit per-portfolio
  // og:*/twitter:* meta. Hash links from older versions still render
  // client-side via the legacy fallback in ShareRenderer.
  return `${window.location.origin}/share?d=${encoded}`;
}

export default function CompletionPanel(): React.JSX.Element {
  const basicInfo = usePortfolioStore((s) => s.portfolio.basicInfo);
  const portfolioId = usePortfolioStore((s) => s.portfolio.portfolioId);
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

  // Single primary action for the share-link path. The default state
  // shows just one "Get share link" button; once clicked, the URL +
  // copy + gallery toggle reveal in place.
  const linkPanel = (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 text-start space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Share a link</p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
            Instant. No account. The portfolio data is encoded in the URL.
          </p>
        </div>
        <span aria-hidden className="text-xl">🔗</span>
      </div>
      {!shareUrl ? (
        <Button className="w-full" onClick={handleShare}>Get share link</Button>
      ) : (
        <div className="space-y-2">
          <div className="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2 flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 truncate flex-1">{shareUrl}</span>
            <button
              type="button"
              onClick={() => { void navigator.clipboard.writeText(shareUrl); toast.success("Copied"); }}
              className="text-[11px] font-medium text-zinc-700 hover:text-zinc-900 shrink-0 transition-colors"
            >
              Copy
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (galleryListed) void handleRemoveFromGallery();
              else void handleListInGallery();
            }}
            disabled={galleryBusy}
            className="w-full text-[11px] text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors text-start disabled:opacity-50"
          >
            {galleryListed ? "Listed in the public gallery — remove" : "Also list in the public gallery →"}
          </button>
        </div>
      )}
    </div>
  );

  // Download + open preview as a thin secondary row — these matter but
  // shouldn't compete with the primary share-and-deploy actions.
  const downloadRow = (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 text-start space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Download a copy</p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
            Self-contained file. Email it, host it, archive it.
          </p>
        </div>
        <span aria-hidden className="text-xl">📥</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>HTML</Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("/preview?print=1", "_blank", "noreferrer")}
        >
          PDF
        </Button>
        <Link href="/preview" target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm" className="w-full">Preview ↗</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-stretch h-full px-6 py-8 max-w-md mx-auto space-y-6">
      {/* Hero */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white text-xl">
          ✓
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900">
            {basicInfo.name ? `${basicInfo.name.split(" ")[0]}'s portfolio is ready` : "Your portfolio is ready"}
          </h2>
          <p className="text-sm text-zinc-500">
            Add the magic, then publish.
          </p>
        </div>
      </div>

      {/* MAGIC — bespoke imagery comes first because it's the differentiator */}
      <BespokePanel />

      {/* PUBLISH — the focal action group */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-1">
          Publish
        </h3>
        {linkPanel}
        {downloadRow}
      </section>

      {/* HELPERS — AI feedback shown after, not competing with publish */}
      {aiAvailable && (
        <section className="space-y-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-1">
            Sharpen first?
          </h3>
          <PortfolioScoreCard />
          <InterviewPrepCard />
        </section>
      )}

      {/* AFTER — only meaningful once shared */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-1">
          After you share
        </h3>
        <AnalyticsDashboard />
      </section>

      <button
        type="button"
        onClick={resumeEditing}
        className="self-center text-xs text-zinc-400 hover:text-zinc-700 underline underline-offset-2 transition-colors pt-2"
      >
        Keep editing
      </button>
    </div>
  );
}
