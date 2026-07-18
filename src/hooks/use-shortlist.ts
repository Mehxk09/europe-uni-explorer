"use client";

import { useSyncExternalStore } from "react";

import type { ShortlistItem } from "@/lib/types";

const STORAGE_KEY = "euro-uni-shortlist";
const EMPTY: ShortlistItem[] = [];

let cachedRaw: string | null | undefined;
let cachedSnapshot: ShortlistItem[] = EMPTY;

function getSnapshot(): ShortlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;

    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = EMPTY;
    } else {
      cachedSnapshot = JSON.parse(raw) as ShortlistItem[];
    }
    return cachedSnapshot;
  } catch {
    cachedRaw = null;
    cachedSnapshot = EMPTY;
    return EMPTY;
  }
}

function subscribe(callback: () => void) {
  const onUpdate = () => {
    cachedRaw = undefined;
    callback();
  };
  window.addEventListener("storage", onUpdate);
  window.addEventListener("shortlist-updated", onUpdate);
  return () => {
    window.removeEventListener("storage", onUpdate);
    window.removeEventListener("shortlist-updated", onUpdate);
  };
}

function persist(items: ShortlistItem[]) {
  const raw = JSON.stringify(items);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSnapshot = items.length === 0 ? EMPTY : items;
  window.dispatchEvent(new Event("shortlist-updated"));
}

export function useShortlist() {
  const items = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const add = (
    item: Omit<ShortlistItem, "addedAt" | "notes"> & { notes?: string },
  ) => {
    const current = getSnapshot();
    if (current.some((i) => i.universityId === item.universityId)) return;
    persist([
      ...current,
      {
        ...item,
        notes: item.notes ?? "",
        addedAt: new Date().toISOString(),
      },
    ]);
  };

  const remove = (universityId: string) => {
    persist(getSnapshot().filter((i) => i.universityId !== universityId));
  };

  const updateNotes = (universityId: string, notes: string) => {
    persist(
      getSnapshot().map((i) =>
        i.universityId === universityId ? { ...i, notes } : i,
      ),
    );
  };

  const isSaved = (universityId: string) =>
    items.some((i) => i.universityId === universityId);

  const clear = () => persist([]);

  return { items, loaded: true, add, remove, updateNotes, isSaved, clear };
}
