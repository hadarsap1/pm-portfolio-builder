"use client";

import React from "react";
import { usePortfolioStore } from "@/lib/store/portfolio-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CertificationItem, EducationItem } from "@/lib/types/portfolio";

export default function Step2Education(): React.JSX.Element {
  const education = usePortfolioStore((s) => s.portfolio.education);
  const certifications = usePortfolioStore((s) => s.portfolio.certifications);
  const addEducation = usePortfolioStore((s) => s.addEducation);
  const updateEducation = usePortfolioStore((s) => s.updateEducation);
  const removeEducation = usePortfolioStore((s) => s.removeEducation);
  const addCertification = usePortfolioStore((s) => s.addCertification);
  const updateCertification = usePortfolioStore((s) => s.updateCertification);
  const removeCertification = usePortfolioStore((s) => s.removeCertification);

  function handleAddEducation(): void {
    addEducation({
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      year: "",
    });
  }

  function handleAddCert(): void {
    addCertification({
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      year: "",
    });
  }

  function handleEduField(id: string, field: keyof EducationItem, value: string): void {
    updateEducation(id, { [field]: value } as Partial<EducationItem>);
  }

  function handleCertField(id: string, field: keyof CertificationItem, value: string): void {
    updateCertification(id, { [field]: value } as Partial<CertificationItem>);
  }

  return (
    <div className="space-y-8 px-6 py-6">
      {/* ── Degrees ─────────────────────────────────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900">Education</h2>
            <p className="text-sm text-zinc-500">Degrees, bootcamps, and programmes.</p>
          </div>
          <Button size="sm" onClick={handleAddEducation}>+ Add Entry</Button>
        </div>

        {education.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">
            No entries yet.
          </div>
        )}

        <div className="space-y-4">
          {education.map((item, i) => (
            <Card key={item.id} size="sm">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Entry {i + 1}</CardTitle>
                  <button
                    onClick={() => removeEducation(item.id)}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label>Institution</Label>
                  <Input
                    value={item.institution}
                    onChange={(e) => handleEduField(item.id, "institution", e.target.value)}
                    placeholder="MIT, Stanford, General Assembly…"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Degree / Credential</Label>
                    <Input
                      value={item.degree}
                      onChange={(e) => handleEduField(item.id, "degree", e.target.value)}
                      placeholder="BS, MBA, Certificate…"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Field of Study</Label>
                    <Input
                      value={item.field}
                      onChange={(e) => handleEduField(item.id, "field", e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Year</Label>
                  <Input
                    value={item.year}
                    onChange={(e) => handleEduField(item.id, "year", e.target.value)}
                    placeholder="2018"
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Certifications ──────────────────────────────────────── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900">Certifications</h2>
            <p className="text-sm text-zinc-500">PMP, CSPO, AWS, Google PM Cert, etc.</p>
          </div>
          <Button size="sm" onClick={handleAddCert}>+ Add Cert</Button>
        </div>

        {certifications.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-200 py-8 text-center text-sm text-zinc-400">
            No certifications yet.
          </div>
        )}

        <div className="space-y-4">
          {certifications.map((cert, i) => (
            <Card key={cert.id} size="sm">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Cert {i + 1}</CardTitle>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label>Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => handleCertField(cert.id, "name", e.target.value)}
                    placeholder="AWS Certified Cloud Practitioner"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Issuing Organisation</Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) => handleCertField(cert.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Year</Label>
                    <Input
                      value={cert.year}
                      onChange={(e) => handleCertField(cert.id, "year", e.target.value)}
                      placeholder="2023"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Credential ID <span className="text-zinc-400 font-normal">(optional)</span></Label>
                  <Input
                    value={cert.credentialId ?? ""}
                    onChange={(e) => handleCertField(cert.id, "credentialId", e.target.value)}
                    placeholder="ABC-123-XYZ"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
