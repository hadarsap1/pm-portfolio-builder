import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { STARTER_TEMPLATES, type StarterTemplate } from "@/lib/templates/starter-templates";

/**
 * Load a starter template.
 *
 * `styleOnly: true` — applies only design + strategy, leaving the user's
 *   portfolio data (basicInfo, experience, projects, etc.) untouched.
 *   Used when the user already has real data and just wants a visual style.
 *
 * `markComplete` — used by demo mode to land on the finished portfolio.
 */
export function loadTemplate(
  templateId: string,
  options: { markComplete?: boolean; styleOnly?: boolean } = {}
): StarterTemplate | null {
  const template = STARTER_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;

  const store = usePortfolioStore.getState();

  if (options.styleOnly) {
    store.setDesignPreferences(template.design);
    store.setStrategicFocus(template.strategy);
    return template;
  }

  // Full load: reset then hydrate with template sample data
  store.resetPortfolio();
  store.setDesignPreferences(template.design);
  store.setStrategicFocus(template.strategy);
  store.setBasicInfo(template.portfolio.basicInfo);
  store.setGlobalMetrics(template.portfolio.globalMetrics);

  template.portfolio.experience.forEach((exp) => {
    store.addExperience({ ...exp, id: crypto.randomUUID() });
  });
  template.portfolio.projects.forEach((proj) => {
    store.addProject({ ...proj, id: crypto.randomUUID() });
  });
  template.portfolio.education.forEach((edu) => {
    store.addEducation({ ...edu, id: crypto.randomUUID() });
  });
  template.portfolio.certifications.forEach((cert) => {
    store.addCertification({ ...cert, id: crypto.randomUUID() });
  });
  template.portfolio.recommendations.forEach((rec) => {
    store.addRecommendation({ ...rec, id: crypto.randomUUID() });
  });
  template.portfolio.skills.forEach((skill) => {
    store.addSkillCategory({ ...skill, id: crypto.randomUUID() });
  });

  if (template.portfolio.mission) {
    store.setMission({ ...template.portfolio.mission });
  }
  template.portfolio.manifesto.forEach((m) => {
    store.addManifestoItem({ ...m, id: crypto.randomUUID() });
  });
  template.portfolio.now.forEach((n) => {
    store.addNowItem({ ...n, id: crypto.randomUUID() });
  });
  template.portfolio.passions.forEach((p) => {
    store.addPassion({ ...p, id: crypto.randomUUID() });
  });

  if (options.markComplete) {
    usePortfolioStore.getState().completeWizard();
  }

  return template;
}

export const DEMO_TEMPLATE_IDS = STARTER_TEMPLATES.map((t) => t.id);
