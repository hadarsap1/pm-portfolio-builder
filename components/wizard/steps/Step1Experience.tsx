"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { useAIAvailable } from "@/hooks/useAIAvailable";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperienceItem, Metric } from "@/lib/types/portfolio";

interface SortableCardProps {
  item: ExperienceItem;
  index: number;
  aiAvailable: boolean | null;
  improvingId: string | null;
  onField: (id: string, field: keyof ExperienceItem, value: string) => void;
  onRemove: (id: string) => void;
  onAddMetric: (id: string, metrics: Metric[]) => void;
  onUpdateMetric: (expId: string, metricId: string, patch: Partial<Metric>, metrics: Metric[]) => void;
  onRemoveMetric: (expId: string, metricId: string, metrics: Metric[]) => void;
  onImprove: (item: ExperienceItem) => void;
}

function SortableCard({
  item,
  index,
  aiAvailable,
  improvingId,
  onField,
  onRemove,
  onAddMetric,
  onUpdateMetric,
  onRemoveMetric,
  onImprove,
}: SortableCardProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card size="sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 touch-none select-none"
                title="Drag to reorder"
              >
                ⠿
              </button>
              <CardTitle>Role {index + 1}</CardTitle>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input
                value={item.company}
                onChange={(e) => onField(item.id, "company", e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role / Title</Label>
              <Input
                value={item.role}
                onChange={(e) => onField(item.id, "role", e.target.value)}
                placeholder="Senior PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input
                value={item.startDate}
                onChange={(e) => onField(item.id, "startDate", e.target.value)}
                placeholder="Jan 2021"
              />
            </div>
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Input
                value={item.endDate}
                onChange={(e) => onField(item.id, "endDate", e.target.value)}
                placeholder="Present"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Bullets (one per line)</Label>
              {aiAvailable && (
                <button
                  onClick={() => onImprove(item)}
                  disabled={improvingId === item.id || !item.bullets.length}
                  className="text-[11px] font-medium text-violet-600 hover:text-violet-800 disabled:opacity-40 transition-colors"
                >
                  {improvingId === item.id ? "Improving…" : "✦ AI Improve"}
                </button>
              )}
            </div>
            <Textarea
              value={item.bullets.join("\n")}
              onChange={(e) => onField(item.id, "bullets", e.target.value)}
              placeholder={"Launched checkout redesign, +12% conversion\nLed cross-functional team of 8"}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-500">Role Metrics</Label>
              <button
                onClick={() => onAddMetric(item.id, item.metrics)}
                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                + Add Metric
              </button>
            </div>
            {item.metrics.map((m) => (
              <div key={m.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <Input
                  value={m.value}
                  onChange={(e) => onUpdateMetric(item.id, m.id, { value: e.target.value }, item.metrics)}
                  placeholder="$4M"
                  className="text-xs"
                />
                <Input
                  value={m.label}
                  onChange={(e) => onUpdateMetric(item.id, m.id, { label: e.target.value }, item.metrics)}
                  placeholder="ARR added"
                  className="text-xs"
                />
                <button
                  onClick={() => onRemoveMetric(item.id, m.id, item.metrics)}
                  className="text-zinc-400 hover:text-red-500 text-sm transition-colors px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Step1Experience(): React.JSX.Element {
  const experience = usePortfolioStore((s) => s.portfolio.experience);
  const strategy = usePortfolioStore((s) => s.strategy);
  const addExperience = usePortfolioStore((s) => s.addExperience);
  const updateExperience = usePortfolioStore((s) => s.updateExperience);
  const removeExperience = usePortfolioStore((s) => s.removeExperience);
  const reorderExperience = usePortfolioStore((s) => s.reorderExperience);

  const aiAvailable = useAIAvailable();
  const [improvingId, setImprovingId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = experience.findIndex((e) => e.id === active.id);
    const newIndex = experience.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(experience, oldIndex, newIndex);
    reorderExperience(reordered.map((e) => e.id));
  }

  function handleAdd(): void {
    addExperience({
      id: crypto.randomUUID(),
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      bullets: [],
      metrics: [],
    });
  }

  function handleField(id: string, field: keyof ExperienceItem, value: string): void {
    if (field === "bullets") {
      updateExperience(id, { bullets: value.split("\n").filter((b) => b.trim() !== "") });
    } else {
      updateExperience(id, { [field]: value } as Partial<ExperienceItem>);
    }
  }

  function addMetric(id: string, currentMetrics: Metric[]): void {
    updateExperience(id, {
      metrics: [...currentMetrics, { id: crypto.randomUUID(), label: "", value: "" }],
    });
  }

  function updateMetric(expId: string, metricId: string, patch: Partial<Metric>, currentMetrics: Metric[]): void {
    updateExperience(expId, {
      metrics: currentMetrics.map((m) => (m.id === metricId ? { ...m, ...patch } : m)),
    });
  }

  function removeMetric(expId: string, metricId: string, currentMetrics: Metric[]): void {
    updateExperience(expId, {
      metrics: currentMetrics.filter((m) => m.id !== metricId),
    });
  }

  async function handleImproveBullets(item: ExperienceItem): Promise<void> {
    if (!item.bullets.length) return;
    setImprovingId(item.id);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "improve-bullets",
          role: item.role,
          company: item.company,
          bullets: item.bullets,
          superpower: strategy.superpower,
          toneKeywords: strategy.toneKeywords,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { bullets?: string[] };
        if (data.bullets?.length) {
          updateExperience(item.id, { bullets: data.bullets });
          toast.success("Bullets improved");
        }
      } else {
        const err = (await res.json()) as { error?: string };
        toast.error(err.error ?? "AI improve failed");
      }
    } catch {
      toast.error("Network error — AI unavailable");
    } finally {
      setImprovingId(null);
    }
  }

  return (
    <div className="space-y-5 px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Experience</h2>
          <p className="text-sm text-zinc-500">Add your work history, most recent first.</p>
        </div>
        <Button size="sm" onClick={handleAdd}>+ Add Role</Button>
      </div>

      {experience.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-400">
          No roles added yet. Click &ldquo;+ Add Role&rdquo; to start.
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {experience.map((item, i) => (
              <SortableCard
                key={item.id}
                item={item}
                index={i}
                aiAvailable={aiAvailable}
                improvingId={improvingId}
                onField={handleField}
                onRemove={removeExperience}
                onAddMetric={addMetric}
                onUpdateMetric={updateMetric}
                onRemoveMetric={removeMetric}
                onImprove={handleImproveBullets}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
