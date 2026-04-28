"use client";

import React, { useEffect, useState } from "react";
import { getAccent } from "@/lib/utils/accent";
import HeroSection from "@/components/portfolio/HeroSection";
import TerminalHero from "@/components/portfolio/TerminalHero";
import TerminalExperience from "@/components/portfolio/TerminalExperience";
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
import Reveal from "@/components/portfolio/motion/Reveal";
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
  const isTerminal = design.presentationMode === "terminal";
  const Hero = isTerminal ? TerminalHero : HeroSection;
  const Experience = isTerminal ? TerminalExperience : ExperienceSection;
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

  // Each section gets a Reveal wrapper so it fades + slides in as the
  // visitor scrolls. The whole portfolio reads as a sequence rather
  // than a static page dump.
  const sectionContent: Record<string, React.ReactNode> = {
    metrics: showMetrics ? <Reveal key="metrics"><SectionHeading accent={accent}>By the Numbers</SectionHeading><ImpactDashboard metrics={portfolio.globalMetrics} accent={accent} /></Reveal> : null,
    experience: showExperience ? <Reveal key="experience"><SectionHeading accent={accent}>Experience</SectionHeading><Experience experience={portfolio.experience} accent={accent} /></Reveal> : null,
    projects: showProjects ? <Reveal key="projects"><SectionHeading accent={accent}>Projects</SectionHeading><ProjectsSection projects={portfolio.projects ?? []} accent={accent} /></Reveal> : null,
    education: showEducation ? <Reveal key="education"><SectionHeading accent={accent}>Education</SectionHeading><EducationSection education={portfolio.education} certifications={portfolio.certifications ?? []} accent={accent} /></Reveal> : null,
    skills: showSkills ? <Reveal key="skills"><SectionHeading accent={accent}>Skills</SectionHeading><SkillsSection skills={portfolio.skills} accent={accent} /></Reveal> : null,
    recommendations: showRecommendations ? <Reveal key="recommendations"><SectionHeading accent={accent}>Recommendations</SectionHeading><RecommendationsSection recommendations={recommendations} accent={accent} /></Reveal> : null,
    mission: showMission ? <Reveal key="mission"><SectionHeading accent={accent}>What I care about</SectionHeading><MissionSectionRender mission={mission} accent={accent} /></Reveal> : null,
    manifesto: showManifesto ? <Reveal key="manifesto"><SectionHeading accent={accent}>Manifesto</SectionHeading><ManifestoSection manifesto={manifesto} accent={accent} /></Reveal> : null,
    now: showNow ? <Reveal key="now"><SectionHeading accent={accent}>Now</SectionHeading><NowSection now={now} accent={accent} /></Reveal> : null,
    passions: showPassions ? <Reveal key="passions"><SectionHeading accent={accent}>What I do for love</SectionHeading><PassionsSection passions={passions} accent={accent} /></Reveal> : null,
  };

  if (design.layoutStyle === "two-column") {
    return (
      <div className={cn("flex min-h-screen text-sm", isTerminal && "font-mono")}>
        <aside className={cn("w-[34%] shrink-0 border-e px-6 py-8 space-y-7 bg-white", accent.border)}>
          {/* Hero reveals first; downstream sidebar blocks stagger after.
              Without these wrappers the sidebar appeared instantly while
              the main column faded in — broke the composed feel. */}
          <Reveal><Hero basicInfo={portfolio.basicInfo} accent={accent} variant="header" /></Reveal>
          {portfolio.basicInfo.summary && (
            <Reveal delay={0.1}>
              <SectionHeading accent={accent}>About</SectionHeading>
              <p className="text-xs text-zinc-600 leading-relaxed">{portfolio.basicInfo.summary}</p>
            </Reveal>
          )}
          {showSkills && (
            <Reveal delay={0.2}>
              <SectionHeading accent={accent}>Skills</SectionHeading>
              <SkillsSection skills={portfolio.skills} accent={accent} />
            </Reveal>
          )}
        </aside>
        <main className="flex-1 px-8 py-8 space-y-8">
          {showManifesto && <Reveal><SectionHeading accent={accent}>Manifesto</SectionHeading><ManifestoSection manifesto={manifesto} accent={accent} /></Reveal>}
          {showMission && <Reveal><SectionHeading accent={accent}>What I care about</SectionHeading><MissionSectionRender mission={mission} accent={accent} /></Reveal>}
          {showNow && <Reveal><SectionHeading accent={accent}>Now</SectionHeading><NowSection now={now} accent={accent} /></Reveal>}
          {showMetrics && <Reveal><SectionHeading accent={accent}>Impact</SectionHeading><ImpactDashboard metrics={portfolio.globalMetrics} accent={accent} /></Reveal>}
          {showExperience && <Reveal><SectionHeading accent={accent}>Experience</SectionHeading><Experience experience={portfolio.experience} accent={accent} /></Reveal>}
          {showProjects && <Reveal><SectionHeading accent={accent}>Projects</SectionHeading><ProjectsSection projects={portfolio.projects ?? []} accent={accent} /></Reveal>}
          {showRecommendations && <Reveal><SectionHeading accent={accent}>Recommendations</SectionHeading><RecommendationsSection recommendations={recommendations} accent={accent} /></Reveal>}
          {showEducation && <Reveal><SectionHeading accent={accent}>Education</SectionHeading><EducationSection education={portfolio.education} certifications={portfolio.certifications ?? []} accent={accent} /></Reveal>}
          {showPassions && <Reveal><SectionHeading accent={accent}>What I do for love</SectionHeading><PassionsSection passions={passions} accent={accent} /></Reveal>}
        </main>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto px-8 py-10 space-y-10 text-sm", isTerminal && "font-mono")}>
      <div className={cn("border-b pb-7", accent.border)}>
        <Hero basicInfo={portfolio.basicInfo} accent={accent} variant="full" />
      </div>
      {sectionOrder.map((key) => sectionContent[key])}
    </div>
  );
}
