"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { Button } from "@/components/ui/button";

type DeployState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; pagesUrl: string | null; repoUrl: string }
  | { status: "error" };

type VercelState = "idle" | "loading" | "success";

function buildPayload() {
  const s = usePortfolioStore.getState();
  return { portfolio: s.portfolio, design: s.design, strategy: s.strategy };
}

export default function ExportControls(): React.JSX.Element {
  const [deployState, setDeployState] = useState<DeployState>({ status: "idle" });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [repoName, setRepoName] = useState("pm-portfolio");
  const [showRepoInput, setShowRepoInput] = useState(false);
  const [vercelState, setVercelState] = useState<VercelState>("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "github") {
      setIsAuthenticated(true);
      window.history.replaceState({}, "", "/builder");
      // Auto-trigger deploy if user was redirected back after OAuth
      const pending = sessionStorage.getItem("pendingDeploy");
      if (pending) {
        sessionStorage.removeItem("pendingDeploy");
        toast.success("Connected to GitHub — deploying…");
        void triggerDeploy(pending);
      } else {
        toast.success("Connected to GitHub");
      }
    }
    if (params.get("error")) {
      sessionStorage.removeItem("pendingDeploy");
      toast.error(`GitHub auth failed: ${params.get("error")}`);
      window.history.replaceState({}, "", "/builder");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDownload(): Promise<void> {
    const toastId = toast.loading("Generating HTML…");
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const match = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "portfolio.html";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("HTML downloaded", { id: toastId });
    } catch {
      toast.error("Export failed", { id: toastId });
    }
  }

  function handlePDF(): void {
    window.open("/preview?print=1", "_blank", "noreferrer");
  }

  async function triggerDeploy(name: string): Promise<void> {
    setDeployState({ status: "loading" });
    const toastId = toast.loading("Deploying to GitHub Pages…");

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildPayload(), repoName: name }),
      });

      if (res.status === 401) {
        toast.dismiss(toastId);
        sessionStorage.setItem("pendingDeploy", name);
        window.location.href = "/api/auth/github";
        return;
      }

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        toast.error(body.error ?? "Deploy failed", { id: toastId });
        setDeployState({ status: "error" });
        return;
      }

      const data = (await res.json()) as { url: string; pagesUrl: string | null };
      setIsAuthenticated(true);
      setDeployState({ status: "success", pagesUrl: data.pagesUrl, repoUrl: data.url });

      if (data.pagesUrl) {
        toast.success(
          <span>
            Live at{" "}
            <a href={data.pagesUrl} target="_blank" rel="noreferrer" className="underline">
              {data.pagesUrl}
            </a>
          </span>,
          { id: toastId, duration: 8000 }
        );
      } else {
        toast.success("Pushed to GitHub — enable Pages in repo Settings.", { id: toastId });
      }
    } catch {
      toast.error("Network error", { id: toastId });
      setDeployState({ status: "error" });
    }
  }

  function handleDeploy(): void {
    void triggerDeploy(repoName);
  }

  async function handleVercelDeploy(): Promise<void> {
    setVercelState("loading");
    const toastId = toast.loading("Deploying to Vercel…");
    try {
      const res = await fetch("/api/deploy/vercel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildPayload(), projectName: repoName }),
      });

      if (res.status === 503) {
        toast.error("VERCEL_TOKEN not configured.", { id: toastId });
        setVercelState("idle");
        return;
      }

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        toast.error(body.error ?? "Vercel deploy failed", { id: toastId });
        setVercelState("idle");
        return;
      }

      const data = (await res.json()) as { url: string };
      setVercelState("success");
      toast.success(
        <span>
          Live at{" "}
          <a href={data.url} target="_blank" rel="noreferrer" className="underline">
            {data.url}
          </a>
        </span>,
        { id: toastId, duration: 8000 }
      );
    } catch {
      toast.error("Network error", { id: toastId });
      setVercelState("idle");
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button variant="outline" size="sm" onClick={handleDownload} className="hidden sm:flex">
        HTML
      </Button>
      <Button variant="outline" size="sm" onClick={handlePDF} className="hidden sm:flex">
        PDF
      </Button>

      {/* Vercel deploy */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleVercelDeploy}
        disabled={vercelState === "loading"}
        className="hidden md:flex"
      >
        {vercelState === "loading" ? "…" : vercelState === "success" ? "✓ Vercel" : "▲ Vercel"}
      </Button>

      {/* GitHub Pages deploy with optional repo name */}
      <div className="flex items-center gap-1.5">
        {showRepoInput && (
          <input
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))}
            onKeyDown={(e) => { if (e.key === "Enter") handleDeploy(); if (e.key === "Escape") setShowRepoInput(false); }}
            className="h-7 w-36 rounded border border-zinc-300 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
            placeholder="repo-name"
            autoFocus
          />
        )}
        <Button
          size="sm"
          onClick={showRepoInput ? handleDeploy : () => setShowRepoInput(true)}
          disabled={deployState.status === "loading"}
        >
          {deployState.status === "loading"
            ? "Deploying…"
            : showRepoInput
              ? "Push →"
              : isAuthenticated
                ? "Push to GitHub"
                : "Deploy"}
        </Button>
        {showRepoInput && (
          <button
            onClick={() => setShowRepoInput(false)}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
