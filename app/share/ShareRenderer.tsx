"use client";

import React, { useEffect, useState } from "react";
import { getAccent } from "@/lib/utils/accent";
import HeroSection from "@/components/portfolio/HeroSection";
import ImpactDashboard from "@/components/portfolio/ImpactDashboard";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import EducationSection from "@/components/portfolio/EducationSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import RecommendationsSection from "@/components/portfolio/RecommendationsSection";
import MissionSectionRender from "@/components/portfolio/MissionSection";
import ManifestoSection from "@/components/portfolio/ManifestoSection";
import NowSection from "@/components/portfolio/NowSection";
import PassionsSection from "@/components/portfolio/PassionsSection";
import { decodeSharePayload, type SharePayload } from "@/lib/share/payload";
import { cn } from "@/lib/utils";

function SectionHeading({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: ReturnType<typeof getAccent>;
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

export default function ShareRenderer(): React.JSX.Element {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // One-shot decode of URL on mount. Can't be derived during render because
    // window.location isn't available during SSR. setState in this effect is
    // the correct pattern despite the lint rule's blanket warning.
    /* eslint-disable react-hooks/set-state-in-effect */
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("d") ?? window.location.hash.slice(1);
    if (!encoded) { setError(true); return; }
    const parsed = decodeSharePayload(encoded);
    if (!parsed) { setError(true); return; }
    setPayload(parsed);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Easter egg for the curious: drop a styled greeting in the dev console
    // pointing them at the JSON API. Recruiters won't see it; people who
    // open devtools out of habit will smile.
    if (encoded && typeof console !== "undefined") {
      const apiUrl = `${window.location.origin}/api/profile?d=${encoded}`;
      console.log(
        "%c👋 hi.%c if you're poking around: try %c" + apiUrl,
        "font-size:14px;font-weight:bold;color:#7c3aed",
        "color:#71717a",
        "color:#18181b;background:#f4f4f5;padding:2px 6px;border-radius:4px;font-family:monospace"
      );
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center p-8">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-zinc-900">Invalid share link</p>
          <p className="text-sm text-zinc-500">This link may have expired or been truncated.</p>
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-8">
          <div className="h-8 bg-zinc-100 rounded w-48" />
          <div className="h-4 bg-zinc-100 rounded w-32" />
          <div className="h-4 bg-zinc-100 rounded w-full" />
          <div className="h-4 bg-zinc-100 rounded w-5/6" />
        </div>
      </div>
    );
  }

  const { portfolio, design, strategy } = payload;
  const accent = getAccent(design);
  const showAll = strategy.emphasizedSections.length === 0;
  const show = (s: string) => showAll || strategy.emphasizedSections.includes(s as never);
  const sectionOrder = strategy.sectionOrder ?? [
    "mission", "manifesto", "now",
    "metrics", "experience", "projects", "recommendations", "education", "skills",
    "passions",
  ];

  const showMetrics = portfolio.globalMetrics.length > 0 && show("metrics");
  const showExperience = portfolio.experience.length > 0 && show("experience");
  const showProjects = (portfolio.projects?.length ?? 0) > 0 && show("projects");
  const showEducation = (portfolio.education.length > 0 || (portfolio.certifications?.length ?? 0) > 0) && show("education");
  const showSkills = portfolio.skills.length > 0 && show("skills");
  const recommendations = portfolio.recommendations ?? [];
  const showRecommendations = recommendations.length > 0 && show("recommendations");
  const mission = portfolio.mission ?? null;
  const manifesto = portfolio.manifesto ?? [];
  const now = portfolio.now ?? [];
  const passions = portfolio.passions ?? [];
  const showMission = mission !== null && (mission.title || mission.body) && show("mission");
  const showManifesto = manifesto.length > 0 && show("manifesto");
  const showNow = now.length > 0 && show("now");
  const showPassions = passions.length > 0 && show("passions");

  const sectionContent: Record<string, React.ReactNode> = {
    metrics: showMetrics ? <div key="metrics"><SectionHeading accent={accent}>By the Numbers</SectionHeading><ImpactDashboard metrics={portfolio.globalMetrics} accent={accent} /></div> : null,
    experience: showExperience ? <div key="experience"><SectionHeading accent={accent}>Experience</SectionHeading><ExperienceSection experience={portfolio.experience} accent={accent} /></div> : null,
    projects: showProjects ? <div key="projects"><SectionHeading accent={accent}>Projects</SectionHeading><ProjectsSection projects={portfolio.projects ?? []} accent={accent} /></div> : null,
    education: showEducation ? <div key="education"><SectionHeading accent={accent}>Education</SectionHeading><EducationSection education={portfolio.education} certifications={portfolio.certifications ?? []} accent={accent} /></div> : null,
    skills: showSkills ? <div key="skills"><SectionHeading accent={accent}>Skills</SectionHeading><SkillsSection skills={portfolio.skills} accent={accent} /></div> : null,
    recommendations: showRecommendations ? <div key="recommendations"><SectionHeading accent={accent}>Recommendations</SectionHeading><RecommendationsSection recommendations={recommendations} accent={accent} /></div> : null,
    mission: showMission ? <div key="mission"><SectionHeading accent={accent}>What I care about</SectionHeading><MissionSectionRender mission={mission} accent={accent} /></div> : null,
    manifesto: showManifesto ? <div key="manifesto"><SectionHeading accent={accent}>Manifesto</SectionHeading><ManifestoSection manifesto={manifesto} accent={accent} /></div> : null,
    now: showNow ? <div key="now"><SectionHeading accent={accent}>Now</SectionHeading><NowSection now={now} accent={accent} /></div> : null,
    passions: showPassions ? <div key="passions"><SectionHeading accent={accent}>What I do for love</SectionHeading><PassionsSection passions={passions} accent={accent} /></div> : null,
  };

  if (design.layoutStyle === "two-column") {
    return (
      <div className="flex min-h-screen text-sm">
        <aside className={cn("w-[34%] shrink-0 border-e px-6 py-8 space-y-7 bg-white", accent.border)}>
          <HeroSection basicInfo={portfolio.basicInfo} accent={accent} variant="header" />
          {portfolio.basicInfo.summary && (
            <div>
              <SectionHeading accent={accent}>About</SectionHeading>
              <p className="text-xs text-zinc-600 leading-relaxed">{portfolio.basicInfo.summary}</p>
            </div>
          )}
          {showSkills && <div><SectionHeading accent={accent}>Skills</SectionHeading><SkillsSection skills={portfolio.skills} accent={accent} /></div>}
        </aside>
        <main className="flex-1 px-8 py-8 space-y-8">
          {showManifesto && <div><SectionHeading accent={accent}>Manifesto</SectionHeading><ManifestoSection manifesto={manifesto} accent={accent} /></div>}
          {showMission && <div><SectionHeading accent={accent}>What I care about</SectionHeading><MissionSectionRender mission={mission} accent={accent} /></div>}
          {showNow && <div><SectionHeading accent={accent}>Now</SectionHeading><NowSection now={now} accent={accent} /></div>}
          {showMetrics && <div><SectionHeading accent={accent}>Impact</SectionHeading><ImpactDashboard metrics={portfolio.globalMetrics} accent={accent} /></div>}
          {showExperience && <div><SectionHeading accent={accent}>Experience</SectionHeading><ExperienceSection experience={portfolio.experience} accent={accent} /></div>}
          {showProjects && <div><SectionHeading accent={accent}>Projects</SectionHeading><ProjectsSection projects={portfolio.projects ?? []} accent={accent} /></div>}
          {showRecommendations && <div><SectionHeading accent={accent}>Recommendations</SectionHeading><RecommendationsSection recommendations={recommendations} accent={accent} /></div>}
          {showEducation && <div><SectionHeading accent={accent}>Education</SectionHeading><EducationSection education={portfolio.education} certifications={portfolio.certifications ?? []} accent={accent} /></div>}
          {showPassions && <div><SectionHeading accent={accent}>What I do for love</SectionHeading><PassionsSection passions={passions} accent={accent} /></div>}
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-10 space-y-10 text-sm">
      <div className={cn("border-b pb-7", accent.border)}>
        <HeroSection basicInfo={portfolio.basicInfo} accent={accent} variant="full" />
      </div>
      {sectionOrder.map((key) => sectionContent[key])}
    </div>
  );
}
