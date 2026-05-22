import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the "legalNote" field to site-settings global so the footer legal line
// ("GmbH registered in Vienna, Austria. GDPR compliant.") is editable from admin.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "legal_note" varchar;`)
  await db.execute(sql`ALTER TABLE "_site_settings_v" ADD COLUMN IF NOT EXISTS "version_legal_note" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "legal_note";`)
  await db.execute(sql`ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_legal_note";`)
}
