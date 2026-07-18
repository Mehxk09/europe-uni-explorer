import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";

import { CountryFlag } from "@/components/country-flag";
import { CountryStudyGuide } from "@/components/country-study-guide";
import { ShortlistButton } from "@/components/shortlist-button";
import { PageMain, SiteNav } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getProgramsByUniversityId, getUniversityById } from "@/lib/queries";
import { UniversityPrograms } from "@/components/university-programs";
import { getUniversityDisplay } from "@/lib/uni-display";
import { englishSimple, formatEuro, tuitionSimple } from "@/lib/utils-display";

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const uni = await getUniversityById(decodeURIComponent(id));

  if (!uni) notFound();

  const programList = await getProgramsByUniversityId(uni.id);

  const tuition = tuitionSimple(uni.tuitionTier);
  const english = englishSimple(uni.englishPrograms);
  const display = getUniversityDisplay(uni.name, uni.city);

  return (
    <>
      <SiteNav />
      <PageMain className="max-w-3xl pb-16">
        <Link
          href={`/countries/${uni.countryCode}`}
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to {uni.countryName}
        </Link>

        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {display.englishName}
            </h1>
            {display.translated && (
              <p className="text-sm text-slate-400">{display.originalName}</p>
            )}
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900">
              {display.field.emoji} {display.field.label}
            </p>
            <p className="flex flex-wrap items-center gap-2 text-slate-500">
              <CountryFlag code={uni.countryCode} size="sm" />
              {uni.countryName}
              {uni.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 opacity-60" />
                  {uni.city}
                </span>
              )}
            </p>
          </div>
          <ShortlistButton
            universityId={uni.id}
            name={uni.name}
            countryCode={uni.countryCode}
            countryName={uni.countryName}
            city={uni.city}
            websiteUrl={uni.websiteUrl}
          />
        </header>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Tuition", value: `${tuition.emoji} ${tuition.label}` },
            { label: "Rent", value: `~${formatEuro(uni.avgLivingEur)}/mo` },
            { label: "English", value: english.label },
          ].map((stat) => (
            <div key={stat.label} className="card-soft px-4 py-3">
              <p className="text-xs font-medium uppercase text-slate-500">{stat.label}</p>
              <p className="mt-1 font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {uni.websiteUrl && (
          <Button asChild className="mb-12 h-12 w-full rounded-xl text-base sm:w-auto">
            <a href={uni.websiteUrl} target="_blank" rel="noopener noreferrer">
              Go to official website
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}

        <UniversityPrograms programs={programList} />

        {uni.countryStudentInfo && (
          <section>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              What you need to know
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Country-level guide for {uni.countryName}. Tap to expand each topic.
            </p>
            <CountryStudyGuide
              countryName={uni.countryName}
              countryInfo={uni.countryStudentInfo}
              resourceLinks={uni.resourceLinks}
              visaLink={uni.visaLink ?? null}
            />
          </section>
        )}
      </PageMain>
    </>
  );
}
