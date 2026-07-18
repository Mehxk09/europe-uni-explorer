"use client";

import Link from "next/link";
import { Calendar, CheckCircle2, Circle } from "lucide-react";

import { useShortlist } from "@/hooks/use-shortlist";
import countryStudentInfo from "../../data/country-student-info.json";
import curatedCountries from "../../data/curated-countries.json";
import type { CountryStudentInfo } from "@/lib/country-student-info-types";
import type { CuratedCountry } from "@/lib/types";

const infoMap = countryStudentInfo as Record<string, CountryStudentInfo>;
const countryMap = new Map(
  (curatedCountries as CuratedCountry[]).map((c) => [c.code, c]),
);

const CHECKLIST_STEPS = [
  "Check admission requirements for each country",
  "Confirm English language requirements (IELTS/TOEFL)",
  "Gather transcripts and diplomas (certified copies)",
  "Write motivation letter / CV if required",
  "Apply before country deadline",
  "Apply for student visa after admission",
  "Arrange housing (student dorms fill up fast)",
];

export function ApplicationChecklist() {
  const { items } = useShortlist();

  if (items.length === 0) return null;

  const countries = [...new Set(items.map((i) => i.countryCode))];

  return (
    <div className="panel-card space-y-6">
      <div>
        <h2 className="text-heading text-lg font-semibold">Application checklist</h2>
        <p className="text-muted mt-1 text-sm">
          Based on your saved universities — verify dates on official sites
        </p>
      </div>

      <ul className="space-y-2">
        {CHECKLIST_STEPS.map((step) => (
          <li key={step} className="flex items-start gap-2 text-sm text-[var(--text-heading)]">
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-text)] opacity-60" />
            {step}
          </li>
        ))}
      </ul>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-heading)]">Deadlines by country</h3>
        {countries.map((code) => {
          const info = infoMap[code];
          const country = countryMap.get(code);
          const name = country?.name ?? code;

          return (
            <div
              key={code}
              className="rounded-2xl border border-[var(--border-soft)] bg-[var(--card-inner)] p-4"
            >
              <p className="font-medium text-[var(--text-heading)]">{name}</p>
              {info?.deadlines?.length ? (
                <ul className="mt-2 space-y-2">
                  {info.deadlines.map((d) => (
                    <li key={`${d.intake}-${d.deadline}`} className="flex gap-2 text-sm">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                      <span>
                        <strong>{d.deadline}</strong> — {d.intake}
                        {d.note && (
                          <span className="text-muted block text-xs">{d.note}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mt-1 text-sm">Check official portal for dates</p>
              )}
              {country?.officialPortal && (
                <Link
                  href={country.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-[var(--accent-text)] hover:underline"
                >
                  Official study portal →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-muted flex items-center gap-2 text-xs">
        <CheckCircle2 className="h-4 w-4" />
        Complete the{" "}
        <Link href="/wizard" className="text-[var(--accent-text)] hover:underline">
          Guide
        </Link>{" "}
        to improve fit scores on Compare
      </p>
    </div>
  );
}
