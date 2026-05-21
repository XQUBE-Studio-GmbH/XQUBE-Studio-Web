import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the "featuredClients" relationship array to the homepage global.
// This replaces ordering by number field on the clients collection with
// drag-to-reorder in the homepage admin.
//
// Two tables needed (per ERROR 25):
//   home_page_featured_clients          — regular child table (id varchar)
//   _home_page_v_version_featured_clients — version child table (id serial + _uuid)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Regular child table
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_featured_clients";`)
  await db.execute(sql`CREATE TABLE "home_page_featured_clients" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "client_id" integer);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "home_page_featured_clients_order_idx" ON "home_page_featured_clients" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "home_page_featured_clients_parent_idx" ON "home_page_featured_clients" USING btree ("_parent_id");`)

  // Version child table
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_featured_clients";`)
  await db.execute(sql`CREATE TABLE "_home_page_v_version_featured_clients" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" serial PRIMARY KEY NOT NULL, "_uuid" varchar, "client_id" integer);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_home_page_v_version_featured_clients_order_idx" ON "_home_page_v_version_featured_clients" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_home_page_v_version_featured_clients_parent_idx" ON "_home_page_v_version_featured_clients" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_featured_clients";`)
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_featured_clients";`)
}
