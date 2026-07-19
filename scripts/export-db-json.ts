import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

import type { StudyInterestId } from "../src/lib/uni-display";

const root = process.cwd();
const dbPath = path.join(root, "data", "euro-uni.db");
const outDir = path.join(root, "data");

if (!fs.existsSync(dbPath)) {
  console.error("Missing data/euro-uni.db — run npm run db:sync first.");
  process.exit(1);
}

const sqlite = new Database(dbPath, { readonly: true });

const universities = sqlite
  .prepare(
    `SELECT id, name, label, country_code as countryCode, city, website_url as websiteUrl,
            postal_code as postalCode, hei_api_url as heiApiUrl
     FROM universities ORDER BY name`,
  )
  .all();

const programRows = sqlite
  .prepare(
    `SELECT id, university_id as universityId, name, degree_level as degreeLevel,
            language, fields, url, description
     FROM programs ORDER BY name`,
  )
  .all() as {
  id: string;
  universityId: string;
  name: string;
  degreeLevel: string;
  language: string;
  fields: string;
  url: string | null;
  description: string | null;
}[];

const programs = programRows.map((row) => ({
  id: row.id,
  universityId: row.universityId,
  name: row.name,
  degreeLevel: row.degreeLevel,
  language: row.language,
  fields: JSON.parse(row.fields) as StudyInterestId[],
  url: row.url,
  description: row.description,
}));

fs.writeFileSync(
  path.join(outDir, "universities.json"),
  JSON.stringify(universities),
);
fs.writeFileSync(path.join(outDir, "programs.json"), JSON.stringify(programs));

console.log(`Exported ${universities.length} universities and ${programs.length} programs.`);
