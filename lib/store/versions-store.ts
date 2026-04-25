"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import type { DesignPreferences, PortfolioData, StrategicFocus } from "@/lib/types/portfolio";

export interface PortfolioVersion {
  id: string;
  name: string;
  savedAt: string; // ISO 8601
  portfolio: PortfolioData;
  design: DesignPreferences;
  strategy: StrategicFocus;
}

interface VersionsStore {
  versions: PortfolioVersion[];
  saveVersion: (name: string) => void;
  loadVersion: (id: string) => void;
  deleteVersion: (id: string) => void;
}

export const useVersionsStore = create<VersionsStore>()(
  persist(
    (set, get) => ({
      versions: [],

      saveVersion: (name) => {
        const s = usePortfolioStore.getState();
        const version: PortfolioVersion = {
          id: crypto.randomUUID(),
          name: name.trim() || "Untitled",
          savedAt: new Date().toISOString(),
          portfolio: s.portfolio,
          design: s.design,
          strategy: s.strategy,
        };
        set((state) => ({ versions: [version, ...state.versions] }));
      },

      loadVersion: (id) => {
        const version = get().versions.find((v) => v.id === id);
        if (!version) return;
        usePortfolioStore.setState({
          portfolio: version.portfolio,
          design: version.design,
          strategy: version.strategy,
        });
      },

      deleteVersion: (id) => {
        set((state) => ({ versions: state.versions.filter((v) => v.id !== id) }));
      },
    }),
    { name: "pm-portfolio-versions" }
  )
);
