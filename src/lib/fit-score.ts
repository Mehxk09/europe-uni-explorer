import type { EnglishLevel, TuitionTier, WizardAnswers } from "./types";

export type FitLabel = "Strong match" | "Good match" | "Stretch";

export interface FitResult {
  score: number;
  label: FitLabel;
  percent: number;
}

const DEFAULT_PREFS: WizardAnswers = {
  degree: "both",
  budget: "moderate",
  englishOnly: false,
  priority: "balanced",
  region: "any",
};

export function getDefaultWizardPrefs(): WizardAnswers {
  return { ...DEFAULT_PREFS };
}

function fitLabel(score: number): FitLabel {
  if (score >= 70) return "Strong match";
  if (score >= 45) return "Good match";
  return "Stretch";
}

export function scoreUniversity(
  uni: {
    tuitionTier: TuitionTier;
    englishPrograms: EnglishLevel;
    avgLivingEur: number;
    countryCode: string;
  },
  prefs: WizardAnswers = DEFAULT_PREFS,
): FitResult {
  let score = 0;

  const tuitionScores: Record<TuitionTier, number> = {
    free: 40,
    low: 30,
    mixed: 15,
    expensive: 0,
  };
  const englishScores: Record<EnglishLevel, number> = {
    common: 35,
    growing: 25,
    limited: 10,
    rare: 0,
  };

  if (prefs.priority === "tuition" || prefs.priority === "balanced") {
    score += tuitionScores[uni.tuitionTier] ?? 10;
  }
  if (prefs.priority === "living" || prefs.priority === "balanced") {
    score += Math.max(0, 40 - (uni.avgLivingEur - 500) / 25);
  }
  if (prefs.priority === "english" || prefs.priority === "balanced") {
    score += englishScores[uni.englishPrograms] ?? 5;
  }

  if (prefs.englishOnly) {
    if (uni.englishPrograms === "common") score += 15;
    if (uni.englishPrograms === "limited" || uni.englishPrograms === "rare") {
      score -= 20;
    }
  }

  if (prefs.budget === "minimal") {
    if (uni.tuitionTier === "free") score += 20;
    if (uni.avgLivingEur <= 700) score += 15;
    if (uni.tuitionTier === "expensive") score -= 30;
  }
  if (prefs.budget === "moderate") {
    if (uni.tuitionTier !== "expensive") score += 10;
    if (uni.avgLivingEur <= 1000) score += 10;
  }

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score: clamped,
    percent: clamped,
    label: fitLabel(clamped),
  };
}
