import type { CountryWithStats, WizardAnswers } from "./types";
import { REGION_COUNTRIES } from "./types";

function scoreCountry(country: CountryWithStats, answers: WizardAnswers): number {
  let score = 0;

  const tuitionScores: Record<string, number> = {
    free: 40,
    low: 30,
    mixed: 15,
    expensive: 0,
  };
  const englishScores: Record<string, number> = {
    common: 35,
    growing: 25,
    limited: 10,
    rare: 0,
  };

  if (answers.priority === "tuition" || answers.priority === "balanced") {
    score += tuitionScores[country.tuitionTier] ?? 10;
  }
  if (answers.priority === "living" || answers.priority === "balanced") {
    const livingScore = Math.max(0, 40 - (country.avgLivingEur - 500) / 25);
    score += livingScore;
  }
  if (answers.priority === "english" || answers.priority === "balanced") {
    score += englishScores[country.englishPrograms] ?? 5;
  }

  if (answers.englishOnly && country.englishPrograms === "common") score += 15;
  if (answers.englishOnly && country.englishPrograms === "limited") score -= 20;

  if (answers.budget === "minimal") {
    if (country.tuitionTier === "free") score += 20;
    if (country.avgLivingEur <= 700) score += 15;
    if (country.tuitionTier === "expensive") score -= 30;
  }
  if (answers.budget === "moderate") {
    if (country.tuitionTier !== "expensive") score += 10;
    if (country.avgLivingEur <= 1000) score += 10;
  }

  if (answers.region !== "any") {
    const regionCodes = REGION_COUNTRIES[answers.region] ?? [];
    if (regionCodes.includes(country.code)) score += 25;
    else score -= 15;
  }

  if (country.universityCount > 20) score += 5;

  return score;
}

export function rankCountriesForWizard(
  countries: CountryWithStats[],
  answers: WizardAnswers,
): CountryWithStats[] {
  return [...countries]
    .map((c) => ({ country: c, score: scoreCountry(c, answers) }))
    .sort((a, b) => b.score - a.score)
    .map((r) => r.country);
}
