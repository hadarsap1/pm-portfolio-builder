// ── Raw Resume Data ──────────────────────────────────────────────

export interface BasicInfo {
  name: string;
  title: string;
  email: string;
  linkedin?: string;
  github?: string;
  location?: string;
  summary: string;
  // Free-form personality positioning. One line. Distinct from `title`.
  // e.g. "Some people talk about the long game. I run it."
  tagline?: string;
  avatarUrl?: string; // base64 data URL or remote URL
}

// ── Identity / personality modules ────────────────────────────────

/**
 * Long-form section for the things you care about beyond the job —
 * mission, volunteering, side initiatives. The "Running with Rami" slot.
 */
export interface MissionSection {
  title: string;       // e.g. "Running with Rami"
  body: string;        // 1–3 paragraphs
  imageUrl?: string;   // optional photo / icon
  link?: string;       // optional learn-more URL
}

/**
 * Bullet-pointed worldview / how-you-think-about-product statements.
 * Renders as a stacked list with optional small heading per item.
 */
export interface ManifestoItem {
  id: string;
  statement: string;   // the belief itself
  detail?: string;     // optional one-line supporting context
}

/**
 * "What I'm doing now" — a Derek-Sivers-style now block.
 * Each entry is a category (focus, reading, building, learning…) plus content.
 */
export interface NowItem {
  id: string;
  label: string;       // "Currently focused on", "Reading", "Building"…
  content: string;
}

/**
 * Things you do outside of work that make you you. A trail-running log,
 * a cookbook collection, a side band, the bees on the roof. Each entry
 * stands on its own; multiple entries render as a vertical stack.
 */
export interface PassionItem {
  id: string;
  title: string;          // "Trail running", "Sourdough", "Watercolour"
  body: string;           // 1–2 short paragraphs of context
  highlights: string[];   // optional list — races run, dishes mastered, recent paintings
  imageUrl?: string;      // optional photo (base64 or remote URL)
  link?: string;          // optional learn-more URL (a Strava profile, a recipe blog, etc.)
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

export interface RecommendationItem {
  id: string;
  name: string;          // recommender's name
  role: string;          // their title
  company: string;       // their company
  relationship: string;  // e.g. "Manager at Stripe", "Engineering partner on Checkout"
  quote: string;         // testimonial body
  avatarUrl?: string;
  linkedin?: string;
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
export type EmphasizedSection =
  | "metrics" | "experience" | "projects" | "skills" | "education" | "recommendations"
  | "mission" | "manifesto" | "now" | "passions";
export type SectionKey =
  | "metrics" | "experience" | "projects" | "education" | "skills" | "recommendations"
  | "mission" | "manifesto" | "now" | "passions";

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
  recommendations: RecommendationItem[];
  globalMetrics: Metric[]; // Key metrics surfaced across all roles
  // Identity / personality modules — opt-in. Empty/null means "don't render".
  mission: MissionSection | null;
  manifesto: ManifestoItem[];
  now: NowItem[];
  passions: PassionItem[];
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
