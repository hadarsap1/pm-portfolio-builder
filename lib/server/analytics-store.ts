// Singleton analytics store shared across API route modules within the same Node.js process.
// NOTE: Resets on cold starts / serverless restart. For production, replace with Vercel KV or a DB.

export interface AnalyticsEvent {
  ts: number;
  referrer: string;
  ua: string;
}

// Module-level singleton — shared across all imports within the same process
const analyticsStore = new Map<string, AnalyticsEvent[]>();

export function recordEvent(id: string, event: Omit<AnalyticsEvent, "ts">): void {
  const events = analyticsStore.get(id) ?? [];
  events.push({ ts: Date.now(), ...event });
  analyticsStore.set(id, events);
}

export function getEvents(id: string): AnalyticsEvent[] {
  return analyticsStore.get(id) ?? [];
}
