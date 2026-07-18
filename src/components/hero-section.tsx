import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  countryCount: number;
  universityCount: number;
}

export function HeroSection({ countryCount, universityCount }: HeroSectionProps) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/80 to-slate-50">
      <div className="mx-auto max-w-[960px] px-5 py-16 sm:px-6 sm:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Find a university in Europe
        </h1>
        <p className="mt-3 max-w-lg text-base text-slate-600 sm:text-lg">
          Browse by country, see what each school is for, save your favourites.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/countries/DE" className="btn-primary">
            Browse Germany
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/wizard" className="btn-secondary">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Help me choose
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          {countryCount} countries · {universityCount.toLocaleString()} universities
        </p>
      </div>
    </section>
  );
}
