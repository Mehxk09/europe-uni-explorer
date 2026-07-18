import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { CountryFlag } from "@/components/country-flag";
import { CountryStudyGuide } from "@/components/country-study-guide";
import { CountryUniversityList } from "@/components/country-university-list";
import { PageMain, SiteNav } from "@/components/site-header";
import {
  getCountryByCode,
  getCountryStudentInfoForCode,
  getProgramCountsByCountry,
  getProgramFieldsByCountry,
  getUniversitiesByCountry,
} from "@/lib/queries";
import { getUniversityResourceLinks } from "@/lib/university-resources";
import type { UniversityWithCountry } from "@/lib/types";
import { englishSimple, formatEuro, tuitionSimple } from "@/lib/utils-display";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = await getCountryByCode(code);

  if (!country || country.universityCount === 0) {
    notFound();
  }

  const rows = await getUniversitiesByCountry(code);
  const programFieldsByUni = await getProgramFieldsByCountry(code);
  const programCountsByUni = await getProgramCountsByCountry(code);
  const countryStudentInfo = getCountryStudentInfoForCode(code);
  const resourceLinks = getUniversityResourceLinks(
    null,
    country.name,
    code,
    countryStudentInfo,
    {
      bachelors: country.bachelorsPortalUrl,
      masters: country.mastersPortalUrl,
      official: country.officialPortal,
    },
  );
  const universities: UniversityWithCountry[] = rows.map((u) => ({
    ...u,
    countryName: country.name,
    tuitionTier: country.tuitionTier,
    tuitionIntl: country.tuitionIntl,
    englishPrograms: country.englishPrograms,
    avgLivingEur: country.avgLivingEur,
    officialPortal: country.officialPortal ?? null,
    bachelorsPortalUrl: country.bachelorsPortalUrl ?? null,
    mastersPortalUrl: country.mastersPortalUrl ?? null,
  }));

  const tuition = tuitionSimple(country.tuitionTier);
  const english = englishSimple(country.englishPrograms);

  return (
    <>
      <SiteNav />
      <PageMain className="flex flex-col gap-8 pb-20 lg:gap-10">
        <Link
          href="/"
          className="text-muted inline-flex w-fit items-center gap-2 text-sm transition hover:text-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          All countries
        </Link>

        <div className="panel-card panel-card-hero">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
            <CountryFlag code={country.code} size="xl" />
            <div className="flex-1">
              <h1 className="text-heading text-3xl font-semibold tracking-tight lg:text-4xl">
                {country.name}
              </h1>
              <p className="text-muted mt-2 text-lg">
                {country.universityCount} universities
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="chip">{tuition.label} tuition</span>
                <span className="chip">~{formatEuro(country.avgLivingEur)}/mo living</span>
                <span className="chip">{english.label}</span>
              </div>
              {country.tuitionIntl && (
                <p className="text-muted mt-4 max-w-2xl text-sm leading-relaxed">
                  {country.tuitionIntl}
                </p>
              )}
            </div>
          </div>
        </div>

        <CountryUniversityList
          universities={universities}
          countryName={country.name}
          programFieldsByUni={programFieldsByUni}
          programCountsByUni={programCountsByUni}
        />

        {countryStudentInfo && (
          <div className="panel-card">
            <div className="section-head">
              <h2>Before you apply</h2>
              <p>Tap a topic to read more</p>
            </div>
            <CountryStudyGuide
              countryName={country.name}
              countryInfo={countryStudentInfo}
              resourceLinks={resourceLinks}
              visaLink={country.visaLink ?? null}
            />
          </div>
        )}

        {(country.officialPortal || country.visaLink) && (
          <div className="flex flex-wrap gap-3">
            {country.officialPortal && (
              <a
                href={country.officialPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Study portal
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {country.visaLink && (
              <a
                href={country.visaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Visa info
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </PageMain>
    </>
  );
}
