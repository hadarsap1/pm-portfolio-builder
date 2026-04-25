"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: readonly string[];
  hasContent: boolean[];
  onStepClick: (index: number) => void;
}

export default function WizardProgress({
  currentStep,
  totalSteps,
  labels,
  hasContent,
  onStepClick,
}: WizardProgressProps): React.JSX.Element {
  return (
    <div className="px-6 py-5 border-b bg-white">
      <div className="flex items-center gap-0">
        {labels.slice(0, totalSteps).map((label, index) => {
          const isVisited = index < currentStep;
          const isActive = index === currentStep;
          const isFuture = index > currentStep;
          const filled = hasContent[index] ?? false;

          // A visited step with no content gets a softer treatment
          const isDoneWithContent = isVisited && filled;
          const isDoneEmpty = isVisited && !filled;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => onStepClick(index)}
                className={cn(
                  "flex flex-col items-center gap-1.5 group focus:outline-none",
                  isFuture ? "cursor-pointer opacity-60 hover:opacity-100" : "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold border-2 transition-colors",
                    isDoneWithContent && "bg-zinc-900 border-zinc-900 text-white group-hover:bg-zinc-700 group-hover:border-zinc-700",
                    isDoneEmpty && "bg-zinc-200 border-zinc-200 text-zinc-500 group-hover:bg-zinc-300",
                    isActive && filled && "bg-white border-zinc-900 text-zinc-900 ring-2 ring-zinc-900/10",
                    isActive && !filled && "bg-white border-zinc-900 text-zinc-900",
                    isFuture && "bg-white border-zinc-300 text-zinc-400 group-hover:border-zinc-500"
                  )}
                >
                  {isDoneWithContent ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isDoneEmpty ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap transition-colors",
                    isActive ? "text-zinc-900" : "text-zinc-400"
                  )}
                >
                  {label}
                </span>
              </button>

              {/* Connector line */}
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-2 mb-5 transition-colors",
                    index < currentStep
                      ? filled ? "bg-zinc-900" : "bg-zinc-300"
                      : "bg-zinc-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
