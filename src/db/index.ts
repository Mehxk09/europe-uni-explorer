import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import os from "os";
import path from "path";

import * as schema from "./schema";

function resolveDatabasePath(): string {
  const source = path.join(process.cwd(), "data", "euro-uni.db");

  if (!fs.existsSync(source)) {
    throw new Error(
      `SQLite database not found at ${source}. Run npm run db:sync locally or ensure data/euro-uni.db is deployed.`,
    );
  }

  // Vercel serverless: project files are read-only — copy DB to /tmp so SQLite can open it
  if (process.env.VERCEL === "1") {
    const tmpDb = path.join(os.tmpdir(), "euro-uni.db");
    const srcStat = fs.statSync(source);
    const needsCopy =
      !fs.existsSync(tmpDb) ||
      fs.statSync(tmpDb).size !== srcStat.size ||
      fs.statSync(tmpDb).mtimeMs < srcStat.mtimeMs;

    if (needsCopy) {
      fs.copyFileSync(source, tmpDb);
    }
    return tmpDb;
  }

  return source;
}

const dbPath = resolveDatabasePath();
const sqlite = new Database(dbPath);

if (process.env.VERCEL !== "1") {
  sqlite.pragma("journal_mode = WAL");
}

export const db = drizzle(sqlite, { schema });
