"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import WizardPanel from "@/components/builder/WizardPanel";
import PreviewPanel from "@/components/builder/PreviewPanel";
import ExportControls from "@/components/builder/ExportControls";
import VersionManager from "@/components/builder/VersionManager";
import ResumeImportModal from "@/components/builder/ResumeImportModal";
import TemplatePickerModal from "@/components/builder/TemplatePickerModal";
import { loadTemplate } from "@/lib/templates/load-template";
import { STARTER_TEMPLATES } from "@/lib/templates/starter-templates";
import { cn } from "@/lib/utils";

export default function BuilderLayout(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPortfolio = usePortfolioStore((s) => s.resetPortfolio);
  const [importOpen, setImportOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [demoTemplateName, setDemoTemplateName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Demo mode: ?demo=<templateId> | ?demo=1 (first template)
  useEffect(() => {
    const demoParam = searchParams.get("demo");
    if (!demoParam) return;
    const requested =
      demoParam === "1" || demoParam === "true"
        ? STARTER_TEMPLATES[0]?.id
        : demoParam;
    if (!requested) return;
    const template = loadTemplate(requested, { markComplete: true });
    if (!template) {
      toast.error("Unknown demo template — starting fresh.");
      router.replace("/builder");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDemoTemplateName(template.name);
    sessionStorage.setItem("template-picker-seen", "1");
    toast.success(`Demo loaded: ${template.name}`);
    router.replace("/builder");
  }, [searchParams, router]);

  // Auto-show template picker on first empty visit.
  useEffect(() => {
    if (searchParams.get("demo")) return;
    const s = usePortfolioStore.getState();
    const isDefault =
      !s.portfolio.basicInfo.name?.trim() &&
      s.portfolio.experience.length === 0 &&
      s.portfolio.projects.length === 0 &&
      !s.wizard.isComplete;
    const seen = sessionStorage.getItem("template-picker-seen");
    if (isDefault && !seen) {
      sessionStorage.setItem("template-picker-seen", "1");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTemplateOpen(true);
    }
  }, [searchParams]);

  const [mobileTab, setMobileTab] = useState<"wizard" | "preview">("wizard");

  function handleExitDemo(): void {
    resetPortfolio();
    setDemoTemplateName(null);
    sessionStorage.removeItem("template-picker-seen");
    toast.success("Demo cleared — start your own portfolio.");
  }

  function handleReset(): void {
    if (!window.confirm("Reset all portfolio data? This cannot be undone.")) return;
    resetPortfolio();
    toast.success("Portfolio reset to defaults.");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Demo-mode banner ──────────────────────────────────────── */}
      {demoTemplateName && (
        <div className="shrink-0 bg-muted border-b border-border px-4 md:px-6 py-2 flex items-center justify-between gap-3 no-print">
          <p className="text-xs text-muted-foreground flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center rounded-sm bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background shrink-0">
              Demo
            </span>
            <span className="font-medium text-foreground truncate">{demoTemplateName}</span>
            <span className="text-muted-foreground hidden sm:inline truncate">
              · explore the finished portfolio, then start your own.
            </span>
          </p>
          <button
            onClick={handleExitDemo}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Start fresh →
          </button>
        </div>
      )}

      {/* ── Top header ────────────────────────────────────────────── */}
      <header className="flex items-center justify-between shrink-0 border-b bg-background px-4 md:px-6 py-3 gap-3 no-print">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-heading text-sm font-semibold text-foreground hidden sm:block">PM Portfolio Builder</span>
          <span className="font-heading text-sm font-semibold text-foreground sm:hidden">PM Builder</span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase hidden md:block">Beta</span>
        </div>

        {/* Centre actions */}
        <div className="flex items-center gap-3 md:gap-4 text-xs">
          <button
            onClick={() => setTemplateOpen(true)}
            className="font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Templates
          </button>
          <button
            onClick={() => setImportOpen(true)}
            className="font-medium text-primary hover:opacity-80 transition-opacity hidden sm:block"
          >
            ✦ Import Resume
          </button>
          <VersionManager />
          <Link
            href="/preview"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          >
            Open Preview ↗
          </Link>
          <button
            onClick={handleReset}
            className="font-medium text-muted-foreground hover:text-destructive transition-colors hidden md:block"
          >
            Reset
          </button>

          {/* Mobile overflow menu */}
          <div className="relative md:hidden">
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              className="flex items-center justify-center h-9 w-9 border border-border text-foreground hover:bg-muted transition-colors"
            >
              <span className="text-base leading-none">···</span>
            </button>
            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute end-0 mt-2 w-56 border border-border bg-background shadow-lg z-50 py-1 text-sm"
                >
                  {[
                    { label: "Templates", onClick: () => setTemplateOpen(true) },
                    { label: "✦ Import Resume", onClick: () => setImportOpen(true) },
                    { label: "Open Preview ↗", onClick: () => window.open("/preview", "_blank", "noreferrer") },
                    { label: "Reset", onClick: handleReset, danger: true },
                  ].map((item) => (
                    <button
                      key={item.label}
                      role="menuitem"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        item.onClick();
                      }}
                      className={cn(
                        "block w-full text-start px-3 py-2 hover:bg-muted transition-colors",
                        item.danger ? "text-destructive" : "text-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportControls />
        </div>
      </header>

      {/* ── Split-screen body ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "flex flex-col overflow-hidden border-e",
            "md:w-[42%]",
            mobileTab === "wizard" ? "flex-1 md:flex-none" : "hidden md:flex"
          )}
        >
          <WizardPanel />
        </div>

        <div
          className={cn(
            "flex flex-col overflow-hidden",
            "md:w-[58%]",
            mobileTab === "preview" ? "flex-1 md:flex-none" : "hidden md:flex"
          )}
        >
          <PreviewPanel />
        </div>
      </div>

      {/* ── Mobile tab bar ────────────────────────────────────────── */}
      <div className="md:hidden flex shrink-0 border-t bg-background no-print">
        {(["wizard", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              "flex-1 py-3 text-xs font-semibold capitalize transition-colors",
              mobileTab === tab
                ? "text-foreground border-t-2 border-primary -mt-px"
                : "text-muted-foreground"
            )}
          >
            {tab === "wizard" ? "Wizard" : "Preview"}
          </button>
        ))}
      </div>

      <ResumeImportModal open={importOpen} onClose={() => setImportOpen(false)} />
      <TemplatePickerModal open={templateOpen} onClose={() => setTemplateOpen(false)} />
    </div>
  );
}
