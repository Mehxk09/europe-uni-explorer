import type { TuitionTier } from "./types";

export interface TuitionEstimate {
  low: number;
  high: number;
  label: string;
}

export interface AnnualCostEstimate {
  livingAnnual: number;
  tuitionLow: number;
  tuitionHigh: number;
  totalLow: number;
  totalHigh: number;
  totalMid: number;
  tuitionLabel: string;
}

export function estimateAnnualTuitionEur(tier: TuitionTier): TuitionEstimate {
  switch (tier) {
    case "free":
      return { low: 0, high: 500, label: "€0–500/yr" };
    case "low":
      return { low: 500, high: 2000, label: "€500–2k/yr" };
    case "mixed":
      return { low: 1000, high: 6000, label: "€1k–6k/yr" };
    case "expensive":
      return { low: 6000, high: 15000, label: "€6k+/yr" };
  }
}

export function estimateAnnualCost(
  avgLivingEur: number,
  tier: TuitionTier,
): AnnualCostEstimate {
  const tuition = estimateAnnualTuitionEur(tier);
  const livingAnnual = avgLivingEur * 12;

  return {
    livingAnnual,
    tuitionLow: tuition.low,
    tuitionHigh: tuition.high,
    totalLow: livingAnnual + tuition.low,
    totalHigh: livingAnnual + tuition.high,
    totalMid: livingAnnual + (tuition.low + tuition.high) / 2,
    tuitionLabel: tuition.label,
  };
}

export function formatCostRange(low: number, high: number) {
  const fmt = new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  if (Math.abs(low - high) < 500) return fmt.format((low + high) / 2);
  return `${fmt.format(low)} – ${fmt.format(high)}`;
}
