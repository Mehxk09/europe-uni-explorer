"use client";

import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  GraduationCap,
  Home,
  MapPin,
  Sparkles,
  Wallet,
} from "lucide-react";

import { CountryFlag } from "@/components/country-flag";
import { estimateAnnualCost, formatCostRange } from "@/lib/cost-estimate";
import { scoreUniversity } from "@/lib/fit-score";
import type { CountryStudentInfo } from "@/lib/country-student-info-types";
import { getUniversityDisplay } from "@/lib/uni-display";
import type { ProgramRecord, TuitionTier } from "@/lib/types";
import {
  englishLabel,
  formatEuro,
  portalSearchUrl,
  tuitionLabel,
} from "@/lib/utils-display";
import { useWizardPrefs } from "@/hooks/use-wizard-prefs";

export interface CompareUniversity {
  id: string;
  name: string;
  countryName: string;
  countryCode: string;
  city: string | null;
  websiteUrl: string | null;
  tuitionTier: TuitionTier;
  tuitionIntl: string | null;
  englishPrograms: string;
  avgLivingEur: number;
  officialPortal: string | null;
  visaLink: string | null;
  bachelorsPortalUrl: string | null;
  mastersPortalUrl: string | null;
  deadlineNotes: string | null;
  programs: ProgramRecord[];
  countryStudentInfo: CountryStudentInfo | null;
}

function FitBadge({ percent, label }: { percent: number; label: string }) {
  const tone =
    percent >= 70 ? "compare-fit-strong" : percent >= 45 ? "compare-fit-good" : "compare-fit-stretch";

  return (
    <span className={`compare-fit-badge ${tone}`}>
      <Sparkles className="h-3.5 w-3.5" />
      {label} · {percent}%
    </span>
  );
}

function CompareCard({ university }: { university: CompareUniversity }) {
  const prefs = useWizardPrefs();
  const display = getUniversityDisplay(university.name, university.city);
  const cost = estimateAnnualCost(university.avgLivingEur, university.tuitionTier);
  const fit = scoreUniversity(
    {
      tuitionTier: university.tuitionTier,
      englishPrograms: university.englishPrograms as "common",
      avgLivingEur: university.avgLivingEur,
      countryCode: university.countryCode,
    },
    prefs,
  );
  const nextDeadline = university.countryStudentInfo?.deadlines[0];
  const englishPrograms = university.programs.filter((p) => p.language === "en");

  return (
    <article className="compare-card">
      <div className="compare-card-header">
        <div className="flex items-start gap-3">
          <CountryFlag code={university.countryCode} size="lg" />
          <div className="min-w-0 flex-1">
            <Link
              href={`/universities/${university.id}`}
              className="compare-uni-name line-clamp-3 hover:text-[var(--accent-text)]"
            >
              {display.englishName}
            </Link>
            <p className="compare-uni-meta mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {university.city ?? "—"}, {university.countryName}
              </span>
            </p>
          </div>
        </div>
        <FitBadge percent={fit.percent} label={fit.label} />
      </div>

      <div className="compare-cost-block">
        <p className="compare-cost-label">
          <Wallet className="h-4 w-4" />
          Est. total per year
        </p>
        <p className="compare-cost-value">
          {formatCostRange(cost.totalLow, cost.totalHigh)}
        </p>
        <p className="compare-cost-breakdown">
          Living {formatEuro(university.avgLivingEur)}/mo · Tuition {cost.tuitionLabel}
        </p>
      </div>

      <dl className="compare-stats">
        <div className="compare-stat-row">
          <dt>Tuition tier</dt>
          <dd>{tuitionLabel(university.tuitionTier)}</dd>
        </div>
        <div className="compare-stat-row">
          <dt>Intl fees</dt>
          <dd className="text-sm leading-snug">{university.tuitionIntl ?? "—"}</dd>
        </div>
        <div className="compare-stat-row">
          <dt>English</dt>
          <dd>{englishLabel(university.englishPrograms as "common")}</dd>
        </div>
        {nextDeadline && (
          <div className="compare-stat-row">
            <dt>
              <Calendar className="mr-1 inline h-3.5 w-3.5" />
              Next deadline
            </dt>
            <dd>
              <span className="font-medium">{nextDeadline.deadline}</span>
              <span className="text-muted block text-xs">{nextDeadline.intake}</span>
            </dd>
          </div>
        )}
      </dl>

      {englishPrograms.length > 0 ? (
        <div className="compare-programs">
          <p className="compare-section-title">
            <GraduationCap className="h-4 w-4" />
            Curated programmes ({englishPrograms.length})
          </p>
          <ul className="space-y-2">
            {englishPrograms.slice(0, 4).map((p) => (
              <li key={p.id} className="compare-program-item">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.name}
                  </a>
                ) : (
                  <span>{p.name}</span>
                )}
                <span className="compare-program-meta">
                  {p.degreeLevel} · {p.language.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
          {englishPrograms.length > 4 && (
            <Link href={`/universities/${university.id}`} className="compare-more-link">
              +{englishPrograms.length - 4} more on profile
            </Link>
          )}
        </div>
      ) : (
        <div className="compare-programs compare-programs-empty">
          <p className="compare-section-title">
            <GraduationCap className="h-4 w-4" />
            Programmes
          </p>
          <p className="text-muted text-sm">
            No curated programmes yet — search external catalogues below.
          </p>
        </div>
      )}

      {university.countryStudentInfo?.visaWorkRights && (
        <p className="compare-visa-note line-clamp-3">
          <Home className="mr-1 inline h-3.5 w-3.5 shrink-0" />
          {university.countryStudentInfo.visaWorkRights.split(".")[0]}.
        </p>
      )}

      <div className="compare-actions">
        {university.websiteUrl && (
          <a
            href={university.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-fill compare-action-primary"
          >
            Official site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        <a
          href={portalSearchUrl(university.name, "bachelor", university.bachelorsPortalUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-sm"
        >
          Bachelor search
        </a>
        <a
          href={portalSearchUrl(university.name, "master", university.mastersPortalUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-sm"
        >
          Master search
        </a>
      </div>
    </article>
  );
}

function CompareHighlights({ universities }: { universities: CompareUniversity[] }) {
  if (universities.length < 2) return null;

  const withCost = universities.map((u) => ({
    u,
    cost: estimateAnnualCost(u.avgLivingEur, u.tuitionTier).totalMid,
  }));
  const cheapest = [...withCost].sort((a, b) => a.cost - b.cost)[0];
  const bestEnglish = [...universities].sort((a, b) => {
    const order = { common: 0, growing: 1, limited: 2, rare: 3 };
    return (
      (order[a.englishPrograms as keyof typeof order] ?? 9) -
      (order[b.englishPrograms as keyof typeof order] ?? 9)
    );
  })[0];

  return (
    <div className="compare-highlights">
      <span className="compare-highlight-pill">
        💰 Lowest est. cost:{" "}
        <strong>{getUniversityDisplay(cheapest.u.name, cheapest.u.city).englishName.split(",")[0]}</strong>
      </span>
      <span className="compare-highlight-pill">
        🗣️ Best English offer:{" "}
        <strong>{getUniversityDisplay(bestEnglish.name, bestEnglish.city).englishName.split(",")[0]}</strong>
      </span>
    </div>
  );
}

export function CompareTable({ universities }: { universities: CompareUniversity[] }) {
  return (
    <div className="compare-layout space-y-6">
      <CompareHighlights universities={universities} />
      <div className="compare-grid">
        {universities.map((u) => (
          <CompareCard key={u.id} university={u} />
        ))}
      </div>
    </div>
  );
}
