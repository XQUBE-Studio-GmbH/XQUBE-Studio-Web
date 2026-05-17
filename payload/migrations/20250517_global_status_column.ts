import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// When versions: { drafts: true } is enabled on a global, Payload adds a
// `_status` column to the MAIN global table (not just the _v version table).
// This migration adds that column to all 6 globals that have drafts enabled.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add _status column to each global table (IF NOT EXISTS for idempotency)
  await db.execute(sql`ALTER TABLE "home_page"     ADD COLUMN IF NOT EXISTS "_status" varchar DEFAULT 'draft';`)
  await db.execute(sql`ALTER TABLE "about_page"    ADD COLUMN IF NOT EXISTS "_status" varchar DEFAULT 'draft';`)
  await db.execute(sql`ALTER TABLE "contact_page"  ADD COLUMN IF NOT EXISTS "_status" varchar DEFAULT 'draft';`)
  await db.execute(sql`ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "_status" varchar DEFAULT 'draft';`)
  await db.execute(sql`ALTER TABLE "navigation"    ADD COLUMN IF NOT EXISTS "_status" varchar DEFAULT 'draft';`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "_status" varchar DEFAULT 'draft';`)

  // Indexes on _status (Payload queries these frequently for draft/published filtering)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "home_page_status_idx"     ON "home_page"     USING btree ("_status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "about_page_status_idx"    ON "about_page"    USING btree ("_status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "contact_page_status_idx"  ON "contact_page"  USING btree ("_status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_page_status_idx" ON "services_page" USING btree ("_status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "navigation_status_idx"    ON "navigation"    USING btree ("_status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "site_settings_status_idx" ON "site_settings" USING btree ("_status");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "home_page"     DROP COLUMN IF EXISTS "_status";`)
  await db.execute(sql`ALTER TABLE "about_page"    DROP COLUMN IF EXISTS "_status";`)
  await db.execute(sql`ALTER TABLE "contact_page"  DROP COLUMN IF EXISTS "_status";`)
  await db.execute(sql`ALTER TABLE "services_page" DROP COLUMN IF EXISTS "_status";`)
  await db.execute(sql`ALTER TABLE "navigation"    DROP COLUMN IF EXISTS "_status";`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "_status";`)
}
