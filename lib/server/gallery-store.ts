// In-process public-gallery store. Mirrors analytics-store pattern.
// NOTE: Resets on cold starts / serverless restart. For production, replace with Vercel KV or a DB.

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

// portfolioId → entry (so re-listing replaces in place)
const galleryStore = new Map<string, GalleryEntry>();

export function listGallery(): GalleryEntry[] {
  return Array.from(galleryStore.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function upsertGalleryEntry(entry: Omit<GalleryEntry, "createdAt">): GalleryEntry {
  const existing = galleryStore.get(entry.portfolioId);
  const stored: GalleryEntry = {
    ...entry,
    createdAt: existing?.createdAt ?? Date.now(),
  };
  galleryStore.set(entry.portfolioId, stored);

  // FIFO eviction once over cap — drop oldest by createdAt
  if (galleryStore.size > MAX_ENTRIES) {
    const oldest = Array.from(galleryStore.values()).sort(
      (a, b) => a.createdAt - b.createdAt
    )[0];
    if (oldest) galleryStore.delete(oldest.portfolioId);
  }

  return stored;
}

export function removeGalleryEntry(portfolioId: string): boolean {
  return galleryStore.delete(portfolioId);
}
