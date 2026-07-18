import { CountryBrowser } from "@/components/country-browser";
import { HomeHero } from "@/components/home-hero";
import { PageMain, SiteNav } from "@/components/site-header";
import { getCountriesWithStats, getTotalUniversityCount } from "@/lib/queries";

export default async function HomePage() {
  const [countries, totalUnis] = await Promise.all([
    getCountriesWithStats(),
    getTotalUniversityCount(),
  ]);

  const withUnis = countries.filter((c) => c.universityCount > 0);

  return (
    <>
      <SiteNav />
      <PageMain className="flex flex-col gap-8 pb-20 lg:gap-10">
        <HomeHero countryCount={withUnis.length} universityCount={totalUnis} />
        <CountryBrowser countries={withUnis} />
      </PageMain>
    </>
  );
}
