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
 * (server) and atob + TextDecoder in the browser. atob alone returns a
 * Latin1 binary string, which mangles any multi-byte UTF-8 character
 * (emoji, Hebrew, anything outside ASCII).
 */
export function decodeSharePayload(encoded: string): SharePayload | null {
  if (!encoded) return null;
  try {
    // Restore standard base64 padding + characters
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4);
    const padded = normalized + "=".repeat(pad);

    let json: string;
    if (typeof Buffer !== "undefined") {
      json = Buffer.from(padded, "base64").toString("utf8");
    } else {
      const binary = atob(padded);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    }

    return JSON.parse(json) as SharePayload;
  } catch {
    return null;
  }
}
