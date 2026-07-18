import { ShortlistPageClient } from "@/components/shortlist-page-client";
import { PageMain, PageTitle, SiteNav } from "@/components/site-header";

export default function ShortlistPage() {
  return (
    <>
      <SiteNav />
      <PageMain className="max-w-2xl">
        <PageTitle subtitle="Your saved picks — compare when you're ready." emoji="💜">
          Shortlist
        </PageTitle>
        <ShortlistPageClient />
      </PageMain>
    </>
  );
}
