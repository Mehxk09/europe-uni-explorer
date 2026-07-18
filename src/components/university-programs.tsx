import { ExternalLink, GraduationCap } from "lucide-react";

import type { ProgramRecord } from "@/lib/types";

const DEGREE_LABEL: Record<string, string> = {
  bachelor: "Bachelor",
  master: "Master",
  phd: "PhD",
};

export function UniversityPrograms({ programs }: { programs: ProgramRecord[] }) {
  if (programs.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="section-head">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--text-heading)]">
          <GraduationCap className="h-5 w-5 text-[var(--accent-text)]" />
          Programmes we track
        </h2>
        <p>
          {programs.length} curated {programs.length === 1 ? "programme" : "programmes"} in IT,
          AI, web, and creative tech — with links to apply.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {programs.map((program) => (
          <article key={program.id} className="uni-card uni-card-loose">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-heading)]">{program.name}</h3>
                {program.description && (
                  <p className="text-muted mt-2 text-sm leading-relaxed">{program.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="chip chip-field">
                    {DEGREE_LABEL[program.degreeLevel] ?? program.degreeLevel}
                  </span>
                  <span className="chip chip-english">
                    {program.language === "en" ? "English" : program.language.toUpperCase()}
                  </span>
                  {program.fields.map((field) => (
                    <span key={field} className="chip">
                      {field.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
              {program.url && (
                <a
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost shrink-0"
                >
                  Programme page
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
