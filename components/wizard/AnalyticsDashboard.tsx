"use client";

import React, { useEffect, useState } from "react";
import { usePortfolioStore } from "@/lib/store/portfolio-store";

interface Stats {
  views: number;
  uniqueDates: string[];
  referrers: { url: string; count: number }[];
}

export default function AnalyticsDashboard(): React.JSX.Element {
  const portfolioId = usePortfolioStore((s) => s.portfolio.portfolioId);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/analytics/stats?id=${encodeURIComponent(portfolioId)}`)
      .then((r) => r.json())
      .then((data: Stats) => { if (!cancelled) setStats(data); })
      .catch(() => { if (!cancelled) setStats({ views: 0, uniqueDates: [], referrers: [] }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-100 p-4 animate-pulse space-y-2">
        <div className="h-3 w-24 bg-zinc-100 rounded" />
        <div className="h-6 w-12 bg-zinc-100 rounded" />
      </div>
    );
  }

  if (!stats || stats.views === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-center">
        <p className="text-xs text-zinc-400">No views tracked yet.</p>
        <p className="text-[10px] text-zinc-300 mt-1">
          Views are recorded when visitors load your deployed portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-4 space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Portfolio Views</p>

      <div className="flex gap-6">
        <div>
          <p className="text-2xl font-extrabold text-zinc-900">{stats.views}</p>
          <p className="text-[10px] text-zinc-400">Total views</p>
        </div>
        <div>
          <p className="text-2xl font-extrabold text-zinc-900">{stats.uniqueDates.length}</p>
          <p className="text-[10px] text-zinc-400">Active days</p>
        </div>
      </div>

      {stats.referrers.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-zinc-400">Top referrers</p>
          {stats.referrers.slice(0, 5).map(({ url, count }) => (
            <div key={url} className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 truncate max-w-[180px]">{url}</span>
              <span className="text-zinc-400 shrink-0 ms-2">{count}×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
