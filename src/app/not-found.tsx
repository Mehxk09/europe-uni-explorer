import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-600">This country or university doesn&apos;t exist in our database.</p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
