"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import WizardPanel from "@/components/builder/WizardPanel";
import PreviewPanel from "@/components/builder/PreviewPanel";
import ExportControls from "@/components/builder/ExportControls";
import VersionManager from "@/components/builder/VersionManager";
import ResumeImportModal from "@/components/builder/ResumeImportModal";
import TailorJDModal from "@/components/builder/TailorJDModal";
import CoverLetterModal from "@/components/builder/CoverLetterModal";
import TemplatePickerModal from "@/components/builder/TemplatePickerModal";
import { useAIAvailable } from "@/hooks/useAIAvailable";
import { cn } from "@/lib/utils";

export default function BuilderLayout(): React.JSX.Element {
  const resetPortfolio = usePortfolioStore((s) => s.resetPortfolio);
  const [importOpen, setImportOpen] = useState(false);
  const [tailorOpen, setTailorOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);

  // Auto-show template picker on first empty visit
  useEffect(() => {
    const s = usePortfolioStore.getState();
    const isDefault =
      s.portfolio.basicInfo.name === "Your Name" &&
      s.portfolio.experience.length === 0 &&
      s.portfolio.projects.length === 0 &&
      !s.wizard.isComplete;
    const seen = sessionStorage.getItem("template-picker-seen");
    if (isDefault && !seen) {
      sessionStorage.setItem("template-picker-seen", "1");
      setTemplateOpen(true);
    }
  }, []);
  const [mobileTab, setMobileTab] = useState<"wizard" | "preview">("wizard");
  const aiAvailable = useAIAvailable();

  function handleReset(): void {
    if (!window.confirm("Reset all portfolio data? This cannot be undone.")) return;
    resetPortfolio();
    toast.success("Portfolio reset to defaults.");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Top header ────────────────────────────────────────────── */}
      <header className="flex items-center justify-between shrink-0 border-b bg-white px-4 md:px-6 py-3 gap-3 no-print">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-semibold text-zinc-900 hidden sm:block">PM Portfolio Builder</span>
          <span className="text-sm font-semibold text-zinc-900 sm:hidden">PM Builder</span>
          <span className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase hidden md:block">Beta</span>
        </div>

        {/* Centre actions */}
        <div className="flex items-center gap-3 md:gap-4 text-xs">
          <button
            onClick={() => setTemplateOpen(true)}
            className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block"
          >
            Templates
          </button>
          <button
            onClick={() => setImportOpen(true)}
            className="font-medium text-violet-600 hover:text-violet-800 transition-colors hidden sm:block"
          >
            ✦ Import Resume
          </button>
          {aiAvailable && (
            <button
              onClick={() => setTailorOpen(true)}
              className="font-medium text-violet-600 hover:text-violet-800 transition-colors hidden sm:block"
            >
              ✦ Tailor to JD
            </button>
          )}
          {aiAvailable && (
            <button
              onClick={() => setCoverOpen(true)}
              className="font-medium text-violet-600 hover:text-violet-800 transition-colors hidden md:block"
            >
              ✦ Cover Letter
            </button>
          )}
          <VersionManager />
          <Link
            href="/preview"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block"
          >
            Open Preview ↗
          </Link>
          <button
            onClick={handleReset}
            className="font-medium text-zinc-400 hover:text-red-500 transition-colors hidden md:block"
          >
            Reset
          </button>
        </div>

        <ExportControls />
      </header>

      {/* ── Split-screen body ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Wizard */}
        <div
          className={cn(
            "flex flex-col overflow-hidden border-e",
            "md:w-[42%]",
            // Mobile: fill width, hide when preview tab active
            mobileTab === "wizard" ? "flex-1 md:flex-none" : "hidden md:flex"
          )}
        >
          <WizardPanel />
        </div>

        {/* Right: Live Preview */}
        <div
          className={cn(
            "flex flex-col overflow-hidden",
            "md:w-[58%]",
            // Mobile: fill width, hide when wizard tab active
            mobileTab === "preview" ? "flex-1 md:flex-none" : "hidden md:flex"
          )}
        >
          <PreviewPanel />
        </div>
      </div>

      {/* ── Mobile tab bar ────────────────────────────────────────── */}
      <div className="md:hidden flex shrink-0 border-t bg-white no-print">
        {(["wizard", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              "flex-1 py-3 text-xs font-semibold capitalize transition-colors",
              mobileTab === tab
                ? "text-zinc-900 border-t-2 border-zinc-900 -mt-px"
                : "text-zinc-400"
            )}
          >
            {tab === "wizard" ? "Wizard" : "Preview"}
          </button>
        ))}
      </div>

      <ResumeImportModal open={importOpen} onClose={() => setImportOpen(false)} />
      <TailorJDModal open={tailorOpen} onClose={() => setTailorOpen(false)} />
      <CoverLetterModal open={coverOpen} onClose={() => setCoverOpen(false)} />
      <TemplatePickerModal open={templateOpen} onClose={() => setTemplateOpen(false)} />
    </div>
  );
}
