import Link from "next/link";
import { GraduationCap } from "lucide-react";

import type { CountryWithStats } from "@/lib/types";

interface HomeStatsProps {
  countries: CountryWithStats[];
  totalUnis: number;
}

export function HomeStats({ countries, totalUnis }: HomeStatsProps) {
  const freeCount = countries.filter((c) => c.tuitionTier === "free").length;
  const englishCount = countries.filter(
    (c) => c.englishPrograms === "common" || c.englishPrograms === "growing",
  ).length;

  const stats = [
    { value: countries.length, label: "Countries", color: "stat-card-purple" },
    { value: totalUnis.toLocaleString(), label: "Universities", color: "stat-card-blue" },
    { value: freeCount, label: "Free tuition", color: "stat-card-green" },
    { value: englishCount, label: "English-friendly", color: "stat-card-orange" },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map((s) => (
        <div key={s.label} className={`stat-card ${s.color}`}>
          <p className="stat-value">{s.value}</p>
          <p className="stat-label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function HomeActions() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link href="/search" className="btn-primary">
        <GraduationCap className="h-4 w-4" />
        Search all
      </Link>
      <Link href="/wizard" className="btn-secondary">
        Help me choose
      </Link>
      <Link href="/compare" className="btn-secondary">
        Compare saved
      </Link>
    </div>
  );
}
