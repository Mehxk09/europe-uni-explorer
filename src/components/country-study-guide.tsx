"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

import type { CountryStudentInfo } from "@/lib/country-student-info-types";
import type { OfficialResourceLink } from "@/lib/university-resources";

function GuideSection({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card-soft overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-slate-50"
      >
        <ChevronDown
          className={`mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-slate-900">{title}</span>
          {!open && <span className="mt-1 block text-sm text-slate-500">{summary}</span>}
        </span>
      </button>
      {open && <div className="border-t border-slate-100 px-5 pb-5 pt-2">{children}</div>}
    </div>
  );
}

function LinkList({ links }: { links: OfficialResourceLink[] }) {
  if (!links.length) return null;
  return (
    <ul className="mt-3 space-y-2">
      {links.map((link) => (
        <li key={`${link.url}-${link.label}`}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            {link.label}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

interface CountryStudyGuideProps {
  countryName: string;
  countryInfo: CountryStudentInfo;
  resourceLinks: {
    programmes: OfficialResourceLink[];
    housing: OfficialResourceLink[];
    admissions: OfficialResourceLink[];
  };
  visaLink: string | null;
}

export function CountryStudyGuide({
  countryName,
  countryInfo,
  resourceLinks,
  visaLink,
}: CountryStudyGuideProps) {
  const deadlineSummary = countryInfo.deadlines[0]?.deadline
    ? `Usually around ${countryInfo.deadlines[0].deadline}`
    : "Dates vary by university";

  return (
    <div className="space-y-3">
      <GuideSection title="How to apply" summary={countryInfo.admissionRequirements.slice(0, 100) + "…"}>
        <p className="text-sm leading-relaxed text-slate-600">{countryInfo.admissionRequirements}</p>
        <LinkList links={resourceLinks.admissions} />
      </GuideSection>

      <GuideSection title="When to apply" summary={deadlineSummary}>
        <ul className="space-y-2 text-sm">
          {countryInfo.deadlines.map((d) => (
            <li key={d.intake} className="flex justify-between gap-2 rounded-lg bg-slate-50 px-4 py-2">
              <span className="font-medium text-slate-800">{d.intake}</span>
              <span className="text-blue-700">{d.deadline}</span>
            </li>
          ))}
        </ul>
        <Link href="/deadlines" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
          See all deadlines →
        </Link>
      </GuideSection>

      <GuideSection title="Visa & work" summary={countryInfo.visaWorkRights.slice(0, 80) + "…"}>
        <p className="text-sm leading-relaxed text-slate-600">{countryInfo.visaWorkRights}</p>
        {visaLink && (
          <a
            href={visaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Visa info for {countryName}
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </GuideSection>

      <GuideSection title="Housing" summary={countryInfo.housingNotes.slice(0, 80) + "…"}>
        <p className="text-sm leading-relaxed text-slate-600">{countryInfo.housingNotes}</p>
        <LinkList links={resourceLinks.housing} />
      </GuideSection>

      <GuideSection title="Finding courses" summary="Official programme links">
        <p className="text-sm text-slate-600">Always confirm language and entry rules on the programme page.</p>
        <LinkList links={resourceLinks.programmes} />
      </GuideSection>
    </div>
  );
}
