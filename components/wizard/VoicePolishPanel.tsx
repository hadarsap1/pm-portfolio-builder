"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Kind = "tagline" | "mission" | "manifesto";

interface TaglineResult {
  kind: "tagline";
  candidates: string[];
}
interface MissionResult {
  kind: "mission";
  title: string;
  body: string;
}
interface ManifestoResult {
  kind: "manifesto";
  statement: string;
  detail: string;
}
type Result = TaglineResult | MissionResult | ManifestoResult;

interface VoicePolishPanelProps {
  kind: Kind;
  /** Optional context — usually the user's current title/role to ground the model */
  context?: string;
  /** Called when the user picks a candidate. Shape varies by kind. */
  onApply: (
    payload:
      | { kind: "tagline"; tagline: string }
      | { kind: "mission"; title: string; body: string }
      | { kind: "manifesto"; statement: string; detail: string }
  ) => void;
  /** Called to close the panel without applying */
  onClose: () => void;
  /** Optional starting rough draft — pre-fills the textarea */
  initialRough?: string;
}

const KIND_COPY: Record<
  Kind,
  { title: string; placeholder: string; helper: string; cta: string }
> = {
  tagline: {
    title: "Help me write a one-liner",
    placeholder:
      "Type a few rough sentences or bullets — what you actually want to say. Don't overthink it. e.g.\n- I'm sick of frameworks that don't move metrics\n- I think product is about velocity not slides\n- I've shipped 47 experiments this year",
    helper:
      "Drop in 2–4 rough sentences. AI returns three distinct candidate one-liners — pick the one that sounds most like you.",
    cta: "Generate 3 candidates",
  },
  mission: {
    title: "Help me write my mission",
    placeholder:
      "Bullet points are fine. What is it, who's it for, why does it matter to you, what have you done so far. e.g.\n- run with PTSD veterans every Sunday\n- 11 years\n- my dad served, that's where it started",
    helper:
      "Rough notes are fine — keep names, places, numbers. AI shapes it into a short story you can edit.",
    cta: "Polish into a story",
  },
  manifesto: {
    title: "Sharpen this belief",
    placeholder:
      "Type the rough version of the belief. e.g.\n- I think we waste a ton of time on PRDs that nobody reads, the spec should live in the code review",
    helper:
      "Plain language is fine. AI cuts the hedging and returns one declarative line plus optional supporting context.",
    cta: "Sharpen it",
  },
};

export default function VoicePolishPanel({
  kind,
  context,
  onApply,
  onClose,
  initialRough = "",
}: VoicePolishPanelProps): React.JSX.Element {
  const copy = KIND_COPY[kind];
  const [rough, setRough] = useState(initialRough);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // Escape closes the panel — the only "Close" affordance was a small text
  // link that's easy to miss when the panel is long.
  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleGenerate(): Promise<void> {
    if (!rough.trim()) {
      toast.error("Type a few words first — even rough is fine.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "polish-voice",
          kind,
          rough,
          context,
        }),
      });
      const body = (await res.json()) as
        | (Result & { kind: Kind })
        | { error: string };
      if (!res.ok || "error" in body) {
        toast.error("error" in body ? body.error : "Something went wrong.");
        return;
      }
      setResult(body);
    } catch {
      toast.error("Couldn't reach the AI service.");
    } finally {
      setBusy(false);
    }
  }

  function handlePickTagline(candidate: string): void {
    onApply({ kind: "tagline", tagline: candidate });
    onClose();
  }

  function handleApplyMission(): void {
    if (!result || result.kind !== "mission") return;
    onApply({ kind: "mission", title: result.title, body: result.body });
    onClose();
  }

  function handleApplyManifesto(): void {
    if (!result || result.kind !== "manifesto") return;
    onApply({
      kind: "manifesto",
      statement: result.statement,
      detail: result.detail,
    });
    onClose();
  }

  return (
    <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            <span className="text-violet-600">✦</span> {copy.title}
          </p>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{copy.helper}</p>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors shrink-0"
        >
          Close
        </button>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px]">In your own words</Label>
        <Textarea
          value={rough}
          onChange={(e) => setRough(e.target.value)}
          placeholder={copy.placeholder}
          rows={5}
          className="text-sm"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button size="sm" onClick={handleGenerate} disabled={busy || !rough.trim()}>
          {busy ? "Working…" : copy.cta}
        </Button>
      </div>

      {/* ── Results ─────────────────────────────────────────────── */}
      {result?.kind === "tagline" && (
        <div className="space-y-2 pt-2 border-t border-violet-200">
          <p className="text-xs font-semibold text-zinc-700">Pick one:</p>
          {result.candidates.map((c, i) => (
            <button
              key={i}
              onClick={() => handlePickTagline(c)}
              className={cn(
                "w-full text-start rounded-lg border bg-white px-3 py-2.5 transition-all",
                "border-zinc-200 hover:border-violet-400 hover:bg-violet-50"
              )}
            >
              <p className="text-sm font-medium text-zinc-900 leading-snug">{c}</p>
            </button>
          ))}
          <button
            onClick={handleGenerate}
            disabled={busy}
            className="text-[11px] text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors"
          >
            Try again with the same draft
          </button>
        </div>
      )}

      {result?.kind === "mission" && (
        <div className="space-y-2 pt-2 border-t border-violet-200">
          <div className="rounded-lg border border-zinc-200 bg-white p-3 space-y-2">
            {result.title && (
              <p className="text-sm font-semibold text-zinc-900">{result.title}</p>
            )}
            {result.body
              .split(/\n\s*\n/)
              .filter((p) => p.trim())
              .map((p, i) => (
                <p key={i} className="text-xs text-zinc-600 leading-relaxed">{p}</p>
              ))}
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleGenerate}
              disabled={busy}
              className="text-[11px] text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors"
            >
              Try again
            </button>
            <Button size="sm" onClick={handleApplyMission}>Use this</Button>
          </div>
        </div>
      )}

      {result?.kind === "manifesto" && (
        <div className="space-y-2 pt-2 border-t border-violet-200">
          <div className="rounded-lg border border-zinc-200 bg-white p-3 space-y-1.5">
            <p className="text-sm font-semibold text-zinc-900 leading-snug">
              {result.statement}
            </p>
            {result.detail && (
              <p className="text-xs text-zinc-500 leading-relaxed">{result.detail}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleGenerate}
              disabled={busy}
              className="text-[11px] text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors"
            >
              Try again
            </button>
            <Button size="sm" onClick={handleApplyManifesto}>Use this</Button>
          </div>
        </div>
      )}
    </div>
  );
}
