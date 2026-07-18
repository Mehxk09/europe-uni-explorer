import Link from "next/link";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

import { PageMain, PageTitle, SiteNav } from "@/components/site-header";

const verified = [
  "University / institution names",
  "Country each institution is in",
  "City (when listed in the registry)",
  "That the institution participates in European higher-ed programmes",
];

const estimates = [
  "Tuition fees (vary by programme, nationality, and year)",
  "Average monthly living costs (your lifestyle changes this a lot)",
  "How common English-taught programmes are (country-level, not per uni)",
  "Application deadlines (always differ by university and programme)",
  "Website links (we guess https://domain when the API has none)",
];

const caveats = [
  "The list includes universities AND colleges/polytechnics — not every entry is a classic “uni”.",
  "Some countries (France, Spain) have very long lists because many types of schools are included.",
  "Programme-level info (e.g. “CS Master in English”) is NOT in this app — use the linked portals.",
  "Fees for non-EU students change often — Germany, Finland, and others have updated rules recently.",
];

export default function AboutDataPage() {
  return (
    <>
      <SiteNav />
      <PageMain>
        <PageTitle subtitle="Honest answer: partly verified, partly estimates. Here's the split.">
          Is this information valid?
        </PageTitle>

        <div className="space-y-8">
          <section className="card-soft space-y-4 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-slate-800">
                Verified (from official sources)
              </h2>
            </div>
            <ul className="space-y-2 pl-1">
              {verified.map((item) => (
                <li key={item} className="flex gap-2 text-stone-600">
                  <span className="text-emerald-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-stone-500">
              Source:{" "}
              <a
                href="https://hei.api.uni-foundation.eu/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-700 underline"
              >
                HEI API
              </a>{" "}
              — European University Foundation registry used for Erasmus+ and mobility.
            </p>
          </section>

          <section className="card-soft space-y-4 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-amber-700">
              <HelpCircle className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-slate-800">
                Estimates (use as a starting point only)
              </h2>
            </div>
            <ul className="space-y-2 pl-1">
              {estimates.map((item) => (
                <li key={item} className="flex gap-2 text-stone-600">
                  <span className="text-amber-500">~</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-stone-500">
              These live in our curated country notes. They&apos;re based on public info
              (DAAD, Study in Norway, etc.) but simplified so you can compare quickly.
            </p>
          </section>

          <section className="card-soft space-y-4 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-rose-700">
              <XCircle className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-slate-800">
                Things to watch out for
              </h2>
            </div>
            <ul className="space-y-2 pl-1">
              {caveats.map((item) => (
                <li key={item} className="flex gap-2 text-stone-600">
                  <span className="text-rose-400">!</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <p className="text-center text-sm text-stone-500">
            Bottom line: use this site to <strong className="text-stone-700">discover and compare</strong>,
            then confirm everything on the official university website before you apply.
          </p>

          <div className="text-center">
            <Link
              href="/search"
              className="inline-flex rounded-full bg-violet-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-violet-600"
            >
              Back to exploring
            </Link>
          </div>
        </div>
      </PageMain>
    </>
  );
}
