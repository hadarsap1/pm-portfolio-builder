// In-process public-gallery store.
// NOTE: Resets on cold starts / serverless restart. For production, replace with Vercel KV or a DB.
//
// We hang the Map off `globalThis` because Next.js dev (Turbopack) and the
// production runtime can give app routes and API routes separate module
// instances. A plain module-level singleton then ends up as two empty maps —
// posts go to one, GETs hit the other.

export interface GalleryEntry {
  portfolioId: string;
  name: string;
  title: string;
  summary: string;
  superpower: string;
  colorTheme: string;
  shareUrl: string;
  createdAt: number;
}

const MAX_ENTRIES = 100;

const GLOBAL_KEY = Symbol.for("pm-portfolio.gallery-store");
type GalleryGlobal = typeof globalThis & {
  [GLOBAL_KEY]?: Map<string, GalleryEntry>;
};

function store(): Map<string, GalleryEntry> {
  const g = globalThis as GalleryGlobal;
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = new Map<string, GalleryEntry>();
  return g[GLOBAL_KEY];
}

export function listGallery(): GalleryEntry[] {
  return Array.from(store().values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function upsertGalleryEntry(entry: Omit<GalleryEntry, "createdAt">): GalleryEntry {
  const map = store();
  const existing = map.get(entry.portfolioId);
  const stored: GalleryEntry = {
    ...entry,
    createdAt: existing?.createdAt ?? Date.now(),
  };
  map.set(entry.portfolioId, stored);

  // FIFO eviction once over cap — drop oldest by createdAt
  if (map.size > MAX_ENTRIES) {
    const oldest = Array.from(map.values()).sort(
      (a, b) => a.createdAt - b.createdAt
    )[0];
    if (oldest) map.delete(oldest.portfolioId);
  }

  return stored;
}

export function removeGalleryEntry(portfolioId: string): boolean {
  return store().delete(portfolioId);
}
