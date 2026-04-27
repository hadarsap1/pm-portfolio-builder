import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { STARTER_TEMPLATES, type StarterTemplate } from "@/lib/templates/starter-templates";

/**
 * Reset the store and hydrate it with the named template's content.
 * Returns the template that was loaded, or null if the id was unknown.
 *
 * `markComplete` is used by demo mode so the user lands on the finished
 * portfolio instead of step 0 of the wizard.
 */
export function loadTemplate(
  templateId: string,
  options: { markComplete?: boolean } = {}
): StarterTemplate | null {
  const template = STARTER_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;

  const store = usePortfolioStore.getState();
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

  // Identity modules
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
