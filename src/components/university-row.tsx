"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { ShortlistButton } from "@/components/shortlist-button";
import { CountryFlag } from "@/components/country-flag";
import { formatCostRange, estimateAnnualCost } from "@/lib/cost-estimate";
import type { UniFieldCategory } from "@/lib/uni-display";
import type { UniversityWithCountry } from "@/lib/types";
import { getUniversityDisplay } from "@/lib/uni-display";
import { englishSimple, formatEuro, tuitionSimple } from "@/lib/utils-display";

const FIELD_STYLE: Record<UniFieldCategory, string> = {
  "music-performing": "field-icon field-icon-purple",
  "arts-design": "field-icon field-icon-pink",
  "medical-health": "field-icon field-icon-rose",
  technical: "field-icon field-icon-blue",
  business: "field-icon field-icon-amber",
  education: "field-icon field-icon-green",
  law: "field-icon field-icon-slate",
  agriculture: "field-icon field-icon-lime",
  theology: "field-icon field-icon-violet",
  sports: "field-icon field-icon-orange",
  "applied-sciences": "field-icon field-icon-cyan",
  general: "field-icon field-icon-neutral",
  specialist: "field-icon field-icon-indigo",
};

export function UniversityRow({
  university,
  variant = "full",
  programCount = 0,
}: {
  university: UniversityWithCountry & { countryName: string };
  variant?: "full" | "simple";
  programCount?: number;
}) {
  const display = getUniversityDisplay(university.name, university.city);
  const english = englishSimple(university.englishPrograms);
  const tuition = tuitionSimple(university.tuitionTier);
  const annualCost = estimateAnnualCost(university.avgLivingEur, university.tuitionTier);
  const fieldClass = FIELD_STYLE[display.field.category];
  const detailHref = `/universities/${university.id}`;

  if (variant === "simple") {
    return (
      <article className="uni-card uni-card-loose group">
        <div className="flex items-start gap-5">
          <div className={fieldClass} aria-hidden>
            <span className="text-2xl">{display.field.emoji}</span>
          </div>

          <div className="min-w-0 flex-1">
            <Link
              href={detailHref}
              className="line-clamp-2 text-lg font-semibold leading-relaxed text-[var(--text-heading)] transition hover:text-[var(--accent-text)]"
            >
              {display.englishName}
            </Link>
            {display.translated && (
              <p className="text-muted mt-2 line-clamp-1 text-sm">{display.originalName}</p>
            )}
          </div>

          <Link href={detailHref} className="uni-card-arrow shrink-0" aria-label="View details">
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 pl-[4.25rem]">
          <span className="chip chip-field">{display.field.label}</span>
          {programCount > 0 && (
            <span className="chip chip-english">
              {programCount} {programCount === 1 ? "programme" : "programmes"}
            </span>
          )}
          {university.city && (
            <span className="chip">
              <MapPin className="mr-0.5 inline h-3 w-3" />
              {university.city}
            </span>
          )}
          <span className="chip chip-tuition">
            ~{formatCostRange(annualCost.totalLow, annualCost.totalHigh)}/yr
          </span>
          <span className="chip chip-english">{english.label}</span>
        </div>

        <div className="mt-5 flex justify-end border-t border-[var(--border-soft)] pt-4 pl-[4.25rem]">
          <ShortlistButton
            universityId={university.id}
            name={university.name}
            countryCode={university.countryCode}
            countryName={university.countryName}
            city={university.city}
            websiteUrl={university.websiteUrl}
            size="sm"
          />
        </div>
      </article>
    );
  }

  return (
    <article className="uni-card-row uni-card-static">
      <div className={fieldClass} aria-hidden>
        <span className="text-2xl">{display.field.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <Link href={detailHref}>
          <span className="text-heading text-lg font-semibold">{display.englishName}</span>
        </Link>
        <p className="text-muted mt-2 flex flex-wrap items-center gap-2 text-sm">
          <CountryFlag code={university.countryCode} size="sm" />
          {university.countryName}
          {university.city && <> · {university.city}</>}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="chip chip-field">{display.field.label}</span>
          <span className="chip">{tuition.label}</span>
          <span className="chip">{formatEuro(university.avgLivingEur)}/mo</span>
          <span className="chip chip-english">{english.label}</span>
        </div>
      </div>
      <ShortlistButton
        universityId={university.id}
        name={university.name}
        countryCode={university.countryCode}
        countryName={university.countryName}
        city={university.city}
        websiteUrl={university.websiteUrl}
        size="sm"
      />
    </article>
  );
}
