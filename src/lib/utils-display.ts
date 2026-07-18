import type { EnglishLevel, TuitionTier } from "./types";

export function tuitionBadgeVariant(tier: TuitionTier) {
  switch (tier) {
    case "free":
      return "default" as const;
    case "low":
      return "secondary" as const;
    case "mixed":
      return "outline" as const;
    case "expensive":
      return "destructive" as const;
  }
}

export function tuitionLabel(tier: TuitionTier) {
  switch (tier) {
    case "free":
      return "Free tuition";
    case "low":
      return "Low tuition";
    case "mixed":
      return "Mixed";
    case "expensive":
      return "Expensive";
  }
}

/** Plain language for cards */
export function tuitionSimple(tier: TuitionTier) {
  switch (tier) {
    case "free":
      return { emoji: "💰", label: "Free" };
    case "low":
      return { emoji: "💰", label: "Cheap" };
    case "mixed":
      return { emoji: "💰", label: "Varies" };
    case "expensive":
      return { emoji: "💰", label: "Pricey" };
  }
}

export function englishSimple(level: EnglishLevel) {
  switch (level) {
    case "common":
      return { emoji: "🗣️", label: "English OK" };
    case "growing":
      return { emoji: "🗣️", label: "Some English" };
    case "limited":
      return { emoji: "🗣️", label: "Little English" };
    case "rare":
      return { emoji: "🗣️", label: "Rare English" };
  }
}

export function englishLabel(level: EnglishLevel) {
  switch (level) {
    case "common":
      return "Many English programmes";
    case "growing":
      return "Growing English offer";
    case "limited":
      return "Limited English";
    case "rare":
      return "Rare English";
  }
}

/** Full sentence for university list rows — easy to scan */
export function englishCoursesLine(level: EnglishLevel) {
  switch (level) {
    case "common":
      return "Many courses taught in English";
    case "growing":
      return "Some courses in English — mainly Master's";
    case "limited":
      return "Few English courses — mostly local language";
    case "rare":
      return "Courses usually in local language only";
  }
}

/** Short tuition line for list rows */
export function tuitionCoursesLine(tier: TuitionTier) {
  switch (tier) {
    case "free":
      return "Tuition-free or very low fees";
    case "low":
      return "Relatively low tuition fees";
    case "mixed":
      return "Tuition varies by programme";
    case "expensive":
      return "Higher tuition fees";
  }
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function countryFlagUrl(code: string) {
  if (code.length !== 2) return "";
  return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
}

/** @deprecated Prefer <CountryFlag /> — emoji flags render as "DE" on Windows */
export function countryFlag(code: string) {
  if (code.length !== 2) return "🏳️";
  const points = code
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...points);
}

export function portalSearchUrl(
  name: string,
  type: "bachelor" | "master",
  url?: string | null,
) {
  if (url) return url;
  const q = encodeURIComponent(name);
  return type === "bachelor"
    ? `https://www.bachelorsportal.com/search/#q=${q}`
    : `https://www.mastersportal.com/search/#q=${q}`;
}
