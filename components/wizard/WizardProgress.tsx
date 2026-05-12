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
    <div className="px-6 py-5 border-b bg-background">
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
                    isDoneWithContent && "bg-primary border-primary text-primary-foreground hover:opacity-90",
                    isDoneEmpty && "bg-muted border-border text-muted-foreground group-hover:border-muted-foreground",
                    isActive && filled && "bg-background border-primary text-foreground ring-2 ring-primary/15",
                    isActive && !filled && "bg-background border-primary text-foreground",
                    isFuture && "bg-background border-border text-muted-foreground group-hover:border-muted-foreground"
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
                    isActive ? "text-foreground" : "text-muted-foreground"
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
                      ? filled ? "bg-primary" : "bg-border"
                      : "bg-border"
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
