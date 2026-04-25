"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { useAIAvailable } from "@/hooks/useAIAvailable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectItem } from "@/lib/types/portfolio";

function SortableProjectCard({
  project,
  onUpdate,
  onRemove,
  aiAvailable,
}: {
  project: ProjectItem;
  onUpdate: (id: string, data: Partial<ProjectItem>) => void;
  onRemove: (id: string) => void;
  aiAvailable: boolean | null;
}): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const [generatingOutcome, setGeneratingOutcome] = useState(false);
  const [tagInput, setTagInput] = useState("");

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!project.tags.includes(tag)) {
        onUpdate(project.id, { tags: [...project.tags, tag] });
      }
      setTagInput("");
    }
  }

  function removeTag(tag: string): void {
    onUpdate(project.id, { tags: project.tags.filter((t) => t !== tag) });
  }

  async function handleGenerateOutcome(): Promise<void> {
    if (!project.title && !project.solution) {
      toast.error("Add a project title and solution first.");
      return;
    }
    setGeneratingOutcome(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "generate-project-outcome",
          title: project.title,
          problem: project.problem,
          solution: project.solution,
          company: project.company,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { outcome?: string };
        if (data.outcome) {
          onUpdate(project.id, { outcome: data.outcome });
          toast.success("Outcome generated");
        } else {
          toast.error("Try again");
        }
      } else {
        toast.error("Generation failed");
      }
    } catch {
      toast.error("AI unavailable");
    } finally {
      setGeneratingOutcome(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      <Card size="sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 touch-none select-none text-lg leading-none"
            >
              ⠿
            </button>
            <CardTitle className="flex-1 truncate">
              {project.title || "Untitled Project"}
            </CardTitle>
            <button
              onClick={() => onRemove(project.id)}
              className="text-xs text-zinc-400 hover:text-red-500 transition-colors shrink-0"
            >
              Remove
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project Title</Label>
              <Input
                value={project.title}
                onChange={(e) => onUpdate(project.id, { title: e.target.value })}
                placeholder="Checkout Redesign"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company / Team</Label>
              <Input
                value={project.company}
                onChange={(e) => onUpdate(project.id, { company: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Duration</Label>
            <Input
              value={project.duration}
              onChange={(e) => onUpdate(project.id, { duration: e.target.value })}
              placeholder="Q1 2024 – Q3 2024"
              className="w-48"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Problem / Opportunity</Label>
            <textarea
              value={project.problem}
              onChange={(e) => onUpdate(project.id, { problem: e.target.value })}
              placeholder="What was the challenge or opportunity you were solving?"
              rows={2}
              className="w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label>What You Did</Label>
            <textarea
              value={project.solution}
              onChange={(e) => onUpdate(project.id, { solution: e.target.value })}
              placeholder="Your approach, decisions, and how you led the initiative."
              rows={2}
              className="w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Outcome</Label>
              {aiAvailable && (
                <button
                  onClick={handleGenerateOutcome}
                  disabled={generatingOutcome}
                  className="text-[11px] font-medium text-violet-600 hover:text-violet-800 disabled:opacity-50 transition-colors"
                >
                  {generatingOutcome ? "Generating…" : "✦ AI Generate"}
                </button>
              )}
            </div>
            <textarea
              value={project.outcome}
              onChange={(e) => onUpdate(project.id, { outcome: e.target.value })}
              placeholder="Quantified results: increased X by Y%, reduced Z from A to B."
              rows={2}
              className="w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Link (optional)</Label>
            <Input
              value={project.link ?? ""}
              onChange={(e) => onUpdate(project.id, { link: e.target.value || undefined })}
              placeholder="https://..."
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag and press Enter (e.g. Growth, B2B, 0→1)"
              className="w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-zinc-400 hover:text-zinc-700 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Step2Projects(): React.JSX.Element {
  const projects = usePortfolioStore((s) => s.portfolio.projects);
  const addProject = usePortfolioStore((s) => s.addProject);
  const updateProject = usePortfolioStore((s) => s.updateProject);
  const removeProject = usePortfolioStore((s) => s.removeProject);
  const reorderProjects = usePortfolioStore((s) => s.reorderProjects);
  const aiAvailable = useAIAvailable();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleAdd(): void {
    addProject({
      id: crypto.randomUUID(),
      title: "",
      company: "",
      duration: "",
      problem: "",
      solution: "",
      outcome: "",
      tags: [],
    });
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    reorderProjects(arrayMove(projects, oldIndex, newIndex).map((p) => p.id));
  }

  return (
    <div className="space-y-5 px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Projects & Case Studies</h2>
          <p className="text-sm text-zinc-500">Highlight key initiatives with problem → solution → outcome.</p>
        </div>
        <Button size="sm" onClick={handleAdd}>+ Add Project</Button>
      </div>

      {projects.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-200 py-10 text-center">
          <p className="text-sm text-zinc-400 mb-1">No projects yet.</p>
          <p className="text-xs text-zinc-400">Each project becomes a case study card in your portfolio.</p>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {projects.map((project) => (
              <SortableProjectCard
                key={project.id}
                project={project}
                onUpdate={updateProject}
                onRemove={removeProject}
                aiAvailable={aiAvailable}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
