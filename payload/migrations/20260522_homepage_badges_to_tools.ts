import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Converts the homepage Engine Badges from an inline array (name + logo_id)
// to a relationship array pointing at the tools collection (tool_id integer).
//
// Data is preserved:
//   1. Add tool_id column to existing home_page_engine_badges table
//   2. INSERT a tools row for each unique badge (copies name + logo_id)
//   3. UPDATE each badge row with the new tool id
//   4. DROP the now-redundant name and logo_id columns

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Add tool_id without touching existing rows
  await db.execute(sql`ALTER TABLE "home_page_engine_badges" ADD COLUMN IF NOT EXISTS "tool_id" integer;`)

  // 2. Create a tool record for every existing badge (name + logo preserved)
  await db.execute(sql`INSERT INTO "tools" ("name", "logo_id", "updated_at", "created_at") SELECT "name", "logo_id", now(), now() FROM "home_page_engine_badges" WHERE "name" IS NOT NULL;`)

  // 3. Point each badge row at its freshly created tool record
  await db.execute(sql`UPDATE "home_page_engine_badges" SET "tool_id" = t."id" FROM "tools" t WHERE "home_page_engine_badges"."name" = t."name";`)

  // 4. Remove the inline columns — data now lives in the tools table
  await db.execute(sql`ALTER TABLE "home_page_engine_badges" DROP COLUMN IF EXISTS "name";`)
  await db.execute(sql`ALTER TABLE "home_page_engine_badges" DROP COLUMN IF EXISTS "logo_id";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore inline columns and repopulate from tools
  await db.execute(sql`ALTER TABLE "home_page_engine_badges" ADD COLUMN IF NOT EXISTS "name" varchar;`)
  await db.execute(sql`ALTER TABLE "home_page_engine_badges" ADD COLUMN IF NOT EXISTS "logo_id" integer;`)
  await db.execute(sql`UPDATE "home_page_engine_badges" SET "name" = t."name", "logo_id" = t."logo_id" FROM "tools" t WHERE "home_page_engine_badges"."tool_id" = t."id";`)
  await db.execute(sql`ALTER TABLE "home_page_engine_badges" DROP COLUMN IF EXISTS "tool_id";`)
}
