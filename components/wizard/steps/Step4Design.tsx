"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import type { ColorTheme, LayoutStyle, FontStyle } from "@/lib/types/portfolio";

const COLOR_THEMES: { value: ColorTheme; label: string; description: string; swatch: string }[] = [
  { value: "minimal", label: "Minimal", description: "Clean slate palette", swatch: "bg-slate-700" },
  { value: "bold", label: "Bold", description: "Vibrant violet accent", swatch: "bg-violet-600" },
  { value: "technical", label: "Technical", description: "Emerald green precision", swatch: "bg-emerald-600" },
];

const LAYOUT_STYLES: { value: LayoutStyle; label: string; description: string }[] = [
  { value: "one-column", label: "One Column", description: "Classic linear flow" },
  { value: "two-column", label: "Two Column", description: "Sidebar + main content" },
];

const FONT_STYLES: { value: FontStyle; label: string; description: string }[] = [
  { value: "modern", label: "Modern", description: "Inter — clean sans-serif" },
  { value: "classic", label: "Classic", description: "Georgia — editorial serif" },
  { value: "technical", label: "Technical", description: "JetBrains Mono — code" },
];

export default function Step4Design(): React.JSX.Element {
  const design = usePortfolioStore((s) => s.design);
  const setDesignPreferences = usePortfolioStore((s) => s.setDesignPreferences);

  return (
    <div className="space-y-7 px-6 py-6">
      {/* Color Theme */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Color Theme</h2>
          <p className="text-sm text-zinc-500">Sets the accent color throughout your portfolio.</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {COLOR_THEMES.map(({ value, label, description, swatch }) => (
            <button
              key={value}
              onClick={() => setDesignPreferences({ colorTheme: value })}
              className={cn(
                "rounded-xl border-2 p-4 text-start transition-all",
                design.colorTheme === value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
              )}
            >
              <div className={cn("h-5 w-5 rounded-full mb-2", swatch)} />
              <p className="text-sm font-semibold text-zinc-900">{label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Layout</h2>
          <p className="text-sm text-zinc-500">How sections are arranged on the page.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {LAYOUT_STYLES.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => setDesignPreferences({ layoutStyle: value })}
              className={cn(
                "rounded-xl border-2 p-4 text-start transition-all",
                design.layoutStyle === value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
              )}
            >
              <p className="text-sm font-semibold text-zinc-900">{label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Font Style */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Font Style</h2>
          <p className="text-sm text-zinc-500">Typography sets the overall tone.</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {FONT_STYLES.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => setDesignPreferences({ fontStyle: value })}
              className={cn(
                "rounded-xl border-2 p-4 text-start transition-all",
                design.fontStyle === value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
              )}
            >
              <p className="text-sm font-semibold text-zinc-900">{label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Accent Color */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Custom Accent</h2>
          <p className="text-sm text-zinc-500">Override the theme accent with any color.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={design.customAccentColor ?? "#334155"}
            onChange={(e) => setDesignPreferences({ customAccentColor: e.target.value })}
            className="h-9 w-9 cursor-pointer rounded-lg border border-zinc-200 p-0.5"
          />
          <input
            type="text"
            value={design.customAccentColor ?? ""}
            onChange={(e) => {
              const v = e.target.value.trim();
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setDesignPreferences({ customAccentColor: v || undefined });
            }}
            placeholder="#334155"
            className="h-9 w-28 rounded-lg border border-zinc-200 px-3 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 transition-colors"
          />
          {design.customAccentColor && (
            <button
              onClick={() => setDesignPreferences({ customAccentColor: undefined })}
              className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
