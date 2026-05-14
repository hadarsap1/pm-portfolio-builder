"use client";

import type { AppEventType } from "@/lib/server/app-events";

export function trackEvent(type: AppEventType, meta?: Record<string, string>): void {
  fetch("/api/app-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, meta }),
  }).catch(() => {});
}
