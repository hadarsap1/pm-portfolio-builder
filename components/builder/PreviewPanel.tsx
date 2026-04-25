"use client";

import React from "react";
import { useHydrated } from "@/hooks/useHydrated";
import PreviewShell from "@/components/preview/PreviewShell";
import PreviewSkeleton from "@/components/preview/PreviewSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function PreviewPanel(): React.JSX.Element {
  const hydrated = useHydrated();

  return (
    <div className="h-full overflow-y-auto bg-zinc-50">
      <ErrorBoundary label="Portfolio preview">
        {hydrated ? <PreviewShell /> : <PreviewSkeleton />}
      </ErrorBoundary>
    </div>
  );
}
