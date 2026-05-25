import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// ─── Migration: Homepage Engagement Models visibility toggle ──────────────────
//
// Adds sections_show_engagement_models boolean to home_page and
// version_sections_show_engagement_models to _home_page_v.
// Defaults to true so the section is visible immediately on deploy.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "sections_show_engagement_models" boolean DEFAULT true;`)
  await db.execute(sql`ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_sections_show_engagement_models" boolean DEFAULT true;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "home_page" DROP COLUMN IF EXISTS "sections_show_engagement_models";`)
  await db.execute(sql`ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_sections_show_engagement_models";`)
}
