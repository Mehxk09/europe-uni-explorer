import { Suspense } from "react";

import { DataTrustBanner } from "@/components/data-trust-banner";
import { FilterPanel } from "@/components/filter-panel";
import { PageMain, PageTitle, SiteNav } from "@/components/site-header";
import { UniversityRow } from "@/components/university-row";
import { getCountriesWithStats, getProgramsByUniversityIds, searchUniversities } from "@/lib/queries";
import type { SearchFilters } from "@/lib/types";
import { STUDY_INTEREST_FILTERS } from "@/lib/uni-display";

const VALID_FIELDS = new Set(STUDY_INTEREST_FILTERS.map((f) => f.id));

function parseFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): SearchFilters {
  const fieldParam = typeof searchParams.field === "string" ? searchParams.field : null;

  return {
    query: typeof searchParams.q === "string" ? searchParams.q : "",
    degree:
      searchParams.degree === "bachelor" || searchParams.degree === "master"
        ? searchParams.degree
        : "both",
    maxTuition:
      searchParams.tuition === "free" ||
      searchParams.tuition === "under2k" ||
      searchParams.tuition === "under10k"
        ? searchParams.tuition
        : "any",
    maxLiving:
      searchParams.living === "under800" ||
      searchParams.living === "800-1200" ||
      searchParams.living === "1200plus"
        ? searchParams.living
        : "any",
    englishRequired: searchParams.english === "1",
    studyField: fieldParam && VALID_FIELDS.has(fieldParam as never) ? fieldParam : null,
    countries:
      typeof searchParams.countries === "string"
        ? searchParams.countries.split(",").filter(Boolean)
        : [],
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const [countries, results] = await Promise.all([
    getCountriesWithStats(),
    searchUniversities(filters),
  ]);

  const visible = results.slice(0, 100);
  const programMap = await getProgramsByUniversityIds(visible.map((u) => u.id));

  const hasActiveFilters =
    filters.query ||
    filters.degree !== "both" ||
    filters.maxTuition !== "any" ||
    filters.maxLiving !== "any" ||
    filters.englishRequired ||
    filters.studyField ||
    filters.countries.length > 0;

  return (
    <>
      <SiteNav />
      <PageMain>
        <PageTitle subtitle="Filter by what matters — no rush." emoji="🔍">
          Search
        </PageTitle>

        <div className="mb-10 space-y-8">
          <Suspense fallback={<div className="panel-card h-48 animate-pulse bg-blue-50/50" />}>
            <FilterPanel countries={countries} initial={filters} />
          </Suspense>
          <DataTrustBanner compact />
        </div>

        <section className="space-y-5">
          <p className="search-count">
            {hasActiveFilters
              ? `${results.length} matches`
              : `${results.length} universities — try filters to narrow down`}
          </p>
          <div className="flex flex-col gap-5">
            {visible.map((u) => (
              <UniversityRow
                key={u.id}
                university={u}
                variant="simple"
                programCount={programMap[u.id]?.length ?? 0}
              />
            ))}
          </div>
          {results.length > 100 && (
            <p className="text-muted text-sm">
              Showing first 100 — add filters to see fewer, more relevant results.
            </p>
          )}
          {results.length === 0 && (
            <p className="text-muted rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
              Nothing matched. Try relaxing a filter or two.
            </p>
          )}
        </section>
      </PageMain>
    </>
  );
}
