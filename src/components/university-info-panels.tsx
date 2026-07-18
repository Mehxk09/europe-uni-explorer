import Link from "next/link";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  FileCheck,
  Home,
  Plane,
} from "lucide-react";

import type { CountryStudentInfo } from "@/lib/country-student-info-types";
import type { OfficialResourceLink } from "@/lib/university-resources";

function LinkList({
  links,
  empty,
}: {
  links: OfficialResourceLink[];
  empty: string;
}) {
  if (links.length === 0) {
    return <p className="text-sm text-stone-500">{empty}</p>;
  }
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={`${link.url}-${link.label}`}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm transition hover:border-violet-200 hover:bg-violet-50/50"
          >
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
            <span>
              <span className="font-medium text-stone-800">{link.label}</span>
              {link.note && (
                <span className="mt-0.5 block text-xs text-stone-500">{link.note}</span>
              )}
              <span className="mt-0.5 block text-xs text-violet-600">
                {link.source === "university"
                  ? "Official university website"
                  : link.source === "country"
                    ? "Official country portal"
                    : "External directory"}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function InfoSection({
  icon: Icon,
  title,
  emoji,
  children,
}: {
  icon: typeof Home;
  title: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg">
          {emoji}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-stone-800">{title}</h2>
          <Icon className="hidden" />
        </div>
      </div>
      {children}
    </section>
  );
}

interface UniversityInfoPanelsProps {
  countryInfo: CountryStudentInfo | null;
  resourceLinks: {
    programmes: OfficialResourceLink[];
    housing: OfficialResourceLink[];
    admissions: OfficialResourceLink[];
  };
  visaLink: string | null;
  city: string | null;
  avgLivingEur: number;
  countryCode: string;
}

export function UniversityInfoPanels({
  countryInfo,
  resourceLinks,
  visaLink,
  city,
  avgLivingEur,
  countryCode,
}: UniversityInfoPanelsProps) {
  return (
    <div className="space-y-6">
      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Country-level info below is a starting guide. Programmes, dorms, and exact
        deadlines are always on the{" "}
        <strong>official university website</strong> — use the links to find them.
      </p>

      <InfoSection icon={BookOpen} title="Courses & programmes" emoji="📚">
        {countryInfo && (
          <p className="mb-4 text-sm leading-relaxed text-stone-600">
            English availability varies by programme. Use the official site or portals
            below, then confirm language and entry requirements on the programme page.
          </p>
        )}
        <LinkList
          links={resourceLinks.programmes}
          empty="No website on file — search the university name online."
        />
      </InfoSection>

      <InfoSection icon={Home} title="Housing & dorms" emoji="🏠">
        {countryInfo && (
          <p className="mb-4 text-sm leading-relaxed text-stone-600">
            {countryInfo.housingNotes}
            {city && (
              <>
                {" "}
                Estimated living in {city}: ~€{avgLivingEur}/month (country average).
              </>
            )}
          </p>
        )}
        <LinkList
          links={resourceLinks.housing}
          empty="Check the university website for accommodation office."
        />
      </InfoSection>

      <InfoSection icon={FileCheck} title="Admission requirements" emoji="📋">
        {countryInfo ? (
          <p className="mb-4 text-sm leading-relaxed text-stone-600">
            {countryInfo.admissionRequirements}
          </p>
        ) : (
          <p className="mb-4 text-sm text-stone-500">
            Requirements vary by programme — check the international admissions page.
          </p>
        )}
        <LinkList
          links={resourceLinks.admissions}
          empty="Visit the official university website admissions section."
        />
      </InfoSection>

      <InfoSection icon={Calendar} title="Application deadlines" emoji="📅">
        {countryInfo && countryInfo.deadlines.length > 0 ? (
          <div className="mb-4 overflow-hidden rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left text-stone-600">
                  <th className="px-4 py-2 font-medium">Intake</th>
                  <th className="px-4 py-2 font-medium">Typical deadline</th>
                  <th className="hidden px-4 py-2 font-medium sm:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {countryInfo.deadlines.map((d) => (
                  <tr key={d.intake} className="border-t border-stone-100">
                    <td className="px-4 py-2.5 font-medium text-stone-800">{d.intake}</td>
                    <td className="px-4 py-2.5 text-violet-700">{d.deadline}</td>
                    <td className="hidden px-4 py-2.5 text-stone-500 sm:table-cell">
                      {d.note ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mb-4 text-sm text-stone-500">Check the university admissions page for exact dates.</p>
        )}
        <Link
          href="/deadlines"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          See all country deadlines →
        </Link>
      </InfoSection>

      <InfoSection icon={Plane} title="Visa & work while studying" emoji="🛂">
        {countryInfo && (
          <p className="mb-4 text-sm leading-relaxed text-stone-600">
            {countryInfo.visaWorkRights}
          </p>
        )}
        {visaLink && (
          <a
            href={visaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            Official visa info ({countryCode})
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </InfoSection>
    </div>
  );
}
