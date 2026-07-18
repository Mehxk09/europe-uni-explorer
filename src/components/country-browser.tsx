"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { CountryCard } from "@/components/country-card";
import { ScrollReveal, Stagger, StaggerItem } from "@/components/motion/scroll-reveal";
import type { CountryWithStats } from "@/lib/types";
import { REGION_COUNTRIES } from "@/lib/types";

const REGIONS = [
  { id: "all", label: "All" },
  { id: "northern", label: "North" },
  { id: "western", label: "West" },
  { id: "eastern", label: "East" },
  { id: "southern", label: "South" },
] as const;

export function CountryBrowser({ countries }: { countries: CountryWithStats[] }) {
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = countries;
    if (region !== "all") {
      const codes = REGION_COUNTRIES[region] ?? [];
      list = list.filter((c) => codes.includes(c.code));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, region, query]);

  return (
    <ScrollReveal>
      <div className="panel-card">
        <div className="section-head flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2>Countries</h2>
            <p>{filtered.length} available to explore</p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search countries..."
              className="input input-search"
            />
          </div>
        </div>

        <div className="filter-bar mb-8 flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRegion(r.id)}
              className={`filter-pill ${region === r.id ? "filter-pill-on" : ""}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <StaggerItem key={c.code}>
              <CountryCard country={c} />
            </StaggerItem>
          ))}
        </Stagger>

        {filtered.length === 0 && (
          <p className="text-muted py-20 text-center">Nothing found.</p>
        )}
      </div>
    </ScrollReveal>
  );
}
