import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer-bar mt-auto py-8">
      <div className="shell flex items-center justify-between text-sm">
        <span className="text-muted">Uni Explorer</span>
        <Link href="/about-data" className="text-muted transition hover:text-blue-500">
          About the data
        </Link>
      </div>
    </footer>
  );
}
