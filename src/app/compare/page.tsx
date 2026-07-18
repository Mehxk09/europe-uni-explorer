import Link from "next/link";

import { CompareTable } from "@/components/compare-table";
import { PageMain, PageTitle, SiteNav } from "@/components/site-header";
import { getUniversitiesByIds } from "@/lib/queries";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const params = await searchParams;
  const ids = params.ids?.split(",").filter(Boolean).slice(0, 4) ?? [];
  const universities = ids.length > 0 ? await getUniversitiesByIds(ids) : [];

  return (
    <>
      <SiteNav />
      <PageMain>
        <PageTitle subtitle="Side-by-side costs, deadlines, programmes, and fit scores.">
          Compare
        </PageTitle>
        {universities.length === 0 ? (
          <div className="panel-card border-dashed py-16 text-center">
            <p className="text-lg text-[var(--text-heading)]">Save some universities first</p>
            <p className="text-muted mt-2 text-sm">
              Tap ♥ on any university, then compare up to four options here.
            </p>
            <Link href="/shortlist" className="btn btn-fill mt-6 inline-flex">
              Go to shortlist
            </Link>
          </div>
        ) : (
          <CompareTable universities={universities} />
        )}
      </PageMain>
    </>
  );
}
