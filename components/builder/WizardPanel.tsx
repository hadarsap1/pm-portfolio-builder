"use client";

import React, { useEffect } from "react";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import WizardProgress from "@/components/wizard/WizardProgress";
import WizardNavigation from "@/components/wizard/WizardNavigation";
import CompletionPanel from "@/components/wizard/CompletionPanel";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Step0Voice from "@/components/wizard/steps/Step0Voice";
import Step1BasicInfo from "@/components/wizard/steps/Step0BasicInfo";
import Step2Experience from "@/components/wizard/steps/Step1Experience";
import Step3Projects from "@/components/wizard/steps/Step2Projects";
import Step4Education from "@/components/wizard/steps/Step2Education";
import Step5Skills from "@/components/wizard/steps/Step2Skills";
import Step6Recommendations from "@/components/wizard/steps/Step5Recommendations";
import Step7Strategy from "@/components/wizard/steps/Step3Strategy";
import Step8Design from "@/components/wizard/steps/Step4Design";

const STEPS = [
  Step0Voice,
  Step1BasicInfo,
  Step2Experience,
  Step3Projects,
  Step4Education,
  Step5Skills,
  Step6Recommendations,
  Step7Strategy,
  Step8Design,
] as const;

const STEP_LABELS = [
  "Voice",
  "Basics",
  "Experience",
  "Projects",
  "Education",
  "Skills",
  "Recommendations",
  "Strategy",
  "Design",
] as const;

function useStepHasContent(): boolean[] {
  const tagline = usePortfolioStore((s) => s.portfolio.basicInfo.tagline);
  const mission = usePortfolioStore((s) => s.portfolio.mission);
  const manifesto = usePortfolioStore((s) => s.portfolio.manifesto);
  const now = usePortfolioStore((s) => s.portfolio.now);
  const name = usePortfolioStore((s) => s.portfolio.basicInfo.name);
  const experience = usePortfolioStore((s) => s.portfolio.experience);
  const projects = usePortfolioStore((s) => s.portfolio.projects);
  const education = usePortfolioStore((s) => s.portfolio.education);
  const certifications = usePortfolioStore((s) => s.portfolio.certifications);
  const skills = usePortfolioStore((s) => s.portfolio.skills);
  const recommendations = usePortfolioStore((s) => s.portfolio.recommendations);
  const toneKeywords = usePortfolioStore((s) => s.strategy.toneKeywords);
  return [
    /* 0 Voice */            Boolean(
                                (tagline && tagline.trim()) ||
                                (mission && (mission.title || mission.body)) ||
                                manifesto.length > 0 ||
                                now.length > 0
                              ),
    /* 1 Basics */           Boolean(name && name.trim()),
    /* 2 Experience */       experience.length > 0,
    /* 3 Projects */         projects.length > 0,
    /* 4 Education */        education.length > 0 || certifications.length > 0,
    /* 5 Skills */           skills.length > 0,
    /* 6 Recommendations */  recommendations.length > 0,
    /* 7 Strategy */         toneKeywords.length > 0,
    /* 8 Design */           true, // always has defaults
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
      <div className="flex flex-col h-full overflow-y-auto">
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
