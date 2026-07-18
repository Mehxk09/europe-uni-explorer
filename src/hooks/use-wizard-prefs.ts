"use client";

import { useEffect, useState } from "react";

import { getDefaultWizardPrefs } from "@/lib/fit-score";
import type { WizardAnswers } from "@/lib/types";

const STORAGE_KEY = "euro-uni-wizard-prefs";

export function saveWizardPrefs(prefs: WizardAnswers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export function loadWizardPrefs(): WizardAnswers {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultWizardPrefs();
    return { ...getDefaultWizardPrefs(), ...JSON.parse(raw) };
  } catch {
    return getDefaultWizardPrefs();
  }
}

export function useWizardPrefs(): WizardAnswers {
  const [prefs, setPrefs] = useState<WizardAnswers>(getDefaultWizardPrefs);

  useEffect(() => {
    setPrefs(loadWizardPrefs());
  }, []);

  return prefs;
}
