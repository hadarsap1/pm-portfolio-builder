"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import type { MetricsDensity } from "@/lib/types/portfolio";

const ACCENT_PRESETS = [
  { hex: "#0891b2", label: "Teal" },
  { hex: "#be185d", label: "Rose" },
  { hex: "#65a30d", label: "Olive" },
  { hex: "#d97706", label: "Amber" },
  { hex: "#7c3aed", label: "Violet" },
  { hex: "#dc2626", label: "Red" },
];

const DENSITIES: { id: MetricsDensity; label: string }[] = [
  { id: "full", label: "All" },
  { id: "compact", label: "Top 4" },
];

interface TweaksPanelProps {
  onClose: () => void;
}

export default function TweaksPanel({ onClose }: TweaksPanelProps): React.JSX.Element {
  const design = usePortfolioStore((s) => s.design);
  const setDesignPreferences = usePortfolioStore((s) => s.setDesignPreferences);

  const activeAccent = design.customAccentColor ?? null;
  const showNav = design.showStickyNav !== false;
  const showFooter = design.showFooterCTA !== false;

  function setAccent(hex: string): void {
    setDesignPreferences({ customAccentColor: activeAccent === hex ? undefined : hex });
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 end-6 z-50 w-72 rounded-2xl shadow-2xl",
        "bg-[oklch(0.14_0.025_185)] text-white",
        "border border-white/10 backdrop-blur-sm"
      )}
      role="dialog"
      aria-label="Design tweaks"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10">
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[oklch(0.75_0.18_350)]">
          Tweaks
        </span>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors"
          aria-label="Close tweaks panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Accent color presets */}
        <section>
          <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[oklch(0.75_0.18_350)] mb-2.5">
            Accent Color
          </p>
          <div className="grid grid-cols-6 gap-2">
            {ACCENT_PRESETS.map(({ hex, label }) => (
              <button
                key={hex}
                onClick={() => setAccent(hex)}
                title={label}
                aria-label={`Accent: ${label}`}
                className={cn(
                  "h-7 w-full rounded-lg transition-all",
                  activeAccent === hex
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[oklch(0.14_0.025_185)]"
                    : "opacity-70 hover:opacity-100"
                )}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          {activeAccent && (
            <button
              onClick={() => setDesignPreferences({ customAccentColor: undefined })}
              className="mt-2 text-[10px] text-white/40 hover:text-white/70 transition-colors"
            >
              Clear override
            </button>
          )}
        </section>

        {/* Metrics density */}
        <section>
          <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[oklch(0.75_0.18_350)] mb-2.5">
            Metrics Shown
          </p>
          <div className="flex gap-2">
            {DENSITIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setDesignPreferences({ metricsDensity: id })}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                  "bg-white/8 hover:bg-white/14",
                  (design.metricsDensity ?? "full") === id
                    ? "ring-2 ring-[oklch(0.75_0.18_350)] text-white"
                    : "text-white/60"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Sticky nav */}
        <section>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[oklch(0.75_0.18_350)]">
              Sticky Navigation
            </p>
            <button
              onClick={() => setDesignPreferences({ showStickyNav: !showNav })}
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                showNav ? "bg-[oklch(0.75_0.18_350)]" : "bg-white/20"
              )}
              aria-pressed={showNav}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                  showNav ? "translate-x-4" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </section>

        {/* Footer CTA */}
        <section>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[oklch(0.75_0.18_350)]">
              Footer CTA
            </p>
            <button
              onClick={() => setDesignPreferences({ showFooterCTA: !showFooter })}
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                showFooter ? "bg-[oklch(0.75_0.18_350)]" : "bg-white/20"
              )}
              aria-pressed={showFooter}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                  showFooter ? "translate-x-4" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
