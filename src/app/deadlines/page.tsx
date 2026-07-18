import Link from "next/link";

import { CountryFlag } from "@/components/country-flag";
import { PageMain, PageTitle, SiteNav } from "@/components/site-header";
import { getCountriesWithStats, getCountryStudentInfoForCode } from "@/lib/queries";

export default async function DeadlinesPage() {
  const countries = await getCountriesWithStats();
  const withInfo = countries
    .filter((c) => c.universityCount > 0)
    .map((c) => ({
      ...c,
      studentInfo: getCountryStudentInfoForCode(c.code),
    }))
    .filter((c) => c.studentInfo?.deadlines.length);

  return (
    <>
      <SiteNav />
      <PageMain>
        <PageTitle
          emoji="📅"
          subtitle="Typical application windows by country. Always confirm on the university website."
        >
          Deadline calendar
        </PageTitle>

        <div className="space-y-6">
          {withInfo.map((country) => (
            <section
              key={country.code}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-stone-50 px-5 py-4">
                <Link
                  href={`/countries/${country.code}`}
                  className="flex items-center gap-2 font-semibold text-stone-800 hover:text-violet-600"
                >
                  <CountryFlag code={country.code} size="md" />
                  {country.name}
                </Link>
                <Link
                  href={`/countries/${country.code}`}
                  className="text-sm text-violet-600 hover:underline"
                >
                  Browse universities →
                </Link>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-stone-500">
                    <th className="px-5 py-2 font-medium">Intake</th>
                    <th className="px-5 py-2 font-medium">Typical deadline</th>
                    <th className="hidden px-5 py-2 font-medium md:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {country.studentInfo!.deadlines.map((d) => (
                    <tr key={d.intake} className="border-b border-stone-50 last:border-0">
                      <td className="px-5 py-3 font-medium text-stone-800">{d.intake}</td>
                      <td className="px-5 py-3 text-violet-700">{d.deadline}</td>
                      <td className="hidden px-5 py-3 text-stone-500 md:table-cell">
                        {d.note ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      </PageMain>
    </>
  );
}
