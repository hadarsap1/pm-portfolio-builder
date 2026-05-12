import React, { Suspense } from "react";
import BuilderLayout from "@/components/builder/BuilderLayout";

export default function BuilderPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-sm text-muted-foreground">
          Loading editor…
        </div>
      }
    >
      <BuilderLayout />
    </Suspense>
  );
}
