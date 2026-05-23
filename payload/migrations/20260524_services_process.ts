import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_process" (
      "_order"      integer      NOT NULL,
      "_parent_id"  integer      NOT NULL,
      "id"          varchar      PRIMARY KEY NOT NULL,
      "step"        varchar      NOT NULL,
      "description" varchar
    );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_process_order_idx"  ON "services_process" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_process_parent_idx" ON "services_process" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "services_process";`)
}
