import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds:
//   1. "tools" collection table — shared tool/software library with logo upload
//   2. "portfolio_tools_used" child table — relationship-based tool tags on portfolio items
//   3. "folder" column on "media" table — basic folder organisation for the media library
//
// NOTE: FK constraints are declared inline inside CREATE TABLE IF NOT EXISTS.
// When the table already exists (IF NOT EXISTS no-op), the FK is skipped cleanly.
// DO $$ ... $$ blocks are NOT used — Drizzle's sql tag mishandles $$ dollar-quoting.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. tools table (FK inline so IF NOT EXISTS handles re-runs safely) ───
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tools" (
      "id"         varchar PRIMARY KEY NOT NULL,
      "name"       varchar NOT NULL,
      "category"   varchar,
      "logo_id"    varchar REFERENCES "media"("id") ON DELETE SET NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "tools_name_idx"     ON "tools" ("name");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "tools_category_idx" ON "tools" ("category");`)

  // ── 2. portfolio_tools_used child table ──────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_tools_used" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL REFERENCES "portfolio"("id") ON DELETE CASCADE,
      "id"         varchar PRIMARY KEY NOT NULL,
      "tool_id"    varchar REFERENCES "tools"("id") ON DELETE SET NULL
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_tools_used_order_idx"  ON "portfolio_tools_used" ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_tools_used_parent_idx" ON "portfolio_tools_used" ("_parent_id");`)

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
