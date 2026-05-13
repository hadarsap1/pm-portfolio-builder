"use client";

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type {
  BasicInfo,
  CertificationItem,
  DesignPreferences,
  EducationItem,
  EmphasizedSection,
  ExperienceItem,
  ManifestoItem,
  Metric,
  MissionSection,
  NowItem,
  PassionItem,
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
    // Empty strings, not "Your Name" / a templated summary. We want users to
    // see their own voice in the preview from word one — placeholders teach
    // them to copy a corporate tone they then never edit.
    name: "",
    title: "",
    email: "",
    linkedin: "",
    github: "",
    location: "",
    summary: "",
    tagline: "",
  },
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  skills: [],
  recommendations: [],
  globalMetrics: [],
  mission: null,
  manifesto: [],
  now: [],
  passions: [],
};

const DEFAULT_DESIGN: DesignPreferences = {
  colorTheme: "minimal",
  layoutStyle: "one-column",
  fontStyle: "modern",
  metricsDensity: "full",
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
    totalSteps: 9,
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

  // Mission (single-section)
  setMission: (mission: MissionSection | null) => void;
  updateMission: (data: Partial<MissionSection>) => void;

  // Manifesto CRUD
  addManifestoItem: (item: ManifestoItem) => void;
  updateManifestoItem: (id: string, data: Partial<ManifestoItem>) => void;
  removeManifestoItem: (id: string) => void;

  // "Now" CRUD
  addNowItem: (item: NowItem) => void;
  updateNowItem: (id: string, data: Partial<NowItem>) => void;
  removeNowItem: (id: string) => void;

  // Passions CRUD
  addPassion: (item: PassionItem) => void;
  updatePassion: (id: string, data: Partial<PassionItem>) => void;
  removePassion: (id: string) => void;

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

      // ── Mission ───────────────────────────────────────────────────────────
      setMission: (mission) =>
        set(
          (state) => ({ portfolio: { ...state.portfolio, mission } }),
          false,
          "setMission"
        ),

      updateMission: (data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              mission: state.portfolio.mission
                ? { ...state.portfolio.mission, ...data }
                : { title: "", body: "", ...data },
            },
          }),
          false,
          "updateMission"
        ),

      // ── Manifesto ─────────────────────────────────────────────────────────
      addManifestoItem: (item) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              manifesto: [...state.portfolio.manifesto, item],
            },
          }),
          false,
          "addManifestoItem"
        ),

      updateManifestoItem: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              manifesto: state.portfolio.manifesto.map((m) =>
                m.id === id ? { ...m, ...data } : m
              ),
            },
          }),
          false,
          "updateManifestoItem"
        ),

      removeManifestoItem: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              manifesto: state.portfolio.manifesto.filter((m) => m.id !== id),
            },
          }),
          false,
          "removeManifestoItem"
        ),

      // ── "Now" ─────────────────────────────────────────────────────────────
      addNowItem: (item) =>
        set(
          (state) => ({
            portfolio: { ...state.portfolio, now: [...state.portfolio.now, item] },
          }),
          false,
          "addNowItem"
        ),

      updateNowItem: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              now: state.portfolio.now.map((n) =>
                n.id === id ? { ...n, ...data } : n
              ),
            },
          }),
          false,
          "updateNowItem"
        ),

      removeNowItem: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              now: state.portfolio.now.filter((n) => n.id !== id),
            },
          }),
          false,
          "removeNowItem"
        ),

      // ── Passions ──────────────────────────────────────────────────────────
      addPassion: (item) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              passions: [...state.portfolio.passions, item],
            },
          }),
          false,
          "addPassion"
        ),

      updatePassion: (id, data) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              passions: state.portfolio.passions.map((p) =>
                p.id === id ? { ...p, ...data } : p
              ),
            },
          }),
          false,
          "updatePassion"
        ),

      removePassion: (id) =>
        set(
          (state) => ({
            portfolio: {
              ...state.portfolio,
              passions: state.portfolio.passions.filter((p) => p.id !== id),
            },
          }),
          false,
          "removePassion"
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
      version: 4,
      // Wrap localStorage so a QuotaExceededError doesn't silently drop the
      // user's session. Bespoke imagery + project screenshots can push past
      // Safari's 5MB limit; we surface it with a console warning + a one-shot
      // toast notice via window event so UI can listen.
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") return localStorage;
        return {
          getItem: (key: string): string | null => window.localStorage.getItem(key),
          setItem: (key: string, value: string): void => {
            try {
              window.localStorage.setItem(key, value);
            } catch (err) {
              if (err instanceof Error && /quota/i.test(err.name + err.message)) {
                console.warn(
                  "[pm-portfolio] localStorage quota exceeded — your portfolio is too large to persist locally. Try removing some screenshots or regenerating bespoke imagery less often."
                );
                window.dispatchEvent(new CustomEvent("pm-portfolio:quota-exceeded"));
                return;
              }
              throw err;
            }
          },
          removeItem: (key: string): void => window.localStorage.removeItem(key),
        };
      }),
      partialize: (state) => ({
        portfolio: state.portfolio,
        design: state.design,
        strategy: state.strategy,
        wizard: state.wizard,
      }),
      migrate: (persisted: unknown): PortfolioState => {
        const state = persisted as Partial<PortfolioState>;
        // Always rebuild from defaults + persisted values — every collection
        // we've added in any phase gets a defensive `?? []` so a corrupt or
        // mid-version state can't crash the spread-based reducers
        // (addProject / addPassion / addManifestoItem). Cheaper than running
        // version checks and a safer default — applies on every read.
        return {
          portfolio: {
            ...DEFAULT_PORTFOLIO,
            ...state.portfolio,
            projects: state.portfolio?.projects ?? [],
            certifications: state.portfolio?.certifications ?? [],
            recommendations: state.portfolio?.recommendations ?? [],
            mission: state.portfolio?.mission ?? null,
            manifesto: state.portfolio?.manifesto ?? [],
            now: state.portfolio?.now ?? [],
            passions: state.portfolio?.passions ?? [],
          },
          design: { ...DEFAULT_DESIGN, ...state.design },
          strategy: { ...DEFAULT_STRATEGY, ...state.strategy },
          wizard: {
            ...DEFAULT_STATE.wizard,
            ...state.wizard,
            totalSteps: 9,
          },
        };
      },
    }
  ),
  { name: "portfolio-store" }
  )
);
