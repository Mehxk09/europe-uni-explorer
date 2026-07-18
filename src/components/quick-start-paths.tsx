import Link from "next/link";
import { HelpCircle, Languages, Wallet } from "lucide-react";

const paths = [
  { href: "/search?tuition=free&english=1", icon: Wallet, title: "Cheapest options", desc: "Free tuition + English" },
  { href: "/search?living=under800", icon: Languages, title: "Low living costs", desc: "Under ~€800/month" },
  { href: "/wizard", icon: HelpCircle, title: "Help me choose", desc: "5 quick questions" },
];

export function QuickStartPaths() {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">Quick start</h2>
      <p className="mb-4 text-sm text-slate-600">Not sure where to begin? Try one of these.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {paths.map((path) => (
          <Link key={path.href} href={path.href} className="card flex items-start gap-3 p-4 transition">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <path.icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900">{path.title}</h3>
              <p className="text-sm text-slate-500">{path.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
