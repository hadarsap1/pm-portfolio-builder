// App-level usage analytics.
// Persists to Vercel Blob (BLOB_READ_WRITE_TOKEN) when available.
// Falls back to in-process memory when the token is absent (dev / cold-start only).

import { put, head } from "@vercel/blob";

export type AppEventType =
  | "builder_open"
  | "wizard_complete"
  | "resume_import"
  | "template_apply"
  | "ai_polish"
  | "ai_bespoke"
  | "export_html"
  | "export_pdf"
  | "deploy_github"
  | "deploy_vercel"
  | "gallery_submit"
  | "share_view";

export interface AppEvent {
  type: AppEventType;
  ts: number;
  meta?: Record<string, string>;
}

// ── In-memory cache ───────────────────────────────────────────────
// Shared within the same Node.js process via globalThis, so hot-reloads
// and multi-module imports see the same array.

const GLOBAL_KEY = Symbol.for("pm-portfolio.app-events");
type G = typeof globalThis & {
  [GLOBAL_KEY]?: { events: AppEvent[]; loaded: boolean };
};

function cache(): { events: AppEvent[]; loaded: boolean } {
  const g = globalThis as G;
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = { events: [], loaded: false };
  return g[GLOBAL_KEY];
}

// ── Blob helpers ──────────────────────────────────────────────────

const BLOB_PATH = "pm-portfolio/events.json";
const MAX_EVENTS = 5_000;

function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

async function readFromBlob(): Promise<AppEvent[]> {
  try {
    // head() returns metadata including the public URL
    const info = await head(BLOB_PATH);
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as AppEvent[];
  } catch {
    return [];
  }
}

async function writeToBlob(events: AppEvent[]): Promise<void> {
  try {
    await put(BLOB_PATH, JSON.stringify(events), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });
  } catch {
    // Silently degrade — in-memory cache still works
  }
}

// ── Public API ────────────────────────────────────────────────────

export function recordAppEvent(type: AppEventType, meta?: Record<string, string>): void {
  const c = cache();
  c.events.push({ type, ts: Date.now(), meta });
  if (c.events.length > MAX_EVENTS) {
    c.events.splice(0, c.events.length - MAX_EVENTS);
  }

  if (blobEnabled()) {
    void writeToBlob([...c.events]);
  }
}

export async function getAllEvents(): Promise<AppEvent[]> {
  const c = cache();

  if (blobEnabled() && !c.loaded) {
    const blobEvents = await readFromBlob();
    // Merge blob history with any events captured since cold-start
    const seen = new Set(c.events.map((e) => `${e.type}:${e.ts}`));
    for (const e of blobEvents) {
      if (!seen.has(`${e.type}:${e.ts}`)) {
        c.events.push(e);
      }
    }
    c.events.sort((a, b) => a.ts - b.ts);
    if (c.events.length > MAX_EVENTS) {
      c.events.splice(0, c.events.length - MAX_EVENTS);
    }
    c.loaded = true;
  }

  return [...c.events];
}
