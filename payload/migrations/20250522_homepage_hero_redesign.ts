import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// ─── Migration: Homepage Hero Redesign + About Page Hero Banner ───────────────
//
// Changes:
//  1. home_page     — add hero_mode, hero_video_url
//  2. home_page_hero_slides — new child table (slideshow slides)
//  3. _home_page_v  — add version_hero_mode, version_hero_video_url
//  4. _home_page_v_version_hero_slides — new version child table
//  5. about_page    — add hero_label, hero_heading, hero_subtitle, hero_image_id
//  6. _about_page_v — add version_hero_label, version_hero_heading, etc.
//
// Old home_page hero columns (hero_label, hero_headline, etc.) are left in place
// as unused dead columns — additive migration only, safe for production.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. home_page — add hero_mode and hero_video_url ─────────────────────────
  await db.execute(sql`
    ALTER TABLE "home_page"
      ADD COLUMN IF NOT EXISTS "hero_mode"      varchar DEFAULT 'slideshow',
      ADD COLUMN IF NOT EXISTS "hero_video_url" varchar;
  `)

  // ── 2. home_page_hero_slides — main slides child table ──────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_hero_slides" (
      "_order"               integer NOT NULL,
      "_parent_id"           integer NOT NULL,
      "id"                   varchar PRIMARY KEY NOT NULL,
      "eyebrow"              varchar,
      "title"                varchar,
      "subtitle"             varchar,
      "primary_cta_label"    varchar,
      "primary_cta_url"      varchar,
      "secondary_cta_label"  varchar,
      "secondary_cta_url"    varchar,
      "image_id"             integer
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_hero_slides"
        ADD CONSTRAINT "home_page_hero_slides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_hero_slides"
        ADD CONSTRAINT "home_page_hero_slides_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_hero_slides_order_idx"
      ON "home_page_hero_slides" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_hero_slides_parent_id_idx"
      ON "home_page_hero_slides" USING btree ("_parent_id");
  `)

  // ── 3. _home_page_v — add version_hero_mode and version_hero_video_url ──────
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      ADD COLUMN IF NOT EXISTS "version_hero_mode"      varchar DEFAULT 'slideshow',
      ADD COLUMN IF NOT EXISTS "version_hero_video_url" varchar;
  `)

  // ── 4. _home_page_v_version_hero_slides — version child table ───────────────
  // Version child tables use: id serial PRIMARY KEY + _uuid varchar (ERROR 22 rule)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_home_page_v_version_hero_slides" (
      "_order"               integer NOT NULL,
      "_parent_id"           integer NOT NULL,
      "id"                   serial PRIMARY KEY NOT NULL,
      "_uuid"                varchar,
      "eyebrow"              varchar,
      "title"                varchar,
      "subtitle"             varchar,
      "primary_cta_label"    varchar,
      "primary_cta_url"      varchar,
      "secondary_cta_label"  varchar,
      "secondary_cta_url"    varchar,
      "image_id"             integer
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_hero_slides"
        ADD CONSTRAINT "_home_page_v_version_hero_slides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_home_page_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_hero_slides"
        ADD CONSTRAINT "_home_page_v_version_hero_slides_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_hero_slides_order_idx"
      ON "_home_page_v_version_hero_slides" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_hero_slides_parent_id_idx"
      ON "_home_page_v_version_hero_slides" USING btree ("_parent_id");
  `)

  // ── 5. about_page — add hero banner fields ───────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "about_page"
      ADD COLUMN IF NOT EXISTS "hero_label"    varchar DEFAULT 'About Us',
      ADD COLUMN IF NOT EXISTS "hero_heading"  varchar DEFAULT 'A studio built for precision',
      ADD COLUMN IF NOT EXISTS "hero_subtitle" varchar,
      ADD COLUMN IF NOT EXISTS "hero_image_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page"
        ADD CONSTRAINT "about_page_hero_image_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── 6. _about_page_v — add version hero banner columns ──────────────────────
  await db.execute(sql`
    ALTER TABLE "_about_page_v"
      ADD COLUMN IF NOT EXISTS "version_hero_label"    varchar DEFAULT 'About Us',
      ADD COLUMN IF NOT EXISTS "version_hero_heading"  varchar DEFAULT 'A studio built for precision',
      ADD COLUMN IF NOT EXISTS "version_hero_subtitle" varchar,
      ADD COLUMN IF NOT EXISTS "version_hero_image_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v"
        ADD CONSTRAINT "_about_page_v_version_hero_image_id_fk"
        FOREIGN KEY ("version_hero_image_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove new home_page columns
  await db.execute(sql`
    ALTER TABLE "home_page"
      DROP COLUMN IF EXISTS "hero_mode",
      DROP COLUMN IF EXISTS "hero_video_url";
  `)

  // Drop home_page_hero_slides
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_hero_slides";`)

  // Remove new _home_page_v columns
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      DROP COLUMN IF EXISTS "version_hero_mode",
      DROP COLUMN IF EXISTS "version_hero_video_url";
  `)

  // Drop _home_page_v_version_hero_slides
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_hero_slides";`)

  // Remove about_page hero columns
  await db.execute(sql`
    ALTER TABLE "about_page"
      DROP COLUMN IF EXISTS "hero_label",
      DROP COLUMN IF EXISTS "hero_heading",
      DROP COLUMN IF EXISTS "hero_subtitle",
      DROP COLUMN IF EXISTS "hero_image_id";
  `)

  // Remove _about_page_v hero columns
  await db.execute(sql`
    ALTER TABLE "_about_page_v"
      DROP COLUMN IF EXISTS "version_hero_label",
      DROP COLUMN IF EXISTS "version_hero_heading",
      DROP COLUMN IF EXISTS "version_hero_subtitle",
      DROP COLUMN IF EXISTS "version_hero_image_id";
  `)
}
