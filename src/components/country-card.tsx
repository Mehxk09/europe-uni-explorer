"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { CountryFlag } from "@/components/country-flag";
import type { CountryWithStats } from "@/lib/types";
import { englishSimple, formatEuro, tuitionSimple } from "@/lib/utils-display";

export function CountryCard({ country }: { country: CountryWithStats }) {
  const tuition = tuitionSimple(country.tuitionTier);
  const english = englishSimple(country.englishPrograms);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <Link href={`/countries/${country.code}`} className="card card-hover group flex h-full flex-col p-6">
        <div className="flex items-start justify-between">
          <div className="flag-wrap">
            <CountryFlag code={country.code} size="md" />
          </div>
          <ArrowUpRight className="h-5 w-5 text-blue-300 transition group-hover:text-blue-500" />
        </div>

        <div className="mt-5 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-heading text-xl font-medium tracking-tight">{country.name}</h3>
            <span className="text-muted shrink-0 text-sm">{country.universityCount} unis</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">{tuition.label} tuition</span>
            <span className="chip">{formatEuro(country.avgLivingEur)}/mo</span>
            <span className="chip">{english.label}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
