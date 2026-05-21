import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// When engineBadges changed from an inline array (name + logo_id) to a
// relationship array (tool_id), the non-version child table was updated by
// 20260522_homepage_badges_to_tools. But the version child table
// "_home_page_v_version_engine_badges" also needs the same schema change.
//
// Version child tables use:  id serial PRIMARY KEY (not varchar), _uuid varchar
// Regular child tables use:  id varchar PRIMARY KEY
//
// Version history is not critical data — drop and recreate is safe.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_engine_badges";`)
  await db.execute(sql`CREATE TABLE "_home_page_v_version_engine_badges" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" serial PRIMARY KEY NOT NULL, "_uuid" varchar, "tool_id" integer);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_home_page_v_version_engine_badges_order_idx" ON "_home_page_v_version_engine_badges" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_home_page_v_version_engine_badges_parent_idx" ON "_home_page_v_version_engine_badges" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_engine_badges";`)
  await db.execute(sql`CREATE TABLE "_home_page_v_version_engine_badges" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" serial PRIMARY KEY NOT NULL, "_uuid" varchar, "name" varchar, "logo_id" integer);`)
}
