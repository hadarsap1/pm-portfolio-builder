// ── Raw Resume Data ──────────────────────────────────────────────

export interface BasicInfo {
  name: string;
  title: string;
  email: string;
  linkedin?: string;
  github?: string;
  location?: string;
  summary: string;
  avatarUrl?: string; // base64 data URL or remote URL
}

export interface Metric {
  id: string;
  label: string;    // e.g. "Revenue Growth"
  value: string;    // e.g. "$4.2M" or "340%"
  context?: string; // e.g. "YoY, FY2023"
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;        // "YYYY-MM" format
  endDate: string;          // "YYYY-MM" or "present"
  bullets: string[];        // Raw achievement strings
  metrics: Metric[];        // Numbers extracted from this role
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface SkillCategory {
  id: string;
  label: string;   // e.g. "Product Strategy", "Analytics"
  items: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  company: string;
  duration: string;  // e.g. "Q1 2024 – Q3 2024"
  problem: string;
  solution: string;
  outcome: string;
  link?: string;
  tags: string[];
}

// ── Design Preferences ───────────────────────────────────────────

export type ColorTheme = "minimal" | "bold" | "technical";
export type LayoutStyle = "one-column" | "two-column";
export type FontStyle = "modern" | "classic" | "technical";

export interface DesignPreferences {
  colorTheme: ColorTheme;
  layoutStyle: LayoutStyle;
  fontStyle: FontStyle;
  customAccentColor?: string; // hex, e.g. "#7c3aed" — overrides colorTheme accent
}

// ── Strategic Focus ───────────────────────────────────────────────

export type Superpower = "growth" | "zero-to-one" | "technical";
export type EmphasizedSection = "metrics" | "experience" | "projects" | "skills" | "education";
export type SectionKey = "metrics" | "experience" | "projects" | "education" | "skills";

export interface StrategicFocus {
  superpower: Superpower;
  emphasizedSections: EmphasizedSection[];
  toneKeywords: string[]; // e.g. ["data-driven", "cross-functional"]
  sectionOrder?: SectionKey[]; // drag-reorder of portfolio sections
}

// ── Portfolio Data Container ──────────────────────────────────────

export interface PortfolioData {
  portfolioId: string; // generated once, used for analytics
  basicInfo: BasicInfo;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  skills: SkillCategory[];
  globalMetrics: Metric[]; // Key metrics surfaced across all roles
}

// ── AI Scoring (not persisted) ────────────────────────────────────

export interface PortfolioScore {
  overall: number;           // 0–100
  impactClarity: number;
  keywordStrength: number;
  sectionCompleteness: number;
  summaryQuality: number;
  suggestions: [string, string, string];
}

// ── Wizard Navigation ─────────────────────────────────────────────

export interface WizardState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
}

// ── Top-level App State ───────────────────────────────────────────

export interface PortfolioState {
  portfolio: PortfolioData;
  design: DesignPreferences;
  strategy: StrategicFocus;
  wizard: WizardState;
}
