import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds editable label + heading for the Featured Work section on the homepage.
// Previously hardcoded in HomePageClient.tsx — now driven from the home-page global.
// Two columns per table (main + version).

export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ── home_page (published data) ────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "featured_work_label"   varchar;`)
  await db.execute(sql`ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "featured_work_heading" varchar;`)

  // ── _home_page_v (draft / version data) ──────────────────────────────────
  await db.execute(sql`ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_featured_work_label"   varchar;`)
  await db.execute(sql`ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_featured_work_heading" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "home_page"    DROP COLUMN IF EXISTS "featured_work_label";`)
  await db.execute(sql`ALTER TABLE "home_page"    DROP COLUMN IF EXISTS "featured_work_heading";`)
  await db.execute(sql`ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_featured_work_label";`)
  await db.execute(sql`ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_featured_work_heading";`)
}
