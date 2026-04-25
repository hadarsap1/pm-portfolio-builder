"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { getAccent } from "@/lib/utils/accent";
import type { SectionKey } from "@/lib/types/portfolio";
import HeroSection from "@/components/portfolio/HeroSection";
import ImpactDashboard from "@/components/portfolio/ImpactDashboard";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import EducationSection from "@/components/portfolio/EducationSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import RecommendationsSection from "@/components/portfolio/RecommendationsSection";

function SectionHeading({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: { heading: string; customHex?: string };
}): React.JSX.Element {
  return (
    <h2
      className={cn("text-[10px] font-semibold uppercase tracking-widest mb-3", accent.heading)}
      style={accent.customHex ? { color: accent.customHex } : undefined}
    >
      {children}
    </h2>
  );
}

const DEFAULT_SECTION_ORDER: SectionKey[] = ["metrics", "experience", "projects", "recommendations", "education", "skills"];

export default function PreviewShell(): React.JSX.Element {
  const basicInfo = usePortfolioStore((s) => s.portfolio.basicInfo);
  const experience = usePortfolioStore((s) => s.portfolio.experience);
  const projects = usePortfolioStore((s) => s.portfolio.projects);
  const education = usePortfolioStore((s) => s.portfolio.education);
  const certifications = usePortfolioStore((s) => s.portfolio.certifications);
  const skills = usePortfolioStore((s) => s.portfolio.skills);
  const recommendations = usePortfolioStore((s) => s.portfolio.recommendations);
  const globalMetrics = usePortfolioStore((s) => s.portfolio.globalMetrics);
  const design = usePortfolioStore((s) => s.design);
  const layoutStyle = design.layoutStyle;
  const emphasizedSections = usePortfolioStore((s) => s.strategy.emphasizedSections);
  const sectionOrder = usePortfolioStore(
    (s) => s.strategy.sectionOrder ?? DEFAULT_SECTION_ORDER
  );

  const accent = getAccent(design);
  const isEmpty =
    !basicInfo.summary &&
    experience.length === 0 &&
    projects.length === 0 &&
    education.length === 0 &&
    skills.length === 0 &&
    recommendations.length === 0 &&
    globalMetrics.length === 0;

  const showAll = emphasizedSections.length === 0;
  const show = (s: string) => showAll || emphasizedSections.includes(s as never);

  const showMetrics = globalMetrics.length > 0 && show("metrics");
  const showExperience = experience.length > 0 && show("experience");
  const showProjects = projects.length > 0 && show("projects");
  const showEducation = (education.length > 0 || certifications.length > 0) && show("education");
  const showSkills = skills.length > 0 && show("skills");
  const showRecommendations = recommendations.length > 0 && show("recommendations");

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <p className="text-xs text-zinc-400">
          Fill in the wizard on the left — your portfolio updates here live.
        </p>
      </div>
    );
  }

  // ── Two-column layout ────────────────────────────────────────────
  if (layoutStyle === "two-column") {
    return (
      <div className="flex gap-0 h-full text-sm">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-[34%] shrink-0 border-e px-6 py-8 space-y-7 bg-white",
            accent.border
          )}
        >
          <HeroSection basicInfo={basicInfo} accent={accent} variant="header" />

          {basicInfo.summary && (
            <div>
              <SectionHeading accent={accent}>About</SectionHeading>
              <p className="text-xs text-zinc-600 leading-relaxed">{basicInfo.summary}</p>
            </div>
          )}

          {showSkills && (
            <div>
              <SectionHeading accent={accent}>Skills</SectionHeading>
              <SkillsSection skills={skills} accent={accent} />
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 px-8 py-8 space-y-8 overflow-y-auto">
          {showMetrics && (
            <div>
              <SectionHeading accent={accent}>Impact</SectionHeading>
              <ImpactDashboard metrics={globalMetrics} accent={accent} />
            </div>
          )}

          {showExperience && (
            <div>
              <SectionHeading accent={accent}>Experience</SectionHeading>
              <ExperienceSection experience={experience} accent={accent} />
            </div>
          )}

          {showProjects && (
            <div>
              <SectionHeading accent={accent}>Projects</SectionHeading>
              <ProjectsSection projects={projects} accent={accent} />
            </div>
          )}

          {showRecommendations && (
            <div>
              <SectionHeading accent={accent}>Recommendations</SectionHeading>
              <RecommendationsSection recommendations={recommendations} accent={accent} />
            </div>
          )}

          {showEducation && (
            <div>
              <SectionHeading accent={accent}>Education</SectionHeading>
              <EducationSection education={education} certifications={certifications} accent={accent} />
            </div>
          )}
        </main>
      </div>
    );
  }

  const sectionContent: Record<SectionKey, React.ReactNode> = {
    metrics: showMetrics ? (
      <div key="metrics">
        <SectionHeading accent={accent}>By the Numbers</SectionHeading>
        <ImpactDashboard metrics={globalMetrics} accent={accent} />
      </div>
    ) : null,
    experience: showExperience ? (
      <div key="experience">
        <SectionHeading accent={accent}>Experience</SectionHeading>
        <ExperienceSection experience={experience} accent={accent} />
      </div>
    ) : null,
    projects: showProjects ? (
      <div key="projects">
        <SectionHeading accent={accent}>Projects</SectionHeading>
        <ProjectsSection projects={projects} accent={accent} />
      </div>
    ) : null,
    education: showEducation ? (
      <div key="education">
        <SectionHeading accent={accent}>Education</SectionHeading>
        <EducationSection education={education} certifications={certifications} accent={accent} />
      </div>
    ) : null,
    skills: showSkills ? (
      <div key="skills">
        <SectionHeading accent={accent}>Skills</SectionHeading>
        <SkillsSection skills={skills} accent={accent} />
      </div>
    ) : null,
    recommendations: showRecommendations ? (
      <div key="recommendations">
        <SectionHeading accent={accent}>Recommendations</SectionHeading>
        <RecommendationsSection recommendations={recommendations} accent={accent} />
      </div>
    ) : null,
  };

  // ── One-column layout ────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-8 py-10 space-y-10 text-sm">
      {/* Hero */}
      <div className={cn("border-b pb-7", accent.border)}>
        <HeroSection basicInfo={basicInfo} accent={accent} variant="full" />
      </div>

      {sectionOrder.map((key) => sectionContent[key])}
    </div>
  );
}
