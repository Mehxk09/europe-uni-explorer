import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const countries = sqliteTable("countries", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  tuitionTier: text("tuition_tier").notNull().default("mixed"),
  tuitionIntl: text("tuition_intl"),
  tuitionFreeForEU: integer("tuition_free_for_eu", { mode: "boolean" }).default(
    false,
  ),
  englishPrograms: text("english_programs").notNull().default("limited"),
  avgLivingEur: integer("avg_living_eur").notNull().default(1000),
  deadlineNotes: text("deadline_notes"),
  officialPortal: text("official_portal"),
  visaLink: text("visa_link"),
  bachelorsPortalUrl: text("bachelors_portal_url"),
  mastersPortalUrl: text("masters_portal_url"),
});

export const universities = sqliteTable("universities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  label: text("label"),
  countryCode: text("country_code")
    .notNull()
    .references(() => countries.code),
  city: text("city"),
  websiteUrl: text("website_url"),
  postalCode: text("postal_code"),
  heiApiUrl: text("hei_api_url"),
});

export const programs = sqliteTable("programs", {
  id: text("id").primaryKey(),
  universityId: text("university_id")
    .notNull()
    .references(() => universities.id),
  name: text("name").notNull(),
  degreeLevel: text("degree_level").notNull(),
  language: text("language").notNull().default("en"),
  fields: text("fields").notNull(),
  url: text("url"),
  description: text("description"),
});

export type Country = typeof countries.$inferSelect;
export type University = typeof universities.$inferSelect;
export type Program = typeof programs.$inferSelect;
