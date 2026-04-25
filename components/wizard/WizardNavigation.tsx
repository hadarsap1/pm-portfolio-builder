"use client";

import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { Button } from "@/components/ui/button";

export default function WizardNavigation(): React.JSX.Element {
  const currentStep = usePortfolioStore((s) => s.wizard.currentStep);
  const totalSteps = usePortfolioStore((s) => s.wizard.totalSteps);
  const nextStep = usePortfolioStore((s) => s.nextStep);
  const prevStep = usePortfolioStore((s) => s.prevStep);
  const completeWizard = usePortfolioStore((s) => s.completeWizard);

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-6 py-4">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={isFirst}
      >
        Back
      </Button>

      <span className="text-xs text-zinc-400 font-medium">
        Step {currentStep + 1} of {totalSteps}
      </span>

      {isLast ? (
        <Button onClick={completeWizard}>
          Finish
        </Button>
      ) : (
        <Button onClick={nextStep}>
          Next
        </Button>
      )}
    </div>
  );
}
