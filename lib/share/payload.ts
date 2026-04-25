import type {
  DesignPreferences,
  PortfolioData,
  StrategicFocus,
} from "@/lib/types/portfolio";

export interface SharePayload {
  portfolio: PortfolioData;
  design: DesignPreferences;
  strategy: StrategicFocus;
}

/**
 * Decode a URL-safe base64 share payload.
 * Works in both Node and browser environments — uses Buffer when available
 * (server) and atob in the browser.
 */
export function decodeSharePayload(encoded: string): SharePayload | null {
  if (!encoded) return null;
  try {
    // Restore standard base64 padding + characters
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4);
    const padded = normalized + "=".repeat(pad);

    const json =
      typeof Buffer !== "undefined"
        ? Buffer.from(padded, "base64").toString("utf8")
        : atob(padded);

    return JSON.parse(json) as SharePayload;
  } catch {
    return null;
  }
}
