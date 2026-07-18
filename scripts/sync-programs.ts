import fs from "fs";
import path from "path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { eq } from "drizzle-orm";

import curatedPrograms from "../data/curated-programs.json";
import { programs, universities } from "../src/db/schema";

interface CuratedProgram {
  id: string;
  universityId: string;
  name: string;
  degreeLevel: string;
  language: string;
  fields: string[];
  url?: string;
  description?: string;
}

function ensureDataDir(dbPath: string) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

async function main() {
  const dbPath = path.join(process.cwd(), "data", "euro-uni.db");
  ensureDataDir(dbPath);

  const sqlite = new Database(dbPath);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS programs (
      id TEXT PRIMARY KEY,
      university_id TEXT NOT NULL REFERENCES universities(id),
      name TEXT NOT NULL,
      degree_level TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'en',
      fields TEXT NOT NULL,
      url TEXT,
      description TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_programs_university ON programs(university_id);
  `);

  const db = drizzle(sqlite);
  const rows = curatedPrograms as CuratedProgram[];
  let synced = 0;
  let skipped = 0;

  for (const row of rows) {
    const [uni] = await db
      .select({ id: universities.id })
      .from(universities)
      .where(eq(universities.id, row.universityId))
      .limit(1);

    if (!uni) {
      console.warn(`  skip ${row.id} — university ${row.universityId} not in DB`);
      skipped++;
      continue;
    }

    await db
      .insert(programs)
      .values({
        id: row.id,
        universityId: row.universityId,
        name: row.name,
        degreeLevel: row.degreeLevel,
        language: row.language,
        fields: JSON.stringify(row.fields),
        url: row.url ?? null,
        description: row.description ?? null,
      })
      .onConflictDoUpdate({
        target: programs.id,
        set: {
          universityId: row.universityId,
          name: row.name,
          degreeLevel: row.degreeLevel,
          language: row.language,
          fields: JSON.stringify(row.fields),
          url: row.url ?? null,
          description: row.description ?? null,
        },
      });
    synced++;
  }

  console.log(`Synced ${synced} programs (${skipped} skipped — uni not found).`);
  sqlite.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
