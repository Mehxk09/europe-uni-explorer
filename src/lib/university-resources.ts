import type { CountryStudentInfo } from "./country-student-info-types";
import studentInfoData from "../../data/country-student-info.json";

const infoMap = studentInfoData as Record<string, CountryStudentInfo>;

export function getCountryStudentInfo(code: string): CountryStudentInfo | null {
  return infoMap[code.toUpperCase()] ?? null;
}

export function getAllCountryStudentInfo() {
  return infoMap;
}

export interface OfficialResourceLink {
  label: string;
  url: string;
  source: "university" | "country" | "portal";
  note?: string;
}

/** Build links to official sources — always prefer verifying on the university website. */
export function getUniversityResourceLinks(
  websiteUrl: string | null,
  uniName: string,
  countryCode: string,
  countryInfo: CountryStudentInfo | null,
  portals: {
    bachelors?: string | null;
    masters?: string | null;
    official?: string | null;
  },
): {
  programmes: OfficialResourceLink[];
  housing: OfficialResourceLink[];
  admissions: OfficialResourceLink[];
} {
  const base = websiteUrl?.replace(/\/$/, "") ?? null;
  const encodedName = encodeURIComponent(uniName);

  const programmes: OfficialResourceLink[] = [];
  const housing: OfficialResourceLink[] = [];
  const admissions: OfficialResourceLink[] = [];

  if (base) {
    admissions.push({
      label: "International admissions (official site)",
      url: base,
      source: "university",
      note: "Search: International students · Admissions · Apply",
    });
    programmes.push({
      label: "Study programmes (official site)",
      url: base,
      source: "university",
      note: "Search: Programmes · Courses · Study · English-taught",
    });
    housing.push({
      label: "Student housing (official site)",
      url: base,
      source: "university",
      note: "Search: Accommodation · Housing · Dorms · Residences",
    });
  }

  if (portals.bachelors) {
    programmes.push({
      label: "Bachelor programmes (BachelorsPortal)",
      url: `${portals.bachelors}${portals.bachelors.includes("?") ? "&" : "?"}q=${encodedName}`,
      source: "portal",
      note: "External catalogue — verify on university site",
    });
  }
  if (portals.masters) {
    programmes.push({
      label: "Master programmes (MastersPortal)",
      url: `https://www.mastersportal.com/search/#q=${encodedName}`,
      source: "portal",
      note: "External catalogue — verify on university site",
    });
  }

  if (countryInfo?.housingPortalUrl) {
    housing.push({
      label: `${countryCode} — official housing guide`,
      url: countryInfo.housingPortalUrl,
      source: "country",
    });
  }
  if (portals.official) {
    admissions.push({
      label: "Country study portal",
      url: portals.official,
      source: "country",
    });
  }

  return { programmes, housing, admissions };
}
