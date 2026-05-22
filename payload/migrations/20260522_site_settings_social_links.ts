import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Replaces the hardcoded linkedin/artstation fields in site-settings with a
// dynamic socialLinks array. Each entry has label, url, and optional icon upload.
//
// The old linkedin/artstation columns on site_settings are left in place
// (harmless, Payload simply ignores undefined fields).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Regular child table
  await db.execute(sql`DROP TABLE IF EXISTS "site_settings_contact_social_links";`)
  await db.execute(sql`CREATE TABLE "site_settings_contact_social_links" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "label" varchar, "url" varchar, "icon_id" integer);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "site_settings_contact_social_links_order_idx" ON "site_settings_contact_social_links" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "site_settings_contact_social_links_parent_idx" ON "site_settings_contact_social_links" USING btree ("_parent_id");`)

  // Version child table (id serial + _uuid per ERROR 22/25 convention)
  await db.execute(sql`DROP TABLE IF EXISTS "_site_settings_v_version_contact_social_links";`)
  await db.execute(sql`CREATE TABLE "_site_settings_v_version_contact_social_links" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" serial PRIMARY KEY NOT NULL, "_uuid" varchar, "label" varchar, "url" varchar, "icon_id" integer);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_site_settings_v_version_contact_social_links_order_idx" ON "_site_settings_v_version_contact_social_links" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_site_settings_v_version_contact_social_links_parent_idx" ON "_site_settings_v_version_contact_social_links" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_site_settings_v_version_contact_social_links";`)
  await db.execute(sql`DROP TABLE IF EXISTS "site_settings_contact_social_links";`)
}
