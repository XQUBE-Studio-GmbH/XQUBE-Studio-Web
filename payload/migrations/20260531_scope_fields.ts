import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Phase 2 — Project Scoping Tool
// Adds assetTypes child table and new columns to contact_submissions for the scoping form.

export const up = async ({ db }: MigrateUpArgs): Promise<void> => {
  // Child table for the assetTypes array field
  await db.execute(sql`DROP TABLE IF EXISTS "contact_submissions_asset_types";`)
  await db.execute(sql`CREATE TABLE "contact_submissions_asset_types" ("_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "asset_type" varchar, "quantity" numeric);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "contact_submissions_asset_types_order_idx" ON "contact_submissions_asset_types" ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "contact_submissions_asset_types_parent_idx" ON "contact_submissions_asset_types" ("_parent_id");`)

  // New scalar columns on the parent table
  await db.execute(sql`ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "reference_game" varchar;`)
  await db.execute(sql`ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "additional_context" varchar;`)
  await db.execute(sql`ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "brief_source" varchar DEFAULT 'contact-form';`)
  await db.execute(sql`ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "call_booked" boolean DEFAULT false;`)
  await db.execute(sql`ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "call_date_time" timestamp(3) with time zone;`)
}

export const down = async ({ db }: MigrateDownArgs): Promise<void> => {
  await db.execute(sql`DROP TABLE IF EXISTS "contact_submissions_asset_types";`)
  await db.execute(sql`ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "reference_game";`)
  await db.execute(sql`ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "additional_context";`)
  await db.execute(sql`ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "brief_source";`)
  await db.execute(sql`ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "call_booked";`)
  await db.execute(sql`ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "call_date_time";`)
}
