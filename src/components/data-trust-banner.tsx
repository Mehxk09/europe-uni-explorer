import Link from "next/link";

export function DataTrustBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="rounded-2xl border border-blue-200/60 bg-blue-50/70 px-4 py-3 text-sm leading-relaxed text-[var(--text-muted)] dark:border-blue-900/40 dark:bg-blue-950/30">
        💡 Uni names are official. Tuition & living costs are rough guides —{" "}
        <Link href="/about-data" className="font-medium text-[var(--accent-text)] hover:underline">
          see what&apos;s verified
        </Link>
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-pink-50 p-6">
      <p className="text-lg font-semibold text-stone-800">
        Quick note on accuracy ✦
      </p>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        University names come from the official EU registry. Costs & English notes are
        estimates to help you compare — always double-check before applying.
      </p>
      <Link
        href="/about-data"
        className="mt-3 inline-block text-sm font-medium text-violet-600 hover:underline"
      >
        Full breakdown →
      </Link>
    </div>
  );
}
