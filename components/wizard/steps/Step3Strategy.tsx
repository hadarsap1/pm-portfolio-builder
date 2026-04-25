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
import { cn } from "@/lib/utils";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import type { Superpower, EmphasizedSection, SectionKey } from "@/lib/types/portfolio";

const DEFAULT_SECTION_ORDER: SectionKey[] = ["metrics", "experience", "projects", "recommendations", "education", "skills"];
const SECTION_LABELS: Record<SectionKey, string> = {
  metrics: "By the Numbers",
  experience: "Experience",
  projects: "Projects",
  recommendations: "Recommendations",
  education: "Education",
  skills: "Skills",
};

function SortableSection({ id }: { id: SectionKey }): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 touch-none select-none text-lg leading-none"
      >
        ⠿
      </button>
      <span className="text-sm text-zinc-700">{SECTION_LABELS[id]}</span>
    </div>
  );
}

const SUPERPOWERS: { value: Superpower; label: string; description: string }[] = [
  { value: "growth", label: "Growth", description: "I scale what works. Revenue, users, retention." },
  { value: "zero-to-one", label: "Zero-to-One", description: "I build from blank. 0→1 products from scratch." },
  { value: "technical", label: "Technical", description: "I speak eng. Data pipelines, APIs, systems." },
];

const EMPHASIZED_SECTIONS: { value: EmphasizedSection; label: string }[] = [
  { value: "metrics", label: "Metrics" },
  { value: "experience", label: "Experience" },
  { value: "projects", label: "Projects" },
  { value: "skills", label: "Skills" },
  { value: "education", label: "Education" },
  { value: "recommendations", label: "Recommendations" },
];

export default function Step3Strategy(): React.JSX.Element {
  const superpower = usePortfolioStore((s) => s.strategy.superpower);
  const toneKeywords = usePortfolioStore((s) => s.strategy.toneKeywords);
  const emphasizedSections = usePortfolioStore((s) => s.strategy.emphasizedSections);
  const sectionOrder = usePortfolioStore((s) => s.strategy.sectionOrder ?? DEFAULT_SECTION_ORDER);
  const setSuperpower = usePortfolioStore((s) => s.setSuperpower);
  const setStrategicFocus = usePortfolioStore((s) => s.setStrategicFocus);
  const toggleEmphasizedSection = usePortfolioStore((s) => s.toggleEmphasizedSection);
  const setSectionOrder = usePortfolioStore((s) => s.setSectionOrder);

  const [keywordInput, setKeywordInput] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleSectionDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionOrder.indexOf(active.id as SectionKey);
    const newIndex = sectionOrder.indexOf(over.id as SectionKey);
    setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
  }

  function handleKeywordKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      const kw = keywordInput.trim();
      if (!toneKeywords.includes(kw)) {
        setStrategicFocus({ toneKeywords: [...toneKeywords, kw] });
      }
      setKeywordInput("");
    }
  }

  function removeKeyword(kw: string): void {
    setStrategicFocus({ toneKeywords: toneKeywords.filter((k) => k !== kw) });
  }

  return (
    <div className="space-y-7 px-6 py-6">
      {/* Superpower */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Your Superpower</h2>
          <p className="text-sm text-zinc-500">How should your portfolio position you?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SUPERPOWERS.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => setSuperpower(value)}
              className={cn(
                "rounded-xl border-2 p-4 text-start transition-all",
                superpower === value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
              )}
            >
              <p className="text-sm font-semibold text-zinc-900 mb-1">{label}</p>
              <p className="text-xs text-zinc-500 leading-snug">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Keywords */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Tone Keywords</h2>
          <p className="text-sm text-zinc-500">Words that describe how you work. Press Enter to add.</p>
        </div>

        <input
          type="text"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={handleKeywordKeyDown}
          placeholder="data-driven, collaborative, shipped..."
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-colors"
        />

        {toneKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {toneKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700"
              >
                {kw}
                <button
                  onClick={() => removeKeyword(kw)}
                  className="text-zinc-400 hover:text-zinc-700 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Emphasized Sections */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Emphasize Sections</h2>
          <p className="text-sm text-zinc-500">Select which sections to highlight prominently.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {EMPHASIZED_SECTIONS.map(({ value, label }) => {
            const isActive = emphasizedSections.includes(value);
            return (
              <button
                key={value}
                onClick={() => toggleEmphasizedSection(value)}
                className={cn(
                  "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Order */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Section Order</h2>
          <p className="text-sm text-zinc-500">Drag to reorder sections in the portfolio.</p>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sectionOrder.map((id) => (
                <SortableSection key={id} id={id} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {JSON.stringify(sectionOrder) !== JSON.stringify(DEFAULT_SECTION_ORDER) && (
          <button
            onClick={() => setSectionOrder(DEFAULT_SECTION_ORDER)}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            Reset order
          </button>
        )}
      </div>
    </div>
  );
}
