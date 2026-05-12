import type { ColorTheme, DesignPreferences } from "@/lib/types/portfolio";

export interface AccentConfig {
  heading: string;
  border: string;
  badge: string;
  barFill: string;
  ring: string;
  heroBg: string;
  divider: string;
  /** When set, apply as inline style color override on accent-colored text elements */
  customHex?: string;
}

export const ACCENT: Record<ColorTheme, AccentConfig> = {
  minimal: {
    heading: "text-slate-700",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-700",
    barFill: "#475569",
    ring: "ring-slate-200",
    heroBg: "bg-slate-50",
    divider: "bg-slate-200",
  },
  bold: {
    heading: "text-violet-600",
    border: "border-violet-200",
    badge: "bg-violet-50 text-violet-700",
    barFill: "#7c3aed",
    ring: "ring-violet-200",
    heroBg: "bg-violet-50",
    divider: "bg-violet-100",
  },
  technical: {
    heading: "text-emerald-600",
    border: "border-emerald-200",
    badge: "bg-emerald-50 text-emerald-700",
    barFill: "#059669",
    ring: "ring-emerald-200",
    heroBg: "bg-emerald-50",
    divider: "bg-emerald-100",
  },
};

/** Returns the accent config for the given design, merging customAccentColor when present. */
export function getAccent(design: Pick<DesignPreferences, "colorTheme" | "customAccentColor">): AccentConfig {
  const base = ACCENT[design.colorTheme];
  if (!design.customAccentColor) return base;
  return { ...base, barFill: design.customAccentColor, customHex: design.customAccentColor };
}
