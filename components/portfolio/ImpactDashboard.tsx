"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Metric, MetricsDensity } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";
import CountUp from "@/components/portfolio/motion/CountUp";
import Stagger from "@/components/portfolio/motion/Stagger";

interface ImpactDashboardProps {
  metrics: Metric[];
  accent: AccentConfig;
  density?: MetricsDensity;
}

/** Extract a usable float from strings like "$12M", "340%", "3.8x", "47" */
function parseMetricValue(raw: string): number | null {
  const cleaned = raw.replace(/[$,%x\s]/gi, "");
  // Handle multipliers: 12M → 12, 2.4B → 2400, 340K → 340
  const multipliers: Record<string, number> = { k: 1, m: 1, b: 1000, t: 1000000 };
  const match = cleaned.match(/^([\d.]+)([kmbt]?)$/i);
  if (!match) return null;
  const base = parseFloat(match[1]);
  if (isNaN(base)) return null;
  const suffix = match[2].toLowerCase();
  return base * (multipliers[suffix] ?? 1);
}

export default function ImpactDashboard({ metrics, accent, density = "full" }: ImpactDashboardProps): React.JSX.Element | null {
  if (metrics.length === 0) return null;

  const visibleMetrics = density === "compact" ? metrics.slice(0, 4) : metrics;

  const chartData = visibleMetrics
    .map((m) => ({ ...m, numericValue: parseMetricValue(m.value) }))
    .filter((m) => m.numericValue !== null);

  const showChart = chartData.length >= 2;

  return (
    <div className="space-y-4">
      {/* Stat cards — staggered reveal + animated count-up on each value */}
      <Stagger className="grid grid-cols-3 gap-3" step={0.1}>
        {visibleMetrics.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-xl border p-4 bg-white ring-1 transition-all duration-300",
              "hover:-translate-y-0.5 hover:shadow-sm",
              accent.border,
              accent.ring
            )}
          >
            <p className={cn("text-2xl font-bold tabular-nums", accent.heading)}>
              {m.value ? <CountUp value={m.value} /> : "—"}
            </p>
            <p className="mt-0.5 text-xs font-medium text-zinc-600">{m.label || "Label"}</p>
            {m.context && (
              <p className="mt-0.5 text-[10px] text-zinc-400">{m.context}</p>
            )}
          </div>
        ))}
      </Stagger>

      {/* Recharts bar chart — only when 2+ parseable values exist */}
      {showChart && (
        <div className="rounded-xl border bg-white p-4" style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              barSize={28}
            >
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(_value, _name, props) =>
                  [(props.payload as (Metric & { numericValue: number }) | undefined)?.value ?? "", ""] as [string, string]
                }
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid #e4e4e7",
                  boxShadow: "none",
                }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />
              <Bar dataKey="numericValue" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={accent.barFill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
