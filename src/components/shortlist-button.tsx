"use client";

import { Heart } from "lucide-react";

import { useShortlist } from "@/hooks/use-shortlist";

interface ShortlistButtonProps {
  universityId: string;
  name: string;
  countryCode: string;
  countryName: string;
  city: string | null;
  websiteUrl: string | null;
  size?: "sm" | "default";
}

export function ShortlistButton({
  universityId,
  name,
  countryCode,
  countryName,
  city,
  websiteUrl,
  size = "default",
}: ShortlistButtonProps) {
  const { add, remove, isSaved } = useShortlist();
  const saved = isSaved(universityId);

  return (
    <button
      type="button"
      onClick={() => {
        if (saved) {
          remove(universityId);
        } else {
          add({ universityId, name, countryCode, countryName, city, websiteUrl });
        }
      }}
      className={`inline-flex items-center gap-1.5 rounded-xl border font-medium transition ${
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm"
      } ${
        saved
          ? "border-blue-500 bg-blue-500 text-white shadow-sm"
          : "border-[var(--border-soft)] bg-[var(--surface-solid)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--accent-text)]"
      }`}
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Shortlist"}
    </button>
  );
}
