"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import PreviewShell from "@/components/preview/PreviewShell";
import PreviewSkeleton from "@/components/preview/PreviewSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import TweaksPanel from "@/components/builder/TweaksPanel";

export default function PreviewPanel(): React.JSX.Element {
  const hydrated = useHydrated();
  const [tweaksOpen, setTweaksOpen] = useState(false);

  return (
    <div className="relative h-full overflow-y-auto bg-zinc-50">
      <ErrorBoundary label="Portfolio preview">
        {hydrated ? <PreviewShell /> : <PreviewSkeleton />}
      </ErrorBoundary>

      {!tweaksOpen && (
        <button
          onClick={() => setTweaksOpen(true)}
          aria-label="Design tweaks"
          className={cn(
            "fixed bottom-6 end-6 z-40 flex items-center gap-2 rounded-full",
            "bg-zinc-900 text-white px-4 py-2.5 text-xs font-semibold",
            "shadow-xl hover:bg-zinc-700 transition-all"
          )}
        >
          <SlidersHorizontal size={13} />
          Tweaks
        </button>
      )}

      {tweaksOpen && <TweaksPanel onClose={() => setTweaksOpen(false)} />}
    </div>
  );
}
