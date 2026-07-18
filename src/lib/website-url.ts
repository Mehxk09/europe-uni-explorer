import overrides from "../../data/website-overrides.json";

const OVERRIDE_MAP = overrides as Record<string, string>;

/** Normalize API/stored value to https URL. */
export function normalizeWebsiteUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Best-effort official site URL for a HEI record.
 * Curated overrides win; otherwise use stored value from DB (post-verify script).
 */
export function resolveWebsiteUrl(heiId: string, storedUrl: string | null | undefined): string | null {
  const override = OVERRIDE_MAP[heiId];
  if (override) return override;

  const normalized = normalizeWebsiteUrl(storedUrl);
  if (normalized) return normalized;

  return null;
}

export function websiteOverrideCount(): number {
  return Object.keys(OVERRIDE_MAP).length;
}
