"use client";

import React, { useEffect } from "react";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import WizardProgress from "@/components/wizard/WizardProgress";
import WizardNavigation from "@/components/wizard/WizardNavigation";
import CompletionPanel from "@/components/wizard/CompletionPanel";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Step0BasicInfo from "@/components/wizard/steps/Step0BasicInfo";
import Step1Experience from "@/components/wizard/steps/Step1Experience";
import Step2Projects from "@/components/wizard/steps/Step2Projects";
import Step3Education from "@/components/wizard/steps/Step2Education";
import Step4Skills from "@/components/wizard/steps/Step2Skills";
import Step5Strategy from "@/components/wizard/steps/Step3Strategy";
import Step6Design from "@/components/wizard/steps/Step4Design";

const STEPS = [
  Step0BasicInfo,
  Step1Experience,
  Step2Projects,
  Step3Education,
  Step4Skills,
  Step5Strategy,
  Step6Design,
] as const;

const STEP_LABELS = ["Basic Info", "Experience", "Projects", "Education", "Skills", "Strategy", "Design"] as const;

function useStepHasContent(): boolean[] {
  const name = usePortfolioStore((s) => s.portfolio.basicInfo.name);
  const experience = usePortfolioStore((s) => s.portfolio.experience);
  const projects = usePortfolioStore((s) => s.portfolio.projects);
  const education = usePortfolioStore((s) => s.portfolio.education);
  const certifications = usePortfolioStore((s) => s.portfolio.certifications);
  const skills = usePortfolioStore((s) => s.portfolio.skills);
  const toneKeywords = usePortfolioStore((s) => s.strategy.toneKeywords);
  return [
    /* 0 Basic Info */    Boolean(name && name !== "Your Name"),
    /* 1 Experience */    experience.length > 0,
    /* 2 Projects */      projects.length > 0,
    /* 3 Education */     education.length > 0 || certifications.length > 0,
    /* 4 Skills */        skills.length > 0,
    /* 5 Strategy */      toneKeywords.length > 0,
    /* 6 Design */        true, // always has defaults
  ];
}

export default function WizardPanel(): React.JSX.Element {
  const currentStep = usePortfolioStore((s) => s.wizard.currentStep);
  const totalSteps = usePortfolioStore((s) => s.wizard.totalSteps);
  const isComplete = usePortfolioStore((s) => s.wizard.isComplete);
  const nextStep = usePortfolioStore((s) => s.nextStep);
  const prevStep = usePortfolioStore((s) => s.prevStep);
  const goToStep = usePortfolioStore((s) => s.goToStep);
  const hasContent = useStepHasContent();

  // Keyboard navigation: Cmd/Ctrl + → / ←
  useEffect(() => {
    if (isComplete) return;
    function onKeyDown(e: KeyboardEvent): void {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); nextStep(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); prevStep(); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextStep, prevStep, isComplete]);

  if (isComplete) {
    return (
      <div className="flex flex-col h-full">
        <ErrorBoundary label="Completion panel">
          <CompletionPanel />
        </ErrorBoundary>
      </div>
    );
  }

  const StepComponent = STEPS[currentStep] ?? STEPS[0];
  const stepLabel = STEP_LABELS[currentStep] ?? "";

  return (
    <div className="flex flex-col h-full">
      <WizardProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        labels={STEP_LABELS}
        hasContent={hasContent}
        onStepClick={goToStep}
      />
      <div className="flex-1 overflow-y-auto">
        <ErrorBoundary label={stepLabel}>
          <StepComponent />
        </ErrorBoundary>
      </div>
      <WizardNavigation />
    </div>
  );
}
