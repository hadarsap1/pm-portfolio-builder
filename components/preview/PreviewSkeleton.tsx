import React from "react";

function Bone({ className }: { className: string }): React.JSX.Element {
  return <div className={`bg-zinc-100 rounded animate-pulse ${className}`} />;
}

export default function PreviewSkeleton(): React.JSX.Element {
  return (
    <div className="max-w-2xl mx-auto px-8 py-10 space-y-10">
      {/* Hero */}
      <div className="border-b border-zinc-100 pb-7 space-y-3">
        <Bone className="h-8 w-48" />
        <Bone className="h-4 w-36" />
        <div className="flex gap-4 mt-3">
          <Bone className="h-3 w-28" />
          <Bone className="h-3 w-20" />
        </div>
        <div className="space-y-2 mt-4">
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-5/6" />
          <Bone className="h-3 w-4/6" />
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <Bone className="h-2.5 w-24" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-zinc-100 rounded-xl p-4 space-y-2">
              <Bone className="h-6 w-16" />
              <Bone className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-5">
        <Bone className="h-2.5 w-24" />
        {[0, 1].map((i) => (
          <div key={i} className="ps-5 space-y-2">
            <Bone className="h-4 w-40" />
            <Bone className="h-3 w-28" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
