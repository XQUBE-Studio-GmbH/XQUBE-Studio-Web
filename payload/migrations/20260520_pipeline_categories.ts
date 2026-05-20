import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds categoryLabel + categoryOrder to the pipelines child tables.
// These two columns are the only change — existing pipeline rows are untouched.
// categoryLabel  = tab name, e.g. "Modeling", "Texturing", "Rigging"
// categoryOrder  = controls which tab comes first (lower = earlier)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Live data table
  await db.execute(sql`ALTER TABLE "services_page_pipelines" ADD COLUMN IF NOT EXISTS "category_label" varchar;`)
  await db.execute(sql`ALTER TABLE "services_page_pipelines" ADD COLUMN IF NOT EXISTS "category_order" integer;`)

  // Version / draft table (same columns required by Payload for drafts to work)
  await db.execute(sql`ALTER TABLE "_services_page_v_version_pipelines" ADD COLUMN IF NOT EXISTS "category_label" varchar;`)
  await db.execute(sql`ALTER TABLE "_services_page_v_version_pipelines" ADD COLUMN IF NOT EXISTS "category_order" integer;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "services_page_pipelines" DROP COLUMN IF EXISTS "category_label";`)
  await db.execute(sql`ALTER TABLE "services_page_pipelines" DROP COLUMN IF EXISTS "category_order";`)
  await db.execute(sql`ALTER TABLE "_services_page_v_version_pipelines" DROP COLUMN IF EXISTS "category_label";`)
  await db.execute(sql`ALTER TABLE "_services_page_v_version_pipelines" DROP COLUMN IF EXISTS "category_order";`)
}
