"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true after the component has mounted client-side.
 * Used to defer rendering until Zustand persist has hydrated from localStorage,
 * preventing a flash of default store values.
 *
 * Implemented with useSyncExternalStore so the React 19 lint rule
 * `react-hooks/set-state-in-effect` stays clean — it warns on the older
 * useEffect+setState pattern which can cause cascading renders.
 */
const subscribe = (): (() => void) => () => {};
const getSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
