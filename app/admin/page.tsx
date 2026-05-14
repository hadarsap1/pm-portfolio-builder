"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";

interface AppEvent {
  type: string;
  ts: number;
  meta?: Record<string, string>;
}

interface DashboardData {
  events: AppEvent[];
  count: number;
}

const EVENT_LABELS: Record<string, string> = {
  builder_open:  "Builder opens",
  wizard_complete: "Wizard completions",
  resume_import: "Resume imports",
  template_apply: "Template applies",
  ai_polish:     "AI voice polish",
  ai_bespoke:    "AI image generate",
  export_html:   "HTML exports",
  export_pdf:    "PDF exports",
  deploy_github: "GitHub deploys",
  deploy_vercel: "Vercel deploys",
  gallery_submit: "Gallery submissions",
  share_view:    "Portfolio views",
};

const EVENT_ORDER = Object.keys(EVENT_LABELS);

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function dayKey(ts: number): string {
  return new Date(ts).toISOString().split("T")[0];
}

function fmt(ts: number): string {
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function Bar({ value, max }: { value: number; max: number }): React.JSX.Element {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
      <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
      <p className="text-3xl font-black text-zinc-900 mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminPage(): React.JSX.Element {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/app-events?key=${encodeURIComponent(key)}`);
      if (res.status === 401) { setError("Wrong password."); return; }
      if (!res.ok) { setError("Server error."); return; }
      const json = (await res.json()) as DashboardData;
      setData(json);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-full max-w-sm space-y-4 p-8">
          <h1 className="text-xl font-bold text-zinc-900">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500">Enter your ADMIN_PASSWORD to continue.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); void fetchData(password); }}
            className="space-y-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              autoFocus
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-zinc-900 text-white rounded-lg py-2 text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Checking…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const events = data.events;
  const today = todayKey();

  // ── Counts ────────────────────────────────────────────────────────
  const byType = EVENT_ORDER.reduce<Record<string, number>>((acc, t) => {
    acc[t] = events.filter((e) => e.type === t).length;
    return acc;
  }, {});

  const todayCount = events.filter((e) => dayKey(e.ts) === today).length;
  const maxCount = Math.max(...Object.values(byType), 1);

  // ── Funnel ────────────────────────────────────────────────────────
  const opens = byType["builder_open"] ?? 0;
  const completes = byType["wizard_complete"] ?? 0;
  const exports = (byType["export_html"] ?? 0) + (byType["export_pdf"] ?? 0) +
    (byType["deploy_github"] ?? 0) + (byType["deploy_vercel"] ?? 0);
  const funnelPct = (n: number, base: number) =>
    base > 0 ? `${Math.round((n / base) * 100)}%` : "—";

  // ── Last 7 days timeline ─────────────────────────────────────────
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  const byDay = days.map((d) => ({ day: d, count: events.filter((e) => dayKey(e.ts) === d).length }));
  const maxDay = Math.max(...byDay.map((d) => d.count), 1);

  // ── Template popularity ─────────────────────────────────────────
  const templateCounts: Record<string, number> = {};
  for (const e of events) {
    if (e.type === "template_apply" && e.meta?.templateId) {
      templateCounts[e.meta.templateId] = (templateCounts[e.meta.templateId] ?? 0) + 1;
    }
  }
  const topTemplates = Object.entries(templateCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // ── Recent events ────────────────────────────────────────────────
  const recent = [...events].sort((a, b) => b.ts - a.ts).slice(0, 30);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">PM Portfolio Builder — Admin</h1>
            <p className="text-xs text-zinc-400 mt-0.5">{events.length} events in memory · resets on cold start</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => void fetchData(password)}
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Refresh
            </button>
            <Link href="/builder" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
              Builder →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total events" value={events.length} />
          <StatCard label="Today" value={todayCount} sub={today} />
          <StatCard label="Wizard completions" value={completes} sub={opens > 0 ? `${funnelPct(completes, opens)} of opens` : undefined} />
          <StatCard label="Exports / deploys" value={exports} sub={completes > 0 ? `${funnelPct(exports, completes)} of completions` : undefined} />
        </div>

        {/* Funnel */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Funnel</h2>
          <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100">
            {[
              { label: "Builder opens", count: opens, pct: "100%" },
              { label: "Resume imports", count: byType["resume_import"] ?? 0, pct: funnelPct(byType["resume_import"] ?? 0, opens) },
              { label: "Wizard completions", count: completes, pct: funnelPct(completes, opens) },
              { label: "Exports + deploys", count: exports, pct: funnelPct(exports, opens) },
              { label: "Gallery submissions", count: byType["gallery_submit"] ?? 0, pct: funnelPct(byType["gallery_submit"] ?? 0, opens) },
            ].map(({ label, count, pct }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-3">
                <span className="text-sm text-zinc-700 w-44 shrink-0">{label}</span>
                <Bar value={count} max={opens || 1} />
                <span className="text-sm font-semibold text-zinc-900 tabular-nums w-8 text-end">{count}</span>
                <span className="text-xs text-zinc-400 w-10 text-end">{pct}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Last 7 days */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Last 7 days</h2>
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <div className="flex items-end gap-2 h-20">
              {byDay.map(({ day, count }) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-zinc-900 transition-all"
                    style={{ height: `${Math.round((count / maxDay) * 64)}px`, minHeight: count > 0 ? "4px" : "0" }}
                  />
                  <span className="text-[9px] text-zinc-400">{day.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature breakdown */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">All events</h2>
          <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100">
            {EVENT_ORDER.filter((t) => (byType[t] ?? 0) > 0 || t === "builder_open").map((type) => (
              <div key={type} className="flex items-center gap-4 px-5 py-3">
                <span className="text-sm text-zinc-700 w-44 shrink-0">{EVENT_LABELS[type]}</span>
                <Bar value={byType[type] ?? 0} max={maxCount} />
                <span className="text-sm font-semibold text-zinc-900 tabular-nums w-8 text-end">
                  {byType[type] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Template popularity */}
        {topTemplates.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Top templates</h2>
            <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100">
              {topTemplates.map(([id, count]) => (
                <div key={id} className="flex items-center gap-4 px-5 py-3">
                  <span className="text-sm text-zinc-600 font-mono w-44 shrink-0 truncate">{id}</span>
                  <Bar value={count} max={topTemplates[0]?.[1] ?? 1} />
                  <span className="text-sm font-semibold text-zinc-900 tabular-nums w-8 text-end">{count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent events */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Recent events</h2>
          <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100">
            {recent.length === 0 ? (
              <p className="px-5 py-6 text-sm text-zinc-400 text-center">No events yet.</p>
            ) : recent.map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                <span className="text-[10px] font-mono text-zinc-400 shrink-0">{fmt(e.ts)}</span>
                <span className="text-xs font-medium text-zinc-700">{EVENT_LABELS[e.type] ?? e.type}</span>
                {e.meta && Object.keys(e.meta).length > 0 && (
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {Object.entries(e.meta).map(([k, v]) => `${k}=${v}`).join(" ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
