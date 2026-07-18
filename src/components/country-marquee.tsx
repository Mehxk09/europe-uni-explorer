import type { CountryWithStats } from "@/lib/types";

const FEATURED = ["Germany", "Norway", "Netherlands", "Poland", "France", "Italy", "Spain", "Sweden", "Finland", "Czechia"];

export function CountryMarquee({ countries }: { countries: CountryWithStats[] }) {
  const names = FEATURED.map(
    (name) => countries.find((c) => c.name === name)?.name ?? name,
  );
  const row = [...names, ...names];

  return (
    <div className="marquee-wrap" aria-hidden>
      <div className="marquee-track gap-12 px-6">
        {row.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="whitespace-nowrap font-serif text-2xl font-medium tracking-tight text-stone-400 sm:text-3xl"
          >
            {name}
            <span className="mx-8 text-stone-300">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
