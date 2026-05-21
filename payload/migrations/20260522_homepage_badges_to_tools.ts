import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Converts the homepage Engine Badges from an inline array (name + logo_id columns)
// to a relationship array pointing at the tools collection (tool_id integer).
//
// The old "home_page_engine_badges" table had: _order, _parent_id, id (varchar), name, logo_id
// The new table has:                           _order, _parent_id, id (varchar), tool_id
//
// Existing badge data is dropped — content editors re-add badges by selecting
// Tools from the relationship picker in the homepage admin.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_engine_badges";`)
  await db.execute(sql`CREATE TABLE "home_page_engine_badges" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "tool_id" integer);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "home_page_engine_badges_order_idx" ON "home_page_engine_badges" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "home_page_engine_badges_parent_idx" ON "home_page_engine_badges" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_engine_badges";`)
  await db.execute(sql`CREATE TABLE "home_page_engine_badges" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "name" varchar, "logo_id" integer);`)
}
