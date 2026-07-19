import type { StudyInterestId } from "@/lib/uni-display";
import { matchesStudyInterest } from "@/lib/uni-display";
import {
  allPrograms,
  allUniversities,
  getAllProgramsByUniversity,
  getProgramsForUniversities,
  getProgramsForUniversity,
  getTotalProgramCountFromCatalog,
  getTotalUniversityCountFromCatalog,
  getUniversityCountsByCountry,
  getUniversityRowById,
} from "@/lib/catalog";
import type { ProgramRecord } from "@/lib/types";
import curatedCountries from "../../data/curated-countries.json";
import type {
  CountryStudentInfo,
  DeadlineEntry,
} from "./country-student-info-types";
import {
  getCountryStudentInfo,
  getUniversityResourceLinks,
} from "./university-resources";
import { resolveWebsiteUrl } from "@/lib/website-url";
import type {
  CountryWithStats,
  CuratedCountry,
  SearchFilters,
  TuitionTier,
  UniversityWithCountry,
} from "./types";
import { EUROPEAN_COUNTRY_NAMES } from "./types";

function withResolvedWebsite<T extends { id: string; websiteUrl: string | null }>(row: T): T {
  return {
    ...row,
    websiteUrl: resolveWebsiteUrl(row.id, row.websiteUrl),
  };
}

const curatedMap = new Map(
  (curatedCountries as CuratedCountry[]).map((c) => [c.code, c]),
);

const DEFAULT_COUNTRY: CuratedCountry = {
  code: "XX",
  name: "Unknown",
  tuitionTier: "mixed",
  tuitionIntl: "Check official university website",
  tuitionFreeForEU: false,
  englishPrograms: "limited",
  avgLivingEur: 900,
};

function getCurated(code: string): CuratedCountry {
  return curatedMap.get(code) ?? {
    ...DEFAULT_COUNTRY,
    code,
    name: EUROPEAN_COUNTRY_NAMES[code] ?? code,
  };
}

export function getCuratedCountries(): CuratedCountry[] {
  return curatedCountries as CuratedCountry[];
}

export function getCountryStudentInfoForCode(code: string) {
  return getCountryStudentInfo(code);
}

export { getCountryStudentInfo };
export type { CountryStudentInfo, DeadlineEntry };

export async function getCountriesWithStats(): Promise<CountryWithStats[]> {
  const countMap = getUniversityCountsByCountry();

  const allCodes = new Set([
    ...Object.keys(EUROPEAN_COUNTRY_NAMES),
    ...countMap.keys(),
  ]);

  return Array.from(allCodes)
    .map((code) => {
      const curated = getCurated(code);
      return {
        ...curated,
        name: curated.name || EUROPEAN_COUNTRY_NAMES[code] || code,
        universityCount: countMap.get(code) ?? 0,
      };
    })
    .filter((c) => c.universityCount > 0 || curatedMap.has(c.code))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCountryByCode(code: string) {
  const upper = code.toUpperCase();
  const curated = getCurated(upper);
  const countMap = getUniversityCountsByCountry();

  return {
    ...curated,
    name: curated.name || EUROPEAN_COUNTRY_NAMES[upper] || upper,
    universityCount: countMap.get(upper) ?? 0,
  };
}

export async function getUniversitiesByCountry(
  countryCode: string,
  search?: string,
) {
  const upper = countryCode.toUpperCase();
  let rows = allUniversities.filter((u) => u.countryCode === upper);

  if (search?.trim()) {
    const term = search.trim().toLowerCase();
    rows = rows.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        (u.city?.toLowerCase().includes(term) ?? false),
    );
  }

  return rows
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(withResolvedWebsite);
}

export async function getUniversityById(id: string) {
  const row = getUniversityRowById(id);
  if (!row) return null;

  const curated = getCurated(row.countryCode);
  const countryStudentInfo = getCountryStudentInfo(row.countryCode);
  const resourceLinks = getUniversityResourceLinks(
    row.websiteUrl,
    row.name,
    row.countryCode,
    countryStudentInfo,
    {
      bachelors: curated.bachelorsPortalUrl,
      masters: curated.mastersPortalUrl,
      official: curated.officialPortal,
    },
  );

  return {
    ...withResolvedWebsite(row),
    countryName: curated.name || EUROPEAN_COUNTRY_NAMES[row.countryCode] || row.countryCode,
    tuitionTier: curated.tuitionTier,
    tuitionIntl: curated.tuitionIntl,
    englishPrograms: curated.englishPrograms,
    avgLivingEur: curated.avgLivingEur,
    deadlineNotes: curated.deadlineNotes,
    officialPortal: curated.officialPortal,
    visaLink: curated.visaLink,
    bachelorsPortalUrl: curated.bachelorsPortalUrl,
    mastersPortalUrl: curated.mastersPortalUrl,
    countryStudentInfo,
    resourceLinks,
  };
}

function tuitionMatches(tier: TuitionTier, maxTuition: SearchFilters["maxTuition"]) {
  if (maxTuition === "any") return true;
  if (maxTuition === "free") return tier === "free";
  if (maxTuition === "under2k") return tier === "free" || tier === "low";
  if (maxTuition === "under10k") return tier !== "expensive";
  return true;
}

function livingMatches(avgLiving: number, maxLiving: SearchFilters["maxLiving"]) {
  if (maxLiving === "any") return true;
  if (maxLiving === "under800") return avgLiving <= 800;
  if (maxLiving === "800-1200") return avgLiving <= 1200;
  if (maxLiving === "1200plus") return avgLiving > 1200;
  return true;
}

function englishMatches(level: string, required: boolean) {
  if (!required) return true;
  return level === "common" || level === "growing";
}

function degreeMatches(
  programsForUni: ProgramRecord[],
  degree: SearchFilters["degree"],
): boolean {
  if (degree === "both") return true;
  if (programsForUni.length > 0) {
    return programsForUni.some((p) => p.degreeLevel === degree);
  }
  return true;
}

function studyFieldMatches(
  universityName: string,
  programsForUni: ProgramRecord[],
  field: string | null,
): boolean {
  if (!field) return true;
  const interest = field as StudyInterestId;
  if (programsForUni.some((p) => p.fields.includes(interest))) return true;
  return matchesStudyInterest(universityName, interest);
}

export async function searchUniversities(
  filters: SearchFilters,
): Promise<UniversityWithCountry[]> {
  const programMap = getAllProgramsByUniversity();
  let filtered = [...allUniversities];

  if (filters.countries.length > 0) {
    filtered = filtered.filter((u) => filters.countries.includes(u.countryCode));
  }

  if (filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.city?.toLowerCase().includes(q) ?? false) ||
        (EUROPEAN_COUNTRY_NAMES[u.countryCode]?.toLowerCase().includes(q) ?? false),
    );
  }

  const results: UniversityWithCountry[] = [];

  for (const row of filtered) {
    const curated = getCurated(row.countryCode);
    if (!tuitionMatches(curated.tuitionTier, filters.maxTuition)) continue;
    if (!livingMatches(curated.avgLivingEur, filters.maxLiving)) continue;
    if (!englishMatches(curated.englishPrograms, filters.englishRequired)) continue;

    const uniPrograms = programMap[row.id] ?? [];
    if (!degreeMatches(uniPrograms, filters.degree)) continue;
    if (!studyFieldMatches(row.name, uniPrograms, filters.studyField)) continue;

    results.push({
      ...withResolvedWebsite(row),
      countryName:
        curated.name || EUROPEAN_COUNTRY_NAMES[row.countryCode] || row.countryCode,
      tuitionTier: curated.tuitionTier,
      tuitionIntl: curated.tuitionIntl,
      englishPrograms: curated.englishPrograms,
      avgLivingEur: curated.avgLivingEur,
      officialPortal: curated.officialPortal ?? null,
      bachelorsPortalUrl: curated.bachelorsPortalUrl ?? null,
      mastersPortalUrl: curated.mastersPortalUrl ?? null,
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getUniversitiesByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const programMap = getProgramsForUniversities(ids);
  const order = new Map(ids.map((id, i) => [id, i]));

  return ids
    .map((id) => getUniversityRowById(id))
    .filter((row): row is NonNullable<typeof row> => row != null)
    .map((row) => {
      const curated = getCurated(row.countryCode);
      const countryStudentInfo = getCountryStudentInfo(row.countryCode);
      return {
        ...withResolvedWebsite(row),
        countryName:
          curated.name || EUROPEAN_COUNTRY_NAMES[row.countryCode] || row.countryCode,
        tuitionTier: curated.tuitionTier,
        tuitionIntl: curated.tuitionIntl,
        englishPrograms: curated.englishPrograms,
        avgLivingEur: curated.avgLivingEur,
        officialPortal: curated.officialPortal ?? null,
        visaLink: curated.visaLink ?? null,
        bachelorsPortalUrl: curated.bachelorsPortalUrl ?? null,
        mastersPortalUrl: curated.mastersPortalUrl ?? null,
        deadlineNotes: curated.deadlineNotes ?? null,
        programs: programMap[row.id] ?? [],
        countryStudentInfo,
      };
    })
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

export async function getTotalUniversityCount() {
  return getTotalUniversityCountFromCatalog();
}

export async function getProgramsByUniversityIds(
  ids: string[],
): Promise<Record<string, ProgramRecord[]>> {
  return getProgramsForUniversities(ids);
}

export async function getProgramsByUniversityId(universityId: string): Promise<ProgramRecord[]> {
  return getProgramsForUniversity(universityId);
}

export async function getProgramFieldsByCountry(
  countryCode: string,
): Promise<Record<string, StudyInterestId[]>> {
  const upper = countryCode.toUpperCase();
  const uniIds = new Set(
    allUniversities.filter((u) => u.countryCode === upper).map((u) => u.id),
  );

  const map: Record<string, Set<StudyInterestId>> = {};

  for (const program of allPrograms) {
    if (!uniIds.has(program.universityId)) continue;
    const set = map[program.universityId] ?? new Set<StudyInterestId>();
    for (const field of program.fields as StudyInterestId[]) set.add(field);
    map[program.universityId] = set;
  }

  return Object.fromEntries(
    Object.entries(map).map(([id, fields]) => [id, [...fields]]),
  );
}

export async function getProgramCountsByCountry(
  countryCode: string,
): Promise<Record<string, number>> {
  const upper = countryCode.toUpperCase();
  const uniIds = new Set(
    allUniversities.filter((u) => u.countryCode === upper).map((u) => u.id),
  );

  const map: Record<string, number> = {};
  for (const program of allPrograms) {
    if (!uniIds.has(program.universityId)) continue;
    map[program.universityId] = (map[program.universityId] ?? 0) + 1;
  }
  return map;
}

export async function getProgramCount(): Promise<number> {
  return getTotalProgramCountFromCatalog();
}

export { getCurated };
