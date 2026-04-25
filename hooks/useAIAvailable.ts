"use client";

import { useEffect, useState } from "react";

// Module-level cache — one fetch per page session
let cached: boolean | null = null;

export function useAIAvailable(): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(cached);

  useEffect(() => {
    if (cached !== null) return;
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((d: { available: boolean }) => {
        cached = d.available;
        setAvailable(d.available);
      })
      .catch(() => {
        cached = false;
        setAvailable(false);
      });
  }, []);

  return available;
}
