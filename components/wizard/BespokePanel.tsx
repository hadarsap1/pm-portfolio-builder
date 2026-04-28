"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step =
  | { kind: "idle" }
  | { kind: "running"; label: string; index: number; total: number }
  | { kind: "done" }
  | { kind: "error"; message: string };

interface BespokePayload {
  kind: "hero" | "passion";
  voice: {
    tagline?: string;
    mission?: string;
    passionTitle?: string;
    passionBody?: string;
  };
  colorTheme?: string;
}

async function callBespoke(payload: BespokePayload): Promise<string> {
  const res = await fetch("/api/ai/bespoke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json()) as { dataUrl?: string; error?: string };
  if (!res.ok || !body.dataUrl) {
    throw new Error(body.error ?? "Image generation failed.");
  }
  return body.dataUrl;
}

/**
 * The "Make it bespoke" panel. Orchestrates a sequence of image
 * generations (hero + one per passion), updates the store as each
 * lands, and surfaces a clear progress state. Once complete, each
 * image gets a regenerate button.
 *
 * Cost notes for the user: 1 + N(passions) Gemini image calls. The
 * route is rate-limited; this UI also disables the trigger while busy.
 */
export default function BespokePanel(): React.JSX.Element {
  const tagline = usePortfolioStore((s) => s.portfolio.basicInfo.tagline);
  const heroImageUrl = usePortfolioStore((s) => s.portfolio.basicInfo.heroImageUrl);
  const mission = usePortfolioStore((s) => s.portfolio.mission);
  const passions = usePortfolioStore((s) => s.portfolio.passions);
  const colorTheme = usePortfolioStore((s) => s.design.colorTheme);
  const setBasicInfo = usePortfolioStore((s) => s.setBasicInfo);
  const updatePassion = usePortfolioStore((s) => s.updatePassion);

  const [step, setStep] = useState<Step>({ kind: "idle" });

  const hasVoice = Boolean(tagline?.trim() || mission?.body?.trim());
  const totalSteps = 1 + passions.length;
  const isBusy = step.kind === "running";

  async function handleGenerateAll(): Promise<void> {
    if (!hasVoice) {
      toast.error("Add a tagline or a mission first — that's what the model paints from.");
      return;
    }

    try {
      // Step 1: hero
      setStep({ kind: "running", label: "Painting your hero…", index: 1, total: totalSteps });
      const heroUrl = await callBespoke({
        kind: "hero",
        voice: { tagline, mission: mission?.body },
        colorTheme,
      });
      setBasicInfo({ heroImageUrl: heroUrl });

      // Steps 2…N: one per passion
      for (let i = 0; i < passions.length; i++) {
        const p = passions[i]!;
        setStep({
          kind: "running",
          label: `Imagining ${p.title || `passion ${i + 1}`}…`,
          index: i + 2,
          total: totalSteps,
        });
        try {
          const url = await callBespoke({
            kind: "passion",
            voice: { passionTitle: p.title, passionBody: p.body },
            colorTheme,
          });
          updatePassion(p.id, { imageUrl: url });
        } catch (err) {
          // Don't abort the whole batch on a single passion failure
          const message = err instanceof Error ? err.message : "failed";
          toast.error(`Couldn't generate ${p.title || "a passion"} image: ${message}`);
        }
      }

      setStep({ kind: "done" });
      toast.success("Bespoke imagery ready. Open the preview.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed.";
      setStep({ kind: "error", message });
      toast.error(message);
    }
  }

  async function handleRegenerateHero(): Promise<void> {
    if (isBusy) return;
    setStep({ kind: "running", label: "Repainting your hero…", index: 1, total: 1 });
    try {
      const url = await callBespoke({
        kind: "hero",
        voice: { tagline, mission: mission?.body },
        colorTheme,
      });
      setBasicInfo({ heroImageUrl: url });
      setStep({ kind: "done" });
      toast.success("New hero ready.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed.";
      setStep({ kind: "error", message });
      toast.error(message);
    }
  }

  return (
    <div className="w-full max-w-xs space-y-3 rounded-lg border border-violet-200 bg-violet-50/40 p-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-900">
          <span className="text-violet-600">✦</span> Make it bespoke
        </p>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Generate a custom hero illustration plus a mood image for each of your passions.
          One-click art direction tied to your voice. Saved locally and embedded in your exported HTML — share links stay lean.
        </p>
        <p className="text-[10px] text-zinc-400">
          Uses Gemini · about {totalSteps} {totalSteps === 1 ? "image" : "images"} · 30–90&nbsp;sec total.
        </p>
      </div>

      {step.kind === "idle" && (
        <Button size="sm" className="w-full" onClick={handleGenerateAll} disabled={!hasVoice}>
          {hasVoice ? `Generate ${totalSteps} ${totalSteps === 1 ? "image" : "images"}` : "Add voice first"}
        </Button>
      )}

      {step.kind === "running" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
            <span>{step.label}</span>
          </div>
          <div className="h-1 w-full rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all duration-500"
              style={{ width: `${(step.index / step.total) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-400 text-center">
            Step {step.index} of {step.total}
          </p>
        </div>
      )}

      {step.kind === "done" && (
        <div className="space-y-2">
          {heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt="Your bespoke hero"
              className={cn("w-full rounded-lg border", "border-violet-200")}
            />
          )}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-emerald-700 font-medium">✓ Done</p>
            <button
              onClick={handleRegenerateHero}
              className="text-[11px] text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors"
            >
              Regenerate hero
            </button>
          </div>
        </div>
      )}

      {step.kind === "error" && (
        <div className="space-y-2">
          <p className="text-xs text-red-600">{step.message}</p>
          <Button size="sm" className="w-full" onClick={handleGenerateAll}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
