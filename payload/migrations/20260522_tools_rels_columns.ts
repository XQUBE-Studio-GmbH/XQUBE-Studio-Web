import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds "tools_id" integer column to the two Payload relationship tables that
// require a column for every collection.  The 20260521_tools_collection migration
// created the "tools" table but forgot these two ALTER TABLE statements, which
// caused every admin global page to 500 with:
//   Failed query: select ... "payload_locked_documents__rels"."tools_id" ...

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "tools_id" integer;`)
  await db.execute(sql`ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "tools_id" integer;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "tools_id";`)
  await db.execute(sql`ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "tools_id";`)
}
