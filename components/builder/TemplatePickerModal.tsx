"use client";

import React from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { STARTER_TEMPLATES } from "@/lib/templates/starter-templates";
import { cn } from "@/lib/utils";

const THEME_COLORS: Record<string, string> = {
  minimal: "bg-slate-100 text-slate-700",
  bold: "bg-violet-100 text-violet-700",
  technical: "bg-emerald-100 text-emerald-700",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TemplatePickerModal({ open, onClose }: Props): React.JSX.Element | null {
  const store = usePortfolioStore();

  if (!open) return null;

  function handleLoad(templateId: string): void {
    const template = STARTER_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const currentId = usePortfolioStore.getState().portfolio.portfolioId;

    // Preserve portfolioId and reset wizard, then load template data
    store.resetPortfolio();
    const resetId = usePortfolioStore.getState().portfolio.portfolioId;
    // We want to keep the freshly-generated ID from reset, but still
    // load all the template content
    void resetId; // used only for the reset side-effect
    void currentId;

    // Set design + strategy directly via store actions
    store.setDesignPreferences(template.design);
    store.setStrategicFocus(template.strategy);
    store.setBasicInfo(template.portfolio.basicInfo);
    store.setGlobalMetrics(template.portfolio.globalMetrics);

    // Load experience
    template.portfolio.experience.forEach((exp) => {
      store.addExperience({ ...exp, id: crypto.randomUUID() });
    });

    // Load projects
    template.portfolio.projects.forEach((proj) => {
      store.addProject({ ...proj, id: crypto.randomUUID() });
    });

    // Load education
    template.portfolio.education.forEach((edu) => {
      store.addEducation({ ...edu, id: crypto.randomUUID() });
    });

    // Load certifications
    template.portfolio.certifications.forEach((cert) => {
      store.addCertification({ ...cert, id: crypto.randomUUID() });
    });

    // Load skills
    template.portfolio.skills.forEach((skill) => {
      store.addSkillCategory({ ...skill, id: crypto.randomUUID() });
    });

    onClose();
    toast.success(`"${template.name}" template loaded — fill in your details.`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Starter Templates</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Pre-filled with realistic example content. Customise from Step 1.</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {STARTER_TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-zinc-200 p-5 space-y-3 hover:border-zinc-400 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.tagline}</p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                    THEME_COLORS[t.design.colorTheme]
                  )}
                >
                  {t.design.colorTheme}
                </span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">{t.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {t.strategy.toneKeywords.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] rounded-full border border-zinc-100 bg-zinc-50 px-2 py-0.5 text-zinc-500"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleLoad(t.id)}
                className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                Use this template
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5 text-center">
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            Start from scratch instead
          </button>
        </div>
      </div>
    </div>
  );
}
