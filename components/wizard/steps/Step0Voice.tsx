"use client";

import React, { useState } from "react";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { useAIAvailable } from "@/hooks/useAIAvailable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VoicePolishPanel from "@/components/wizard/VoicePolishPanel";
import type { ManifestoItem, NowItem } from "@/lib/types/portfolio";

const NOW_PRESETS = [
  "Currently focused on",
  "Reading",
  "Building",
  "Learning",
  "Listening to",
  "Excited about",
] as const;

export default function Step0Voice(): React.JSX.Element {
  const tagline = usePortfolioStore((s) => s.portfolio.basicInfo.tagline ?? "");
  const title = usePortfolioStore((s) => s.portfolio.basicInfo.title);
  const mission = usePortfolioStore((s) => s.portfolio.mission);
  const manifesto = usePortfolioStore((s) => s.portfolio.manifesto);
  const now = usePortfolioStore((s) => s.portfolio.now);
  const aiAvailable = useAIAvailable();

  const setBasicInfo = usePortfolioStore((s) => s.setBasicInfo);
  const setMission = usePortfolioStore((s) => s.setMission);
  const updateMission = usePortfolioStore((s) => s.updateMission);
  const addManifestoItem = usePortfolioStore((s) => s.addManifestoItem);
  const updateManifestoItem = usePortfolioStore((s) => s.updateManifestoItem);
  const removeManifestoItem = usePortfolioStore((s) => s.removeManifestoItem);
  const addNowItem = usePortfolioStore((s) => s.addNowItem);
  const updateNowItem = usePortfolioStore((s) => s.updateNowItem);
  const removeNowItem = usePortfolioStore((s) => s.removeNowItem);

  // Track which polish panel is open. Tagline + mission are singletons;
  // manifesto polish is per-item, keyed by item id.
  const [taglinePolishOpen, setTaglinePolishOpen] = useState(false);
  const [missionPolishOpen, setMissionPolishOpen] = useState(false);
  const [manifestoPolishOpenId, setManifestoPolishOpenId] = useState<string | null>(null);

  function handleAddManifesto(): void {
    addManifestoItem({
      id: crypto.randomUUID(),
      statement: "",
      detail: "",
    });
  }

  function handleAddNow(presetLabel?: string): void {
    addNowItem({
      id: crypto.randomUUID(),
      label: presetLabel ?? "Currently focused on",
      content: "",
    });
  }

  function handleManifestoField(
    id: string,
    field: keyof ManifestoItem,
    value: string
  ): void {
    updateManifestoItem(id, { [field]: value } as Partial<ManifestoItem>);
  }

  function handleNowField(
    id: string,
    field: keyof NowItem,
    value: string
  ): void {
    updateNowItem(id, { [field]: value } as Partial<NowItem>);
  }

  return (
    <div className="space-y-9 px-6 py-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900">Your voice</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Before the resume stuff. This is where most portfolios sound the same and yours doesn&apos;t have to.
          Skip anything you&apos;re not ready for — you can come back.
        </p>
      </div>

      {/* ── Tagline ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label>One-line positioning</Label>
          {aiAvailable && !taglinePolishOpen && (
            <button
              onClick={() => setTaglinePolishOpen(true)}
              className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors shrink-0"
            >
              ✦ Help me write this
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-500 -mt-1 leading-relaxed">
          A single sentence in your voice. Not a job title.{" "}
          <span className="italic text-zinc-400">
            e.g. &ldquo;Some people talk about the long game. I run it.&rdquo;
          </span>
        </p>
        <Input
          value={tagline}
          onChange={(e) => setBasicInfo({ tagline: e.target.value })}
          placeholder="Say the thing only you would say."
          maxLength={140}
        />
        <p className="text-[10px] text-zinc-400 text-end">{tagline.length}/140</p>
        {taglinePolishOpen && (
          <VoicePolishPanel
            kind="tagline"
            context={title}
            initialRough={tagline}
            onApply={(p) => {
              if (p.kind === "tagline") setBasicInfo({ tagline: p.tagline });
            }}
            onClose={() => setTaglinePolishOpen(false)}
          />
        )}
      </div>

      {/* ── Mission ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-900">What you care about</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              The mission, the side initiative, the volunteer work. The thing that&apos;s not on your CV but is part of who you are.
            </p>
          </div>
          {mission && (
            <Button size="sm" variant="outline" onClick={() => setMission(null)}>
              Remove
            </Button>
          )}
        </div>

        {!mission ? (
          <button
            onClick={() => setMission({ title: "", body: "" })}
            className="w-full rounded-lg border border-dashed border-zinc-300 py-6 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
          >
            + Add a mission
          </button>
        ) : (
          <Card size="sm">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={mission.title}
                  onChange={(e) => updateMission({ title: e.target.value })}
                  placeholder="Running with Rami · Founding TechBros · Ocean cleanup"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <Label>Story</Label>
                  {aiAvailable && !missionPolishOpen && (
                    <button
                      onClick={() => setMissionPolishOpen(true)}
                      className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      ✦ Polish my notes
                    </button>
                  )}
                </div>
                <Textarea
                  value={mission.body}
                  onChange={(e) => updateMission({ body: e.target.value })}
                  placeholder="One to three short paragraphs. Why it matters to you, what you've built or contributed, who it's for."
                  rows={5}
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  Learn-more URL{" "}
                  <span className="text-zinc-400 font-normal">(optional)</span>
                </Label>
                <Input
                  value={mission.link ?? ""}
                  onChange={(e) => updateMission({ link: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              {missionPolishOpen && (
                <VoicePolishPanel
                  kind="mission"
                  context={title}
                  initialRough={mission.body}
                  onApply={(p) => {
                    if (p.kind === "mission") {
                      updateMission({
                        // Don't overwrite a title the user has already set
                        title: mission.title || p.title,
                        body: p.body,
                      });
                    }
                  }}
                  onClose={() => setMissionPolishOpen(false)}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Manifesto ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-900">How you think</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Two to five beliefs about product / leadership / craft. The kind of statement you&apos;d defend in a debate.
            </p>
          </div>
          <Button size="sm" onClick={handleAddManifesto}>+ Add belief</Button>
        </div>

        {manifesto.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 py-6 text-center text-sm text-zinc-400">
            No beliefs yet. One is enough to start.
          </div>
        ) : (
          <div className="space-y-3">
            {manifesto.map((item, i) => (
              <Card key={item.id} size="sm">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>Belief {i + 1}</CardTitle>
                    <div className="flex items-center gap-3">
                      {aiAvailable && manifestoPolishOpenId !== item.id && (
                        <button
                          onClick={() => setManifestoPolishOpenId(item.id)}
                          className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                        >
                          ✦ Sharpen
                        </button>
                      )}
                      <button
                        onClick={() => removeManifestoItem(item.id)}
                        className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="space-y-1.5">
                    <Label>The belief</Label>
                    <Input
                      value={item.statement}
                      onChange={(e) => handleManifestoField(item.id, "statement", e.target.value)}
                      placeholder='"Customer pain beats roadmap commitment."'
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>
                      Why <span className="text-zinc-400 font-normal">(optional)</span>
                    </Label>
                    <Input
                      value={item.detail ?? ""}
                      onChange={(e) => handleManifestoField(item.id, "detail", e.target.value)}
                      placeholder="One line of supporting context."
                    />
                  </div>
                  {manifestoPolishOpenId === item.id && (
                    <VoicePolishPanel
                      kind="manifesto"
                      context={title}
                      initialRough={
                        item.statement
                          ? `${item.statement}${item.detail ? "\n" + item.detail : ""}`
                          : ""
                      }
                      onApply={(p) => {
                        if (p.kind === "manifesto") {
                          updateManifestoItem(item.id, {
                            statement: p.statement,
                            detail: p.detail,
                          });
                        }
                      }}
                      onClose={() => setManifestoPolishOpenId(null)}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── Now ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-900">What you&apos;re doing now</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              A snapshot, not history. Updated by you, whenever. Inspired by{" "}
              <a
                href="https://nownownow.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-zinc-700"
              >
                /now pages
              </a>
              .
            </p>
          </div>
          <Button size="sm" onClick={() => handleAddNow()}>+ Add</Button>
        </div>

        {now.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 py-6 px-4 space-y-3">
            <p className="text-sm text-zinc-400 text-center">
              Quick-add a category:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {NOW_PRESETS.map((label) => (
                <button
                  key={label}
                  onClick={() => handleAddNow(label)}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 hover:border-zinc-400 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {now.map((item) => (
              <Card key={item.id} size="sm">
                <CardContent className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-3 items-start pt-4">
                  <div className="space-y-1.5">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => handleNowField(item.id, "label", e.target.value)}
                      placeholder="Reading"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Content</Label>
                    <Input
                      value={item.content}
                      onChange={(e) => handleNowField(item.id, "content", e.target.value)}
                      placeholder='"Working in Public" by Nadia Eghbal'
                    />
                  </div>
                  <button
                    onClick={() => removeNowItem(item.id)}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors mt-7"
                  >
                    Remove
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
