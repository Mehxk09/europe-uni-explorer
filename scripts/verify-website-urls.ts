import fs from "fs";
import path from "path";

import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";

import websiteOverrides from "../data/website-overrides.json";
import { universities } from "../src/db/schema";
import { resolveWebsiteUrl } from "../src/lib/website-url";

const OVERRIDE_MAP = websiteOverrides as Record<string, string>;
const CONCURRENCY = 40;
const TIMEOUT_MS = 8000;

async function urlReachable(url: string): Promise<boolean> {
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "User-Agent": "EuroUniExplorer/1.0 (link verification)" },
      });
      if (res.ok || res.status === 403 || res.status === 405) return true;
    } catch {
      // try next method / candidate
    }
  }
  return false;
}

async function pickWorkingUrl(heiId: string): Promise<string | null> {
  if (OVERRIDE_MAP[heiId]) return OVERRIDE_MAP[heiId];

  const candidates = [`https://${heiId}`, `https://www.${heiId}`];
  for (const url of candidates) {
    if (await urlReachable(url)) return url;
  }
  return null;
}

async function runPool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const item = items[next++];
      await fn(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
}

async function main() {
  const dbPath = path.join(process.cwd(), "data", "euro-uni.db");
  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite);

  const logPath = path.join(process.cwd(), "data", "unreachable-websites.log");
  fs.writeFileSync(logPath, "");

  const rows = await db.select({ id: universities.id, websiteUrl: universities.websiteUrl }).from(universities);

  console.log(`Verifying ${rows.length} university website URLs...`);

  let fixed = 0;
  let unreachable = 0;

  await runPool(rows, CONCURRENCY, async (row) => {
    const override = resolveWebsiteUrl(row.id, row.websiteUrl);
    if (override && OVERRIDE_MAP[row.id] && override !== row.websiteUrl) {
      await db.update(universities).set({ websiteUrl: override }).where(eq(universities.id, row.id));
      fixed++;
      return;
    }

    const working = await pickWorkingUrl(row.id);
    if (working && working !== row.websiteUrl) {
      await db.update(universities).set({ websiteUrl: working }).where(eq(universities.id, row.id));
      fixed++;
    } else if (!working) {
      unreachable++;
      fs.appendFileSync(logPath, `${row.id}\n`);
    }
  });

  console.log(`Done. Updated ${fixed} URLs. Unreachable: ${unreachable}.`);
  sqlite.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
