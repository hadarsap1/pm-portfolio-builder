"use client";

import { useEffect, useState } from "react";

/**
 * Returns true after the component has mounted client-side.
 * Used to defer rendering until Zustand persist has hydrated from localStorage,
 * preventing a flash of default store values.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
