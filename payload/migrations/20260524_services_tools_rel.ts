import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Creates the services_rels table so the services collection can store
// hasMany relationship fields (specifically toolsUsed → tools collection).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_rels" (
      "id"        serial PRIMARY KEY NOT NULL,
      "order"     integer,
      "parent_id" integer NOT NULL,
      "path"      varchar NOT NULL,
      "tools_id"  integer
    );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_rels_order_idx"    ON "services_rels" USING btree ("order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_rels_parent_idx"   ON "services_rels" USING btree ("parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_rels_path_idx"     ON "services_rels" USING btree ("path");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_rels_tools_id_idx" ON "services_rels" USING btree ("tools_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "services_rels";`)
}
