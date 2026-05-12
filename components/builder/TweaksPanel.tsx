"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import type { ColorTheme, FontStyle, MetricsDensity } from "@/lib/types/portfolio";

// ── Constants ────────────────────────────────────────────────────

const TONES: { id: ColorTheme; label: string }[] = [
  { id: "minimal", label: "Paper" },
  { id: "bold", label: "Warm" },
  { id: "technical", label: "Cool" },
];

const ACCENT_PRESETS = [
  { hex: "#0891b2", label: "Teal" },
  { hex: "#be185d", label: "Rose" },
  { hex: "#65a30d", label: "Olive" },
  { hex: "#d97706", label: "Amber" },
];

const FONTS: { id: FontStyle; label: string }[] = [
  { id: "modern", label: "Sans" },
  { id: "classic", label: "Serif" },
  { id: "technical", label: "Mono" },
];

const DENSITIES: { id: MetricsDensity; label: string }[] = [
  { id: "full", label: "Full · all tiles" },
  { id: "compact", label: "Compact · 4 tiles" },
];

// ── Component ────────────────────────────────────────────────────

interface TweaksPanelProps {
  onClose: () => void;
}

export default function TweaksPanel({ onClose }: TweaksPanelProps): React.JSX.Element {
  const design = usePortfolioStore((s) => s.design);
  const setDesignPreferences = usePortfolioStore((s) => s.setDesignPreferences);

  const activeAccent = design.customAccentColor ?? null;

  function setTone(theme: ColorTheme): void {
    setDesignPreferences({ colorTheme: theme });
  }

  function setAccent(hex: string): void {
    // Toggling the same swatch clears the override
    setDesignPreferences({ customAccentColor: activeAccent === hex ? undefined : hex });
  }

  function setFont(fontStyle: FontStyle): void {
    setDesignPreferences({ fontStyle });
  }

  function setDensity(density: MetricsDensity): void {
    setDesignPreferences({ metricsDensity: density });
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
        {/* Background Tone */}
        <section>
          <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[oklch(0.75_0.18_350)] mb-2.5">
            Background Tone
          </p>
          <div className="flex gap-2">
            {TONES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTone(id)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                  "bg-white/8 hover:bg-white/14",
                  design.colorTheme === id
                    ? "ring-2 ring-[oklch(0.75_0.18_350)] text-white"
                    : "text-white/60"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Accent */}
        <section>
          <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[oklch(0.75_0.18_350)] mb-2.5">
            Accent
          </p>
          <div className="flex gap-2.5">
            {ACCENT_PRESETS.map(({ hex, label }) => (
              <button
                key={hex}
                onClick={() => setAccent(hex)}
                title={label}
                aria-label={`Accent: ${label}`}
                className={cn(
                  "h-9 flex-1 rounded-lg transition-all",
                  activeAccent === hex
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[oklch(0.14_0.025_185)]"
                    : "opacity-80 hover:opacity-100"
                )}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </section>

        {/* Font */}
        <section>
          <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[oklch(0.75_0.18_350)] mb-2.5">
            Font
          </p>
          <div className="flex gap-2">
            {FONTS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFont(id)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                  "bg-white/8 hover:bg-white/14",
                  (design.fontStyle ?? "modern") === id
                    ? "ring-2 ring-[oklch(0.75_0.18_350)] text-white"
                    : "text-white/60"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Telemetry Density */}
        <section>
          <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-[oklch(0.75_0.18_350)] mb-2.5">
            Metrics Density
          </p>
          <div className="flex gap-2">
            {DENSITIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setDensity(id)}
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
      </div>
    </div>
  );
}
