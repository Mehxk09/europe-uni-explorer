"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CountryWithStats, SearchFilters } from "@/lib/types";
import { STUDY_INTEREST_FILTERS, type StudyInterestId } from "@/lib/uni-display";

const DEGREE_LABELS: Record<SearchFilters["degree"], string> = {
  both: "Bachelor & Master",
  bachelor: "Bachelor only",
  master: "Master only",
};

const TUITION_LABELS: Record<SearchFilters["maxTuition"], string> = {
  any: "Any",
  free: "Free only",
  under2k: "Under ~€2k/year",
  under10k: "Under ~€10k/year",
};

const LIVING_LABELS: Record<SearchFilters["maxLiving"], string> = {
  any: "Any",
  under800: "Under €800/mo",
  "800-1200": "Up to €1,200/mo",
  "1200plus": "€1,200+/mo OK",
};

interface FilterPanelProps {
  countries: CountryWithStats[];
  initial: SearchFilters;
}

export function FilterPanel({ countries, initial }: FilterPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (patch: Partial<SearchFilters>) => {
      const next = { ...initial, ...patch };
      const params = new URLSearchParams();
      if (next.query) params.set("q", next.query);
      if (next.degree !== "both") params.set("degree", next.degree);
      if (next.maxTuition !== "any") params.set("tuition", next.maxTuition);
      if (next.maxLiving !== "any") params.set("living", next.maxLiving);
      if (next.englishRequired) params.set("english", "1");
      if (next.studyField) params.set("field", next.studyField);
      if (next.countries.length) params.set("countries", next.countries.join(","));

      startTransition(() => {
        router.push(`/search?${params.toString()}`);
      });
    },
    [initial, router, startTransition],
  );

  const toggleCountry = (code: string) => {
    const set = new Set(initial.countries);
    if (set.has(code)) set.delete(code);
    else set.add(code);
    update({ countries: Array.from(set) });
  };

  return (
    <div className="panel-card search-panel">
      <div className="search-panel-inner space-y-8">
        <div>
          <Label htmlFor="search-q" className="text-[var(--text-heading)]">
            Search
          </Label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent-text)] opacity-70" />
              <input
                id="search-q"
                defaultValue={initial.query}
                placeholder="University, city, or country..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    update({ query: (e.target as HTMLInputElement).value });
                  }
                }}
                className="input input-search"
              />
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                const el = document.getElementById("search-q") as HTMLInputElement;
                update({ query: el?.value ?? "" });
              }}
              className="btn btn-fill shrink-0 px-6"
            >
              Go
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-[var(--text-heading)]">Degree level</Label>
              <Select
                value={initial.degree}
                onValueChange={(v) => update({ degree: v as SearchFilters["degree"] })}
              >
                <SelectTrigger className="select-field mt-1 w-full">
                  <SelectValue>{DEGREE_LABELS[initial.degree]}</SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="both">Bachelor & Master</SelectItem>
                  <SelectItem value="bachelor">Bachelor only</SelectItem>
                  <SelectItem value="master">Master only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[var(--text-heading)]">Max tuition</Label>
              <Select
                value={initial.maxTuition}
                onValueChange={(v) =>
                  update({ maxTuition: v as SearchFilters["maxTuition"] })
                }
              >
                <SelectTrigger className="select-field mt-1 w-full">
                  <SelectValue>{TUITION_LABELS[initial.maxTuition]}</SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="free">Free only</SelectItem>
                  <SelectItem value="under2k">Under ~€2k/year</SelectItem>
                  <SelectItem value="under10k">Under ~€10k/year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[var(--text-heading)]">Living cost</Label>
              <Select
                value={initial.maxLiving}
                onValueChange={(v) =>
                  update({ maxLiving: v as SearchFilters["maxLiving"] })
                }
              >
                <SelectTrigger className="select-field mt-1 w-full">
                  <SelectValue>{LIVING_LABELS[initial.maxLiving]}</SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="under800">Under €800/mo</SelectItem>
                  <SelectItem value="800-1200">Up to €1,200/mo</SelectItem>
                  <SelectItem value="1200plus">€1,200+/mo OK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="search-english-row flex items-center gap-2 px-4 py-3">
            <Checkbox
              id="english-req"
              checked={initial.englishRequired}
              onCheckedChange={(c) => update({ englishRequired: c === true })}
            />
            <Label htmlFor="english-req" className="cursor-pointer text-[var(--text-heading)]">
              English programmes required
            </Label>
          </div>

          <div>
            <Label className="text-[var(--text-heading)]">Study field (optional)</Label>
            <p className="text-muted mt-1 text-xs">
              Uses curated programme data where available
            </p>
            <div className="filter-bar mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => update({ studyField: null })}
                className={`search-country-pill ${!initial.studyField ? "search-country-pill-on" : ""}`}
              >
                All fields
              </button>
              {STUDY_INTEREST_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() =>
                    update({
                      studyField:
                        initial.studyField === f.id ? null : (f.id as StudyInterestId),
                    })
                  }
                  className={`search-country-pill ${
                    initial.studyField === f.id ? "search-field-pill-on" : ""
                  }`}
                >
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label className="text-[var(--text-heading)]">Countries (optional filter)</Label>
          <div className="filter-bar mt-3 max-h-36 flex-wrap gap-2 overflow-y-auto p-2">
            {countries
              .filter((c) => c.universityCount > 0)
              .map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => toggleCountry(c.code)}
                  className={`search-country-pill ${
                    initial.countries.includes(c.code) ? "search-country-pill-on" : ""
                  }`}
                >
                  {c.code}
                </button>
              ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/search")}
          disabled={pending}
          className="btn btn-ghost text-sm"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
