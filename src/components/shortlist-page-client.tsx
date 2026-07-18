"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { ApplicationChecklist } from "@/components/application-checklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShortlist } from "@/hooks/use-shortlist";
import { CountryFlag } from "@/components/country-flag";

export function ShortlistPageClient() {
  const { items, remove, updateNotes, clear } = useShortlist();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 py-16 text-center">
        <p className="text-lg text-stone-700">Your shortlist is empty</p>
        <p className="mt-2 text-sm text-stone-500">
          Tap ♥ on any university to save it here
        </p>
        <Button asChild className="mt-6">
          <Link href="/search">Start searching</Link>
        </Button>
      </div>
    );
  }

  const exportText = items
    .map(
      (i, n) =>
        `${n + 1}. ${i.name} (${i.countryName}${i.city ? `, ${i.city}` : ""})${i.notes ? `\n   Notes: ${i.notes}` : ""}${i.websiteUrl ? `\n   ${i.websiteUrl}` : ""}`,
    )
    .join("\n\n");

  return (
    <div className="space-y-6">
      <ApplicationChecklist />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(exportText);
          }}
        >
          Copy checklist
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/compare?ids=${items.map((i) => i.universityId).slice(0, 4).join(",")}`}>
            Compare first {Math.min(4, items.length)}
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={clear} className="text-rose-600">
          Clear all
        </Button>
      </div>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.universityId}
            className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={`/universities/${item.universityId}`}
                  className="font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <CountryFlag code={item.countryCode} size="sm" />
                  {item.countryName}
                  {item.city ? ` · ${item.city}` : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(item.universityId)}
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
            <Input
              className="mt-3"
              placeholder="Notes (e.g. ask about IELTS waiver)"
              defaultValue={item.notes}
              onBlur={(e) => updateNotes(item.universityId, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
