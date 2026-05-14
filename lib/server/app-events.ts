// App-level usage analytics — tracks builder actions, not portfolio views.
// Uses the same globalThis singleton pattern as gallery-store so dev HMR
// and prod serverless both share one instance per process.
// NOTE: Data resets on cold starts. Add BLOB_READ_WRITE_TOKEN + Vercel Blob
// persistence when you need durability beyond the current process lifetime.

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

const GLOBAL_KEY = Symbol.for("pm-portfolio.app-events");
type EventsGlobal = typeof globalThis & { [GLOBAL_KEY]?: AppEvent[] };

function store(): AppEvent[] {
  const g = globalThis as EventsGlobal;
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = [];
  return g[GLOBAL_KEY];
}

const MAX_EVENTS = 10_000;

export function recordAppEvent(type: AppEventType, meta?: Record<string, string>): void {
  const s = store();
  s.push({ type, ts: Date.now(), meta });
  if (s.length > MAX_EVENTS) s.splice(0, s.length - MAX_EVENTS);
}

export function getAllEvents(): AppEvent[] {
  return [...store()];
}
