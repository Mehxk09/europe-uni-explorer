"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CountryCard } from "@/components/country-card";
import { Button } from "@/components/ui/button";
import { saveWizardPrefs } from "@/hooks/use-wizard-prefs";
import type { CountryWithStats, WizardAnswers } from "@/lib/types";
import { rankCountriesForWizard } from "@/lib/wizard";

const STEPS = [
  "Degree level",
  "Budget",
  "English",
  "Priority",
  "Region",
  "Results",
];

const defaultAnswers: WizardAnswers = {
  degree: "both",
  budget: "minimal",
  englishOnly: true,
  priority: "balanced",
  region: "any",
};

function OptionButton({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border-2 px-5 py-4 text-left transition ${
        selected
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-200 bg-white hover:border-neutral-400"
      }`}
    >
      <span className="block font-semibold text-slate-900">{title}</span>
      {description && (
        <span className="mt-1 block text-sm text-slate-600">
          {description}
        </span>
      )}
    </button>
  );
}

export function WizardFlow({ countries }: { countries: CountryWithStats[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(defaultAnswers);

  const ranked = useMemo(
    () => rankCountriesForWizard(countries, answers).slice(0, 8),
    [countries, answers],
  );

  useEffect(() => {
    if (step === STEPS.length - 1) {
      saveWizardPrefs(answers);
    }
  }, [step, answers]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="space-y-10">
      <div className="flex gap-2">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-blue-600" : "bg-slate-200"
            }`}
            title={label}
          />
        ))}
      </div>

      <div className="card-soft min-h-[280px] p-6 sm:p-8">
        {step === 0 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              What degree are you looking for?
            </h2>
            <div className="space-y-3">
              <OptionButton
                selected={answers.degree === "both"}
                onClick={() => setAnswers((a) => ({ ...a, degree: "both" }))}
                title="Bachelor or Master"
                description="I'm open to either level"
              />
              <OptionButton
                selected={answers.degree === "bachelor"}
                onClick={() => setAnswers((a) => ({ ...a, degree: "bachelor" }))}
                title="Bachelor's"
                description="First degree, usually 3–4 years"
              />
              <OptionButton
                selected={answers.degree === "master"}
                onClick={() => setAnswers((a) => ({ ...a, degree: "master" }))}
                title="Master's"
                description="Graduate degree, usually 1–2 years"
              />
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              What&apos;s your budget?
            </h2>
            <div className="space-y-3">
              <OptionButton
                selected={answers.budget === "minimal"}
                onClick={() => setAnswers((a) => ({ ...a, budget: "minimal" }))}
                title="As cheap as possible"
                description="Free or low tuition, affordable cities"
              />
              <OptionButton
                selected={answers.budget === "moderate"}
                onClick={() => setAnswers((a) => ({ ...a, budget: "moderate" }))}
                title="Moderate"
                description="Balance cost with more country options"
              />
              <OptionButton
                selected={answers.budget === "flexible"}
                onClick={() => setAnswers((a) => ({ ...a, budget: "flexible" }))}
                title="Flexible"
                description="Cost matters less — focus on fit"
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              English-taught programmes?
            </h2>
            <div className="space-y-3">
              <OptionButton
                selected={answers.englishOnly}
                onClick={() => setAnswers((a) => ({ ...a, englishOnly: true }))}
                title="Yes — English required"
                description="I need courses taught in English"
              />
              <OptionButton
                selected={!answers.englishOnly}
                onClick={() => setAnswers((a) => ({ ...a, englishOnly: false }))}
                title="No — local language is fine"
                description="I'm happy to study in the local language"
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              What matters most?
            </h2>
            <div className="space-y-3">
              <OptionButton
                selected={answers.priority === "balanced"}
                onClick={() => setAnswers((a) => ({ ...a, priority: "balanced" }))}
                title="Balanced"
                description="All factors weighed equally"
              />
              <OptionButton
                selected={answers.priority === "tuition"}
                onClick={() => setAnswers((a) => ({ ...a, priority: "tuition" }))}
                title="Lowest tuition"
                description="Keep study fees as low as possible"
              />
              <OptionButton
                selected={answers.priority === "living"}
                onClick={() => setAnswers((a) => ({ ...a, priority: "living" }))}
                title="Cheapest living costs"
                description="Rent and daily expenses matter most"
              />
              <OptionButton
                selected={answers.priority === "english"}
                onClick={() => setAnswers((a) => ({ ...a, priority: "english" }))}
                title="Most English programmes"
                description="Maximum choice of English courses"
              />
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              Preferred region?
            </h2>
            <div className="space-y-3">
              <OptionButton
                selected={answers.region === "any"}
                onClick={() => setAnswers((a) => ({ ...a, region: "any" }))}
                title="No preference"
                description="Show me all of Europe"
              />
              <OptionButton
                selected={answers.region === "northern"}
                onClick={() => setAnswers((a) => ({ ...a, region: "northern" }))}
                title="Northern Europe"
                description="Nordics, Baltics, etc."
              />
              <OptionButton
                selected={answers.region === "western"}
                onClick={() => setAnswers((a) => ({ ...a, region: "western" }))}
                title="Western Europe"
                description="Germany, Netherlands, France, etc."
              />
              <OptionButton
                selected={answers.region === "eastern"}
                onClick={() => setAnswers((a) => ({ ...a, region: "eastern" }))}
                title="Eastern Europe"
                description="Poland, Czechia, Hungary, etc."
              />
              <OptionButton
                selected={answers.region === "southern"}
                onClick={() => setAnswers((a) => ({ ...a, region: "southern" }))}
                title="Southern Europe"
                description="Spain, Italy, Portugal, etc."
              />
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Suggested for you
              </h2>
              <p className="mt-2 text-slate-500">
                Tap a country to explore its universities
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {ranked.map((c) => (
                <CountryCard key={c.code} country={c} />
              ))}
            </div>
            <Button asChild variant="outline">
              <Link
                href={`/search?tuition=${answers.budget === "minimal" ? "free" : "under10k"}${answers.englishOnly ? "&english=1" : ""}`}
              >
                Browse matching universities
              </Link>
            </Button>
          </section>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={back} disabled={step === 0}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button onClick={() => setStep(0)} variant="secondary">
            Start over
          </Button>
        )}
      </div>
    </div>
  );
}
