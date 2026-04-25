"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { CertificationItem, EducationItem } from "@/lib/types/portfolio";
import type { AccentConfig } from "@/lib/utils/accent";

interface EducationSectionProps {
  education: EducationItem[];
  certifications?: CertificationItem[];
  accent: AccentConfig;
}

export default function EducationSection({
  education,
  certifications = [],
  accent,
}: EducationSectionProps): React.JSX.Element | null {
  if (education.length === 0 && certifications.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Degrees */}
      {education.length > 0 && (
        <div className="space-y-3">
          {education.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-zinc-900 text-sm">
                  {item.degree && item.field
                    ? `${item.degree}, ${item.field}`
                    : item.degree || item.field || "Degree"}
                </p>
                <p
                  className={cn("text-xs font-medium mt-0.5", accent.heading)}
                  style={accent.customHex ? { color: accent.customHex } : undefined}
                >
                  {item.institution || "Institution"}
                </p>
              </div>
              {item.year && (
                <p className="text-[11px] text-zinc-400 shrink-0 pt-0.5">{item.year}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="space-y-2">
          {education.length > 0 && (
            <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 pt-1">
              Certifications
            </p>
          )}
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-zinc-900">{cert.name || "Certification"}</p>
                <p
                  className={cn("text-[11px] font-medium mt-0.5", accent.heading)}
                  style={accent.customHex ? { color: accent.customHex } : undefined}
                >
                  {cert.issuer || ""}
                  {cert.credentialId ? ` · ${cert.credentialId}` : ""}
                </p>
              </div>
              {cert.year && (
                <p className="text-[11px] text-zinc-400 shrink-0 pt-0.5">{cert.year}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
