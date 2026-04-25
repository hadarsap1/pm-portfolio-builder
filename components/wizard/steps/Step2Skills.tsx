"use client";

import React, { useState } from "react";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Step2Skills(): React.JSX.Element {
  const skills = usePortfolioStore((s) => s.portfolio.skills);
  const globalMetrics = usePortfolioStore((s) => s.portfolio.globalMetrics);
  const addSkillCategory = usePortfolioStore((s) => s.addSkillCategory);
  const removeSkillCategory = usePortfolioStore((s) => s.removeSkillCategory);
  const addGlobalMetric = usePortfolioStore((s) => s.addGlobalMetric);
  const setGlobalMetrics = usePortfolioStore((s) => s.setGlobalMetrics);
  const removeGlobalMetric = usePortfolioStore((s) => s.removeGlobalMetric);

  function updateGlobalMetric(id: string, patch: Partial<typeof globalMetrics[0]>): void {
    setGlobalMetrics(globalMetrics.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [newCategoryItems, setNewCategoryItems] = useState("");

  function handleAddCategory(): void {
    const label = newCategoryLabel.trim();
    if (!label) return;
    const items = newCategoryItems
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    addSkillCategory({ id: crypto.randomUUID(), label, items });
    setNewCategoryLabel("");
    setNewCategoryItems("");
  }

  function handleAddMetric(): void {
    addGlobalMetric({ id: crypto.randomUUID(), label: "", value: "" });
  }

  return (
    <div className="space-y-6 px-6 py-6">
      {/* Skills */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Skills</h2>
          <p className="text-sm text-zinc-500">Group skills by category.</p>
        </div>

        <Card size="sm">
          <CardContent className="space-y-3 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category Name</Label>
                <Input
                  value={newCategoryLabel}
                  onChange={(e) => setNewCategoryLabel(e.target.value)}
                  placeholder="Tools & Platforms"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Items (comma-separated)</Label>
                <Input
                  value={newCategoryItems}
                  onChange={(e) => setNewCategoryItems(e.target.value)}
                  onBlur={() => {}}
                  placeholder="Jira, Figma, SQL"
                />
              </div>
            </div>
            <Button size="sm" onClick={handleAddCategory}>
              + Add Category
            </Button>
          </CardContent>
        </Card>

        {skills.length > 0 && (
          <div className="space-y-2">
            {skills.map((cat) => (
              <div key={cat.id} className="flex items-start gap-2 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-zinc-600 mb-1.5">{cat.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeSkillCategory(cat.id)}
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900">Key Metrics</h2>
            <p className="text-sm text-zinc-500">Headline numbers that define your impact.</p>
          </div>
          <Button size="sm" onClick={handleAddMetric}>
            + Add Metric
          </Button>
        </div>

        {globalMetrics.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">
            No metrics yet. Click &ldquo;+ Add Metric&rdquo; to start.
          </div>
        )}

        <div className="space-y-3">
          {globalMetrics.map((metric) => (
            <Card key={metric.id} size="sm">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-3 items-end">
                  <div className="space-y-1.5">
                    <Label>Value</Label>
                    <Input
                      value={metric.value}
                      onChange={(e) => updateGlobalMetric(metric.id, { value: e.target.value })}
                      placeholder="$12M"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Label</Label>
                    <Input
                      value={metric.label}
                      onChange={(e) => updateGlobalMetric(metric.id, { label: e.target.value })}
                      placeholder="Revenue Driven"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Context (optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={metric.context ?? ""}
                        onChange={(e) => updateGlobalMetric(metric.id, { context: e.target.value })}
                        placeholder="FY2024"
                      />
                      <button
                        onClick={() => removeGlobalMetric(metric.id)}
                        className="text-xs text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
