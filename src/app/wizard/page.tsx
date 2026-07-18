import { PageMain, PageTitle, SiteNav } from "@/components/site-header";
import { WizardFlow } from "@/components/wizard-flow";
import { getCountriesWithStats } from "@/lib/queries";

export default async function WizardPage() {
  const countries = await getCountriesWithStats();

  return (
    <>
      <SiteNav />
      <PageMain className="max-w-2xl">
        <PageTitle subtitle="Five questions, zero pressure." emoji="✨">
          Guide me
        </PageTitle>
        <WizardFlow countries={countries.filter((c) => c.universityCount > 0)} />
      </PageMain>
    </>
  );
}
