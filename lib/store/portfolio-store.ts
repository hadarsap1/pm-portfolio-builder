"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  BasicInfo,
  CertificationItem,
  DesignPreferences,
  EducationItem,
  EmphasizedSection,
  ExperienceItem,
  Metric,
  PortfolioData,
  PortfolioState,
  ProjectItem,
  RecommendationItem,
  SectionKey,
  SkillCategory,
  StrategicFocus,
} from "@/lib/types/portfolio";

// ── Defaults ────────────────────────────────────────────────────────────────
// Sensible defaults ensure the live preview always has something to render.

const DEFAULT_PORTFOLIO: PortfolioData = {
  portfolioId: crypto.randomUUID(),
  basicInfo: {
    name: "Your Name",
    title: "Senior Product Manager",
    email: "you@example.com",
    linkedin: "",
    github: "",
    location: "",
    summary:
      "Results-driven product leader with a track record of shipping impactful products at scale.",
  },
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  skills: [],
  recommendations: [],
  globalMetrics: [],
};

const DEFAULT_DESIGN: DesignPreferences = {
  colorTheme: "minimal",
  layoutStyle: "two-column",
  fontStyle: "modern",
};

const DEFAULT_STRATEGY: StrategicFocus = {
  superpower: "growth",
  emphasizedSections: ["metrics", "experience"],
  toneKeywords: ["data-driven", "cross-functional", "user-centric"],
};

const DEFAULT_STATE: PortfolioState = {
  portfolio: DEFAULT_PORTFOLIO,
  design: DEFAULT_DESIGN,
  strategy: DEFAULT_STRATEGY,
  wizard: {
    currentStep: 0,
    totalSteps: 8,
    isComplete: false,
  },
};

// ── Store Interface ──────────────────────────────────────────────────────────

interface PortfolioStore extends PortfolioState {
  // Basic Info
  setBasicInfo: (info: Partial<BasicInfo>) => void;

  // Experience CRUD
  addExperience: (item: ExperienceItem) => void;
  updateExperience: (id: string, data: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (ids: string[]) => void;

  // Projects CRUD
  addProject: (item: ProjectItem) => void;
  updateProject: (id: string, data: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (ids: string[]) => void;

  // Education CRUD
  addEducation: (item: EducationItem) => void;
  updateEducation: (id: string, data: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;

  // Certifications CRUD
  addCertification: (item: CertificationItem) => void;
  updateCertification: (id: string, data: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  // Skills CRUD
  addSkillCategory: (cat: SkillCategory) => void;
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;

  // Recommendations CRUD
  addRecommendation: (item: RecommendationItem) => void;
  updateRecommendation: (id: string, data: Partial<RecommendationItem>) => void;
  removeRecommendation: (id: string) => void;

  // Metrics
  setGlobalMetrics: (metrics: Metric[]) => void;
  addGlobalMetric: (metric: Metric) => void;
  removeGlobalMetric: (id: string) => void;

  // Design Preferences
  setDesignPreferences: (prefs: Partial<DesignPreferences>) => void;

  // Strategic Focus
  setStrategicFocus: (focus: Partial<StrategicFocus>) => void;
  setSuperpower: (superpower: StrategicFocus["superpower"]) => void;
  toggleEmphasizedSection: (section: EmphasizedSection) => void;
  setSectionOrder: (order: SectionKey[]) => void;

  // Wizard Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  completeWizard: () => void;

  // Wizard helpers
  resumeEditing: () => void;

  // Full Reset
  resetPortfolio: () => void;
}

// ── Store Implementation ─────────────────────────────────────────────────────

export const usePortfolioStore = create<PortfolioStore>()(
  devtools(
    persist(
      (set) => ({
      ...DEFAULT_STATE,

      // ── Basic Info ────────────────────────────────────────────────────────
      setBasicInfo: (info) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              basicInfo: { ...state.portfolio.basicInfo, ...info },
            },
          }),
          false,
          "setBasicInfo"
        ),

      // ── Experience ────────────────────────────────────────────────────────
      addExperience: (item) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              experience: [...state.portfolio.experience, item],
            },
          }),
          false,
          "addExperience"
        ),

      updateExperience: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              experience: state.portfolio.experience.map((exp) =>
                exp.id === id ? { ...exp, ...data } : exp
              ),
            },
          }),
          false,
          "updateExperience"
        ),

      removeExperience: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              experience: state.portfolio.experience.filter(
                (exp) => exp.id !== id
              ),
            },
          }),
          false,
          "removeExperience"
        ),

      reorderExperience: (ids) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              experience: ids
                .map((id) =>
                  state.portfolio.experience.find((e) => e.id === id)
                )
                .filter((e): e is ExperienceItem => e !== undefined),
            },
          }),
          false,
          "reorderExperience"
        ),

      // ── Projects ─────────────────────────────────────────────────────────
      addProject: (item) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              projects: [...state.portfolio.projects, item],
            },
          }),
          false,
          "addProject"
        ),

      updateProject: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              projects: state.portfolio.projects.map((p) =>
                p.id === id ? { ...p, ...data } : p
              ),
            },
          }),
          false,
          "updateProject"
        ),

      removeProject: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              projects: state.portfolio.projects.filter((p) => p.id !== id),
            },
          }),
          false,
          "removeProject"
        ),

      reorderProjects: (ids) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              projects: ids
                .map((id) => state.portfolio.projects.find((p) => p.id === id))
                .filter((p): p is ProjectItem => p !== undefined),
            },
          }),
          false,
          "reorderProjects"
        ),

      // ── Education ─────────────────────────────────────────────────────────
      addEducation: (item) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              education: [...state.portfolio.education, item],
            },
          }),
          false,
          "addEducation"
        ),

      updateEducation: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              education: state.portfolio.education.map((edu) =>
                edu.id === id ? { ...edu, ...data } : edu
              ),
            },
          }),
          false,
          "updateEducation"
        ),

      removeEducation: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              education: state.portfolio.education.filter(
                (edu) => edu.id !== id
              ),
            },
          }),
          false,
          "removeEducation"
        ),

      // ── Certifications ────────────────────────────────────────────────────
      addCertification: (item) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              certifications: [...state.portfolio.certifications, item],
            },
          }),
          false,
          "addCertification"
        ),

      updateCertification: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              certifications: state.portfolio.certifications.map((c) =>
                c.id === id ? { ...c, ...data } : c
              ),
            },
          }),
          false,
          "updateCertification"
        ),

      removeCertification: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              certifications: state.portfolio.certifications.filter((c) => c.id !== id),
            },
          }),
          false,
          "removeCertification"
        ),

      // ── Skills ────────────────────────────────────────────────────────────
      addSkillCategory: (cat) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              skills: [...state.portfolio.skills, cat],
            },
          }),
          false,
          "addSkillCategory"
        ),

      updateSkillCategory: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              skills: state.portfolio.skills.map((skill) =>
                skill.id === id ? { ...skill, ...data } : skill
              ),
            },
          }),
          false,
          "updateSkillCategory"
        ),

      removeSkillCategory: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              skills: state.portfolio.skills.filter(
                (skill) => skill.id !== id
              ),
            },
          }),
          false,
          "removeSkillCategory"
        ),

      // ── Recommendations ───────────────────────────────────────────────────
      addRecommendation: (item) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              recommendations: [...state.portfolio.recommendations, item],
            },
          }),
          false,
          "addRecommendation"
        ),

      updateRecommendation: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              recommendations: state.portfolio.recommendations.map((r) =>
                r.id === id ? { ...r, ...data } : r
              ),
            },
          }),
          false,
          "updateRecommendation"
        ),

      removeRecommendation: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              recommendations: state.portfolio.recommendations.filter(
                (r) => r.id !== id
              ),
            },
          }),
          false,
          "removeRecommendation"
        ),

      // ── Metrics ───────────────────────────────────────────────────────────
      setGlobalMetrics: (metrics) =>
        set(
          (state) => ({
            portfolio: { ...state.portfolio, globalMetrics: metrics },
          }),
          false,
          "setGlobalMetrics"
        ),

      addGlobalMetric: (metric) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              globalMetrics: [...state.portfolio.globalMetrics, metric],
            },
          }),
          false,
          "addGlobalMetric"
        ),

      removeGlobalMetric: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              globalMetrics: state.portfolio.globalMetrics.filter(
                (m) => m.id !== id
              ),
            },
          }),
          false,
          "removeGlobalMetric"
        ),

      // ── Design Preferences ────────────────────────────────────────────────
      setDesignPreferences: (prefs) =>
        set(
          (state) => ({ design: { ...state.design, ...prefs } }),
          false,
          "setDesignPreferences"
        ),

      // ── Strategic Focus ───────────────────────────────────────────────────
      setStrategicFocus: (focus) =>
        set(
          (state) => ({ strategy: { ...state.strategy, ...focus } }),
          false,
          "setStrategicFocus"
        ),

      setSuperpower: (superpower) =>
        set(
          (state) => ({ strategy: { ...state.strategy, superpower } }),
          false,
          "setSuperpower"
        ),

      toggleEmphasizedSection: (section) =>
        set(
          (state) => {
            const current = state.strategy.emphasizedSections;
            const next = current.includes(section)
              ? current.filter((s) => s !== section)
              : [...current, section];
            return {
              strategy: { ...state.strategy, emphasizedSections: next },
            };
          },
          false,
          "toggleEmphasizedSection"
        ),

      setSectionOrder: (order) =>
        set(
          (state) => ({ strategy: { ...state.strategy, sectionOrder: order } }),
          false,
          "setSectionOrder"
        ),

      // ── Wizard Navigation ─────────────────────────────────────────────────
      nextStep: () =>
        set(
          (state) => ({
            wizard: {
              ...state.wizard,
              currentStep: Math.min(
                state.wizard.currentStep + 1,
                state.wizard.totalSteps - 1
              ),
            },
          }),
          false,
          "nextStep"
        ),

      prevStep: () =>
        set(
          (state) => ({
            wizard: {
              ...state.wizard,
              currentStep: Math.max(state.wizard.currentStep - 1, 0),
            },
          }),
          false,
          "prevStep"
        ),

      goToStep: (step) =>
        set(
          (state) => ({
            wizard: {
              ...state.wizard,
              currentStep: Math.max(
                0,
                Math.min(step, state.wizard.totalSteps - 1)
              ),
            },
          }),
          false,
          "goToStep"
        ),

      completeWizard: () =>
        set(
          (state) => ({
            wizard: { ...state.wizard, isComplete: true },
          }),
          false,
          "completeWizard"
        ),

      // ── Wizard helpers ────────────────────────────────────────────────────
      resumeEditing: () =>
        set(
          (state) => ({ wizard: { ...state.wizard, isComplete: false } }),
          false,
          "resumeEditing"
        ),

      // ── Reset ─────────────────────────────────────────────────────────────
      resetPortfolio: () =>
        set(
          {
            ...DEFAULT_STATE,
            portfolio: { ...DEFAULT_PORTFOLIO, portfolioId: crypto.randomUUID() },
          },
          false,
          "resetPortfolio"
        ),
    }),
    {
      name: "pm-portfolio",
      version: 2,
      partialize: (state) => ({
        portfolio: state.portfolio,
        design: state.design,
        strategy: state.strategy,
        wizard: state.wizard,
      }),
      migrate: (persisted: unknown, version: number): PortfolioState => {
        const state = persisted as Partial<PortfolioState>;
        if (version < 2) {
          // Backfill every collection that's been added since the original
          // schema — projects (phase 10), certifications (phase 11),
          // recommendations (phase 12). A v1 state predates all of them
          // and would arrive as `undefined`, breaking spread-based reducers
          // like addProject.
          return {
            portfolio: {
              ...DEFAULT_PORTFOLIO,
              ...state.portfolio,
              projects: state.portfolio?.projects ?? [],
              certifications: state.portfolio?.certifications ?? [],
              recommendations: state.portfolio?.recommendations ?? [],
            },
            design: { ...DEFAULT_DESIGN, ...state.design },
            strategy: { ...DEFAULT_STRATEGY, ...state.strategy },
            wizard: {
              ...DEFAULT_STATE.wizard,
              ...state.wizard,
              totalSteps: 8,
            },
          };
        }
        return state as PortfolioState;
      },
    }
  ),
  { name: "portfolio-store" }
  )
);
