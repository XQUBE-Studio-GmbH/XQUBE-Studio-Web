import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds:
//   1. "tools" collection table — shared tool/software library with logo upload
//   2. "portfolio_tools_used" child table — relationship-based tool tags on portfolio items
//   3. "folder" column on "media" table — basic folder organisation for the media library
//
// Pattern notes:
//   - DROP IF EXISTS before CREATE (no IF NOT EXISTS on CREATE) — handles re-runs on empty tables
//   - No FK/REFERENCES constraints — Drizzle/PgBouncer rejects REFERENCES in CREATE TABLE
//   - Single-line statements only — avoids multiline template edge cases

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. tools table ────────────────────────────────────────────────────────
  // Drop child table first (FK dependency order), then parent
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_tools_used";`)
  await db.execute(sql`DROP TABLE IF EXISTS "tools";`)

  await db.execute(sql`CREATE TABLE "tools" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "category" varchar, "logo_id" varchar, "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL, "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL);`)
  await db.execute(sql`CREATE INDEX "tools_name_idx" ON "tools" ("name");`)
  await db.execute(sql`CREATE INDEX "tools_category_idx" ON "tools" ("category");`)

  // ── 2. portfolio_tools_used child table ──────────────────────────────────
  await db.execute(sql`CREATE TABLE "portfolio_tools_used" ("_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "tool_id" varchar);`)
  await db.execute(sql`CREATE INDEX "portfolio_tools_used_order_idx"  ON "portfolio_tools_used" ("_order");`)
  await db.execute(sql`CREATE INDEX "portfolio_tools_used_parent_idx" ON "portfolio_tools_used" ("_parent_id");`)

  // ── 3. media folder column ────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "folder" varchar;`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "media_folder_idx" ON "media" ("folder");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "media_folder_idx";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "folder";`)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_tools_used";`)
  await db.execute(sql`DROP INDEX IF EXISTS "tools_category_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "tools_name_idx";`)
  await db.execute(sql`DROP TABLE IF EXISTS "tools";`)
}
