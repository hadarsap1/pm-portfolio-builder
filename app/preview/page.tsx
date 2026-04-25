import React, { Suspense } from "react";
import PreviewShell from "@/components/preview/PreviewShell";
import PrintTrigger from "@/components/preview/PrintTrigger";

export default function PreviewPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      {/* PrintTrigger uses useSearchParams — must be inside Suspense */}
      <Suspense>
        <PrintTrigger />
      </Suspense>
      <PreviewShell />
    </div>
  );
}
