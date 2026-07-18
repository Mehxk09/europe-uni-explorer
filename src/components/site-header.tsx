"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Countries" },
  { href: "/search", label: "Search" },
  { href: "/wizard", label: "Guide" },
  { href: "/shortlist", label: "Saved" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="shell flex h-[4.5rem] items-center justify-between gap-4 bg-transparent lg:h-20">
      <Link href="/" className="flex shrink-0 items-center gap-3">
        <span className="logo-icon flex h-10 w-10 items-center justify-center rounded-2xl text-white transition-transform hover:scale-105">
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className="text-heading text-base font-semibold tracking-tight">Uni Explorer</span>
      </Link>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <nav className="flex flex-wrap items-center gap-2">
          {links.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/countries")
                : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`nav-pill ${active ? "nav-pill-active" : ""}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function PageMain({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={`page pt-6 lg:pt-8 ${className}`}>{children}</main>;
}

export function PageTitle({
  children,
  subtitle,
  emoji,
}: {
  children: React.ReactNode;
  subtitle?: string;
  emoji?: string;
  badge?: React.ReactNode;
}) {
  return (
    <header className="mb-10">
      <h1 className="text-heading text-3xl font-semibold tracking-tight lg:text-4xl">
        {emoji && <span className="mr-2">{emoji}</span>}
        {children}
      </h1>
      {subtitle && <p className="text-muted mt-3 text-base leading-relaxed">{subtitle}</p>}
    </header>
  );
}
