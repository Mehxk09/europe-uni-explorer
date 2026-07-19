import programsJson from "../../data/programs.json";
import universitiesJson from "../../data/universities.json";

import type { ProgramRecord } from "./types";

export interface CatalogUniversity {
  id: string;
  name: string;
  label: string | null;
  countryCode: string;
  city: string | null;
  websiteUrl: string | null;
  postalCode: string | null;
  heiApiUrl: string | null;
}

export const allUniversities = universitiesJson as CatalogUniversity[];
export const allPrograms = programsJson as ProgramRecord[];

const countByCountry = new Map<string, number>();
for (const u of allUniversities) {
  countByCountry.set(u.countryCode, (countByCountry.get(u.countryCode) ?? 0) + 1);
}

export function getUniversityCountsByCountry() {
  return countByCountry;
}

export function getTotalUniversityCountFromCatalog() {
  return allUniversities.length;
}

export function getTotalProgramCountFromCatalog() {
  return allPrograms.length;
}

const programsByUniversity = new Map<string, ProgramRecord[]>();
for (const program of allPrograms) {
  const list = programsByUniversity.get(program.universityId) ?? [];
  list.push(program);
  programsByUniversity.set(program.universityId, list);
}

export function getProgramsForUniversity(universityId: string): ProgramRecord[] {
  return programsByUniversity.get(universityId) ?? [];
}

export function getProgramsForUniversities(ids: string[]): Record<string, ProgramRecord[]> {
  const map: Record<string, ProgramRecord[]> = {};
  for (const id of ids) {
    const list = programsByUniversity.get(id);
    if (list?.length) map[id] = list;
  }
  return map;
}

export function getAllProgramsByUniversity(): Record<string, ProgramRecord[]> {
  return Object.fromEntries(programsByUniversity);
}

const universityById = new Map(allUniversities.map((u) => [u.id, u]));

export function getUniversityRowById(id: string) {
  return universityById.get(id) ?? null;
}
