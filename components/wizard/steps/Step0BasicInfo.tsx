"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { useAIAvailable } from "@/hooks/useAIAvailable";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Step0BasicInfo(): React.JSX.Element {
  const basicInfo = usePortfolioStore((s) => s.portfolio.basicInfo);
  const experience = usePortfolioStore((s) => s.portfolio.experience);
  const skills = usePortfolioStore((s) => s.portfolio.skills);
  const strategy = usePortfolioStore((s) => s.strategy);
  const setBasicInfo = usePortfolioStore((s) => s.setBasicInfo);

  const aiAvailable = useAIAvailable();
  const [generatingSummary, setGeneratingSummary] = useState(false);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBasicInfo({ avatarUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleGenerateSummary(): Promise<void> {
    setGeneratingSummary(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "generate-summary",
          name: basicInfo.name,
          title: basicInfo.title,
          experience: experience.map((e) => ({
            role: e.role,
            company: e.company,
            bullets: e.bullets,
          })),
          skills: skills.flatMap((c) => c.items),
          superpower: strategy.superpower,
          toneKeywords: strategy.toneKeywords,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { summary?: string };
        if (data.summary) {
          setBasicInfo({ summary: data.summary });
          toast.success("Summary generated");
        }
      } else {
        const err = (await res.json()) as { error?: string };
        toast.error(err.error ?? "AI generate failed");
      }
    } finally {
      setGeneratingSummary(false);
    }
  }

  return (
    <div className="space-y-5 px-6 py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Basic Information</h2>
          <p className="text-sm text-zinc-500">This appears at the top of your portfolio.</p>
        </div>

        {/* Avatar upload */}
        <label className="flex flex-col items-center gap-1 cursor-pointer group shrink-0">
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-zinc-200 group-hover:border-zinc-400 transition-colors bg-zinc-100 flex items-center justify-center">
            {basicInfo.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={basicInfo.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-zinc-400 text-xl">+</span>
            )}
          </div>
          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-600 transition-colors">Photo</span>
          <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={basicInfo.name}
            onChange={(e) => setBasicInfo({ name: e.target.value })}
            placeholder="Jane Smith"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={basicInfo.title}
            onChange={(e) => setBasicInfo({ title: e.target.value })}
            placeholder="Senior Product Manager"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={basicInfo.email}
            onChange={(e) => setBasicInfo({ email: e.target.value })}
            placeholder="jane@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={basicInfo.location ?? ""}
            onChange={(e) => setBasicInfo({ location: e.target.value })}
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            value={basicInfo.linkedin ?? ""}
            onChange={(e) => setBasicInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/janesmith"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            value={basicInfo.github ?? ""}
            onChange={(e) => setBasicInfo({ github: e.target.value })}
            placeholder="github.com/janesmith"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Summary</Label>
          {aiAvailable && (
            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="text-[11px] font-medium text-violet-600 hover:text-violet-800 disabled:opacity-40 transition-colors"
            >
              {generatingSummary ? "Generating…" : "✦ AI Generate"}
            </button>
          )}
        </div>
        <Textarea
          id="summary"
          value={basicInfo.summary}
          onChange={(e) => setBasicInfo({ summary: e.target.value })}
          placeholder="PM with 8+ years driving growth across SaaS and marketplace products..."
          rows={4}
        />
      </div>
    </div>
  );
}
