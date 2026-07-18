import fs from "fs";
import path from "path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { countries, universities } from "../src/db/schema";
import curatedCountries from "../data/curated-countries.json";
import type { CuratedCountry } from "../src/lib/types";
import { EUROPEAN_COUNTRY_NAMES } from "../src/lib/types";

const HEI_BASE = "https://hei.api.uni-foundation.eu/api/public";
const EUROPEAN_CODES = Object.keys(EUROPEAN_COUNTRY_NAMES);

interface HeiName {
  string?: string;
  lang?: string;
}

interface HeiAttributes {
  label?: string;
  city?: string;
  country?: string;
  hei_id?: string;
  website_url?: string | null;
  name?: HeiName[];
  mailing_address?: { postal_code?: string | null };
}

interface HeiRecord {
  id: string;
  attributes: HeiAttributes;
  links?: { self?: { href?: string } };
}

interface HeiResponse {
  data: HeiRecord[];
}

function resolveName(attrs: HeiAttributes): string {
  const fromName = attrs.name?.find((n) => n.string)?.string;
  if (fromName) return fromName;
  if (attrs.label) {
    return attrs.label
      .split(" ")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }
  return attrs.hei_id ?? "Unknown";
}

function ensureDataDir(dbPath: string) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function fetchCountryHeis(code: string): Promise<HeiRecord[]> {
  const url = `${HEI_BASE}/country/${code}/hei`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Skipped ${code}: HTTP ${res.status}`);
    return [];
  }
  const json = (await res.json()) as HeiResponse;
  return json.data ?? [];
}

async function main() {
  const dbPath = path.join(process.cwd(), "data", "euro-uni.db");
  ensureDataDir(dbPath);

  const sqlite = new Database(dbPath);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS countries (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tuition_tier TEXT NOT NULL DEFAULT 'mixed',
      tuition_intl TEXT,
      tuition_free_for_eu INTEGER DEFAULT 0,
      english_programs TEXT NOT NULL DEFAULT 'limited',
      avg_living_eur INTEGER NOT NULL DEFAULT 1000,
      deadline_notes TEXT,
      official_portal TEXT,
      visa_link TEXT,
      bachelors_portal_url TEXT,
      masters_portal_url TEXT
    );
    CREATE TABLE IF NOT EXISTS universities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      label TEXT,
      country_code TEXT NOT NULL REFERENCES countries(code),
      city TEXT,
      website_url TEXT,
      postal_code TEXT,
      hei_api_url TEXT
    );
  `);

  const db = drizzle(sqlite);

  console.log("Seeding curated countries...");
  const curatedMap = new Map(
    (curatedCountries as CuratedCountry[]).map((c) => [c.code, c]),
  );

  for (const code of EUROPEAN_CODES) {
    const curated = curatedMap.get(code);
    const name = curated?.name ?? EUROPEAN_COUNTRY_NAMES[code] ?? code;
    await db
      .insert(countries)
      .values({
        code,
        name,
        tuitionTier: curated?.tuitionTier ?? "mixed",
        tuitionIntl: curated?.tuitionIntl ?? null,
        tuitionFreeForEU: curated?.tuitionFreeForEU ?? false,
        englishPrograms: curated?.englishPrograms ?? "limited",
        avgLivingEur: curated?.avgLivingEur ?? 900,
        deadlineNotes: curated?.deadlineNotes ?? null,
        officialPortal: curated?.officialPortal ?? null,
        visaLink: curated?.visaLink ?? null,
        bachelorsPortalUrl: curated?.bachelorsPortalUrl ?? null,
        mastersPortalUrl: curated?.mastersPortalUrl ?? null,
      })
      .onConflictDoUpdate({
        target: countries.code,
        set: {
          name,
          tuitionTier: curated?.tuitionTier ?? "mixed",
          tuitionIntl: curated?.tuitionIntl ?? null,
          tuitionFreeForEU: curated?.tuitionFreeForEU ?? false,
          englishPrograms: curated?.englishPrograms ?? "limited",
          avgLivingEur: curated?.avgLivingEur ?? 900,
          deadlineNotes: curated?.deadlineNotes ?? null,
          officialPortal: curated?.officialPortal ?? null,
          visaLink: curated?.visaLink ?? null,
          bachelorsPortalUrl: curated?.bachelorsPortalUrl ?? null,
          mastersPortalUrl: curated?.mastersPortalUrl ?? null,
        },
      });
  }

  console.log("Fetching universities from HEI API...");
  let total = 0;

  for (const code of EUROPEAN_CODES) {
    process.stdout.write(`  ${code}... `);
    const heis = await fetchCountryHeis(code);
    let inserted = 0;

    for (const hei of heis) {
      const attrs = hei.attributes;
      const id = attrs.hei_id ?? hei.id;
      if (!id) continue;

      const websiteUrl = attrs.website_url
        ? attrs.website_url.startsWith("http")
          ? attrs.website_url
          : `https://${attrs.website_url}`
        : `https://${id}`;

      await db
        .insert(universities)
        .values({
          id,
          name: resolveName(attrs),
          label: attrs.label ?? null,
          countryCode: code,
          city: attrs.city ?? null,
          websiteUrl,
          postalCode: attrs.mailing_address?.postal_code ?? null,
          heiApiUrl: hei.links?.self?.href ?? null,
        })
        .onConflictDoUpdate({
          target: universities.id,
          set: {
            name: resolveName(attrs),
            label: attrs.label ?? null,
            city: attrs.city ?? null,
            websiteUrl,
            postalCode: attrs.mailing_address?.postal_code ?? null,
            heiApiUrl: hei.links?.self?.href ?? null,
          },
        });
      inserted++;
    }

    total += inserted;
    console.log(`${inserted} universities`);
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone! Synced ${total} universities across ${EUROPEAN_CODES.length} countries.`);
  sqlite.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
