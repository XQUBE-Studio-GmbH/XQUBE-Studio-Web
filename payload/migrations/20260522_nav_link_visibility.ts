import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds a "visible" boolean column to the navigation mainNav array child table
// and its version counterpart, enabling per-link show/hide from the admin.
// Defaults to true so all existing links remain visible after migration.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "navigation_main_nav" ADD COLUMN IF NOT EXISTS "visible" boolean DEFAULT true;`)
  await db.execute(sql`ALTER TABLE "_navigation_v_version_main_nav" ADD COLUMN IF NOT EXISTS "visible" boolean DEFAULT true;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "navigation_main_nav" DROP COLUMN IF EXISTS "visible";`)
  await db.execute(sql`ALTER TABLE "_navigation_v_version_main_nav" DROP COLUMN IF EXISTS "visible";`)
}
