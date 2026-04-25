"use client";

import React from "react";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendationItem } from "@/lib/types/portfolio";

export default function Step5Recommendations(): React.JSX.Element {
  const recommendations = usePortfolioStore((s) => s.portfolio.recommendations);
  const addRecommendation = usePortfolioStore((s) => s.addRecommendation);
  const updateRecommendation = usePortfolioStore((s) => s.updateRecommendation);
  const removeRecommendation = usePortfolioStore((s) => s.removeRecommendation);

  function handleAdd(): void {
    addRecommendation({
      id: crypto.randomUUID(),
      name: "",
      role: "",
      company: "",
      relationship: "",
      quote: "",
    });
  }

  function handleField(
    id: string,
    field: keyof RecommendationItem,
    value: string
  ): void {
    updateRecommendation(id, { [field]: value } as Partial<RecommendationItem>);
  }

  return (
    <div className="space-y-6 px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Recommendations</h2>
          <p className="text-sm text-zinc-500">
            Pull two or three short quotes from LinkedIn, performance reviews, or
            colleague feedback. Social proof &gt; self-praise.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd}>+ Add Quote</Button>
      </div>

      {recommendations.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">
          No recommendations yet. Even one strong quote moves the needle.
        </div>
      )}

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <Card key={rec.id} size="sm">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Quote {i + 1}</CardTitle>
                <button
                  onClick={() => removeRecommendation(rec.id)}
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label>Quote</Label>
                <Textarea
                  value={rec.quote}
                  onChange={(e) => handleField(rec.id, "quote", e.target.value)}
                  placeholder="One of the sharpest product thinkers I've worked with..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Recommender Name</Label>
                  <Input
                    value={rec.name}
                    onChange={(e) => handleField(rec.id, "name", e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={rec.role}
                    onChange={(e) => handleField(rec.id, "role", e.target.value)}
                    placeholder="VP of Product"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <Input
                    value={rec.company}
                    onChange={(e) => handleField(rec.id, "company", e.target.value)}
                    placeholder="Stripe"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    Relationship{" "}
                    <span className="text-zinc-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    value={rec.relationship}
                    onChange={(e) =>
                      handleField(rec.id, "relationship", e.target.value)
                    }
                    placeholder="Manager, 2021–2023"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>
                  LinkedIn URL{" "}
                  <span className="text-zinc-400 font-normal">(optional)</span>
                </Label>
                <Input
                  value={rec.linkedin ?? ""}
                  onChange={(e) => handleField(rec.id, "linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/janedoe"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
