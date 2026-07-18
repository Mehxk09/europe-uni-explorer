export type TuitionTier = "free" | "low" | "mixed" | "expensive";
export type EnglishLevel = "common" | "growing" | "limited" | "rare";

export interface CuratedCountry {
  code: string;
  name: string;
  tuitionTier: TuitionTier;
  tuitionIntl: string;
  tuitionFreeForEU: boolean;
  englishPrograms: EnglishLevel;
  avgLivingEur: number;
  deadlineNotes?: string;
  officialPortal?: string;
  visaLink?: string;
  bachelorsPortalUrl?: string;
  mastersPortalUrl?: string;
}

export interface CountryWithStats extends CuratedCountry {
  universityCount: number;
}

export interface UniversityWithCountry {
  id: string;
  name: string;
  label: string | null;
  countryCode: string;
  countryName: string;
  city: string | null;
  websiteUrl: string | null;
  postalCode: string | null;
  heiApiUrl: string | null;
  tuitionTier: TuitionTier;
  tuitionIntl: string | null;
  englishPrograms: EnglishLevel;
  avgLivingEur: number;
  officialPortal: string | null;
  bachelorsPortalUrl: string | null;
  mastersPortalUrl: string | null;
}

export interface ProgramRecord {
  id: string;
  universityId: string;
  name: string;
  degreeLevel: string;
  language: string;
  fields: string[];
  url: string | null;
  description: string | null;
}

export type DegreeLevel = "bachelor" | "master" | "both";

export interface SearchFilters {
  degree: DegreeLevel;
  maxTuition: "free" | "under2k" | "under10k" | "any";
  maxLiving: "under800" | "800-1200" | "1200plus" | "any";
  englishRequired: boolean;
  countries: string[];
  query: string;
  studyField: string | null;
}

export interface ShortlistItem {
  universityId: string;
  name: string;
  countryCode: string;
  countryName: string;
  city: string | null;
  websiteUrl: string | null;
  notes: string;
  addedAt: string;
}

export interface WizardAnswers {
  degree: DegreeLevel;
  budget: "minimal" | "moderate" | "flexible";
  englishOnly: boolean;
  priority: "tuition" | "living" | "english" | "balanced";
  region: "any" | "northern" | "western" | "eastern" | "southern";
}

export const EUROPEAN_COUNTRY_NAMES: Record<string, string> = {
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czechia",
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GR: "Greece",
  HU: "Hungary",
  IS: "Iceland",
  IE: "Ireland",
  IT: "Italy",
  LV: "Latvia",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MT: "Malta",
  NL: "Netherlands",
  NO: "Norway",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SK: "Slovakia",
  SI: "Slovenia",
  ES: "Spain",
  SE: "Sweden",
  CH: "Switzerland",
  GB: "United Kingdom",
  UK: "United Kingdom",
};

export const REGION_COUNTRIES: Record<string, string[]> = {
  northern: ["NO", "SE", "FI", "DK", "IS", "EE", "LV", "LT"],
  western: ["DE", "NL", "BE", "FR", "IE", "GB", "LU", "CH", "AT"],
  eastern: ["PL", "CZ", "SK", "HU", "RO", "BG", "SI", "HR"],
  southern: ["IT", "ES", "PT", "GR", "CY", "MT"],
};
