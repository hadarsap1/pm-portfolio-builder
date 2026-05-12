"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Metric, MetricsDensity } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";
import CountUp from "@/components/portfolio/motion/CountUp";
import Stagger from "@/components/portfolio/motion/Stagger";

interface ImpactDashboardProps {
  metrics: Metric[];
  accent: AccentConfig;
  density?: MetricsDensity;
}

/** Scale font size down for longer value strings so they don't wrap awkwardly. */
function valueFontClass(value: string): string {
  if (value.length <= 4) return "text-5xl";
  if (value.length <= 7) return "text-4xl";
  return "text-3xl";
}

export default function ImpactDashboard({ metrics, accent, density = "full" }: ImpactDashboardProps): React.JSX.Element | null {
  if (metrics.length === 0) return null;

  const visibleMetrics = density === "compact" ? metrics.slice(0, 4) : metrics;
  const count = visibleMetrics.length;
  const colClass =
    count === 1 ? "grid-cols-1" :
    count === 2 ? "grid-cols-2" :
    count === 3 ? "grid-cols-3" :
    "grid-cols-2 sm:grid-cols-4";

  return (
    <Stagger className={cn("grid gap-x-12 gap-y-10 items-start", colClass)} step={0.08}>
      {visibleMetrics.map((m) => (
        <div key={m.id} className="space-y-1.5">
          <p
            className={cn("font-black tabular-nums leading-none tracking-tight", valueFontClass(m.value), accent.heading)}
            style={accent.customHex ? { color: accent.customHex } : undefined}
          >
            {m.value ? <CountUp value={m.value} /> : "—"}
          </p>
          <p className="text-sm font-semibold text-zinc-800 mt-2">{m.label || "Label"}</p>
          {m.context && (
            <p className="text-xs text-zinc-400 leading-relaxed">{m.context}</p>
          )}
        </div>
      ))}
    </Stagger>
  );
}
