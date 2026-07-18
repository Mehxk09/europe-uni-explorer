"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { UniversityRow } from "@/components/university-row";
import type { UniversityWithCountry } from "@/lib/types";
import {
  matchesStudyInterest,
  STUDY_INTEREST_FILTERS,
  type StudyInterestId,
} from "@/lib/uni-display";

type ActiveFilter = "all" | StudyInterestId;

export function CountryUniversityList({
  universities,
  countryName,
  programFieldsByUni = {},
  programCountsByUni = {},
}: {
  universities: UniversityWithCountry[];
  countryName: string;
  programFieldsByUni?: Record<string, StudyInterestId[]>;
  programCountsByUni?: Record<string, number>;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ActiveFilter>("all");

  const trackedCount = Object.keys(programFieldsByUni).length;

  const filtered = useMemo(() => {
    let list = universities;
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || (u.city?.toLowerCase().includes(q) ?? false),
      );
    }
    if (filter !== "all") {
      list = list.filter((u) => {
        const fields = programFieldsByUni[u.id];
        if (fields?.includes(filter)) return true;
        return matchesStudyInterest(u.name, filter);
      });
    }
    return list;
  }, [universities, search, filter, programFieldsByUni]);

  return (
    <div className="panel-card">
      <div className="section-head flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2>Universities in {countryName}</h2>
          <p>
            {filtered.length} of {universities.length} — tap a card to see details
            {trackedCount > 0 && (
              <> · {trackedCount} with curated IT/AI programmes</>
            )}
          </p>
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-search"
          />
        </div>
      </div>

      <div className="mb-3">
        <p className="text-muted text-sm">
          Filter by study field — uses real programme data where available
        </p>
      </div>
      <div className="filter-bar filter-bar-scroll mb-8 flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`filter-pill shrink-0 ${filter === "all" ? "filter-pill-on" : ""}`}
        >
          All
        </button>
        {STUDY_INTEREST_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`filter-pill shrink-0 ${filter === f.id ? "filter-pill-on" : ""}`}
          >
            <span aria-hidden>{f.emoji}</span> {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {filtered.map((u) => (
          <UniversityRow
            key={u.id}
            university={u}
            variant="simple"
            programCount={programCountsByUni[u.id] ?? 0}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted py-16 text-center">
          No matches for this field — try another filter or search.
        </p>
      )}
    </div>
  );
}
