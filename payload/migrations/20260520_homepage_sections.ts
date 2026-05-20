import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// ─── Migration: Homepage New Sections ─────────────────────────────────────────
//
// Adds all new homepage sections to home_page and _home_page_v:
//   • sections group      — 8 visibility toggle checkboxes
//   • studioIntro group   — label, heading, body1, body2, image, linkLabel, linkUrl
//   • engineBadges array  → home_page_engine_badges child table
//   • process group       — label, heading
//   • process.steps array → home_page_process_steps child table
//   • showreel group      — label, heading, tagline, video
//   • testimonials group  — label, heading
//   • testimonials.items  → home_page_testimonials_items child table
//   • blogPreview group   — label, heading
//
// Additive only — no existing columns dropped.

export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ── 1. home_page — section visibility checkboxes ─────────────────────────────
  await db.execute(sql`
    ALTER TABLE "home_page"
      ADD COLUMN IF NOT EXISTS "sections_show_studio_intro"  boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sections_show_engine_badges" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sections_show_featured_work" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sections_show_services"      boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sections_show_process"       boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sections_show_showreel"      boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "sections_show_testimonials"  boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "sections_show_blog_preview"  boolean DEFAULT false;
  `)

  // ── 2. home_page — studio intro columns ──────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "home_page"
      ADD COLUMN IF NOT EXISTS "studio_intro_label"      varchar DEFAULT 'Who We Are',
      ADD COLUMN IF NOT EXISTS "studio_intro_heading"    varchar,
      ADD COLUMN IF NOT EXISTS "studio_intro_body1"      varchar,
      ADD COLUMN IF NOT EXISTS "studio_intro_body2"      varchar,
      ADD COLUMN IF NOT EXISTS "studio_intro_image_id"   integer,
      ADD COLUMN IF NOT EXISTS "studio_intro_link_label" varchar DEFAULT 'Learn more about us',
      ADD COLUMN IF NOT EXISTS "studio_intro_link_url"   varchar DEFAULT '/about';
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page"
        ADD CONSTRAINT "home_page_studio_intro_image_id_fk"
        FOREIGN KEY ("studio_intro_image_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── 3. home_page — process columns ───────────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "home_page"
      ADD COLUMN IF NOT EXISTS "process_label"   varchar DEFAULT 'How We Work',
      ADD COLUMN IF NOT EXISTS "process_heading"  varchar DEFAULT 'From brief to delivery — every time.';
  `)

  // ── 4. home_page — showreel columns ──────────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "home_page"
      ADD COLUMN IF NOT EXISTS "showreel_label"    varchar DEFAULT 'SHOWREEL 2025',
      ADD COLUMN IF NOT EXISTS "showreel_heading"  varchar DEFAULT 'See the work in motion.',
      ADD COLUMN IF NOT EXISTS "showreel_tagline"  varchar DEFAULT 'AAA game art and XR production — delivered at scale.',
      ADD COLUMN IF NOT EXISTS "showreel_video_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page"
        ADD CONSTRAINT "home_page_showreel_video_id_fk"
        FOREIGN KEY ("showreel_video_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── 5. home_page — testimonials columns ──────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "home_page"
      ADD COLUMN IF NOT EXISTS "testimonials_label"   varchar DEFAULT 'Client Voices',
      ADD COLUMN IF NOT EXISTS "testimonials_heading"  varchar DEFAULT 'Trusted by studios that ship.';
  `)

  // ── 6. home_page — blog preview columns ──────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "home_page"
      ADD COLUMN IF NOT EXISTS "blog_preview_label"   varchar DEFAULT 'From the Studio',
      ADD COLUMN IF NOT EXISTS "blog_preview_heading"  varchar DEFAULT 'Latest insights.';
  `)

  // ── 7. home_page_engine_badges — main child table ─────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_engine_badges" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "name"       varchar NOT NULL,
      "logo_id"    integer
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_engine_badges"
        ADD CONSTRAINT "home_page_engine_badges_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_engine_badges"
        ADD CONSTRAINT "home_page_engine_badges_logo_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_engine_badges_order_idx"
      ON "home_page_engine_badges" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_engine_badges_parent_id_idx"
      ON "home_page_engine_badges" USING btree ("_parent_id");
  `)

  // ── 8. home_page_process_steps — main child table ────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_process_steps" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "icon"        varchar,
      "title"       varchar NOT NULL,
      "description" varchar NOT NULL
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_process_steps"
        ADD CONSTRAINT "home_page_process_steps_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_process_steps_order_idx"
      ON "home_page_process_steps" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_process_steps_parent_id_idx"
      ON "home_page_process_steps" USING btree ("_parent_id");
  `)

  // ── 9. home_page_testimonials_items — main child table ───────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_testimonials_items" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "quote"      varchar NOT NULL,
      "name"       varchar NOT NULL,
      "role"       varchar,
      "avatar_id"  integer
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_testimonials_items"
        ADD CONSTRAINT "home_page_testimonials_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_testimonials_items"
        ADD CONSTRAINT "home_page_testimonials_items_avatar_id_fk"
        FOREIGN KEY ("avatar_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_testimonials_items_order_idx"
      ON "home_page_testimonials_items" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_testimonials_items_parent_id_idx"
      ON "home_page_testimonials_items" USING btree ("_parent_id");
  `)

  // ── 10. _home_page_v — section visibility checkboxes ─────────────────────────
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      ADD COLUMN IF NOT EXISTS "version_sections_show_studio_intro"  boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_sections_show_engine_badges" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_sections_show_featured_work" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_sections_show_services"      boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_sections_show_process"       boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_sections_show_showreel"      boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "version_sections_show_testimonials"  boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "version_sections_show_blog_preview"  boolean DEFAULT false;
  `)

  // ── 11. _home_page_v — studio intro columns ───────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      ADD COLUMN IF NOT EXISTS "version_studio_intro_label"      varchar DEFAULT 'Who We Are',
      ADD COLUMN IF NOT EXISTS "version_studio_intro_heading"    varchar,
      ADD COLUMN IF NOT EXISTS "version_studio_intro_body1"      varchar,
      ADD COLUMN IF NOT EXISTS "version_studio_intro_body2"      varchar,
      ADD COLUMN IF NOT EXISTS "version_studio_intro_image_id"   integer,
      ADD COLUMN IF NOT EXISTS "version_studio_intro_link_label" varchar DEFAULT 'Learn more about us',
      ADD COLUMN IF NOT EXISTS "version_studio_intro_link_url"   varchar DEFAULT '/about';
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v"
        ADD CONSTRAINT "_home_page_v_studio_intro_image_id_fk"
        FOREIGN KEY ("version_studio_intro_image_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── 12. _home_page_v — process columns ───────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      ADD COLUMN IF NOT EXISTS "version_process_label"   varchar DEFAULT 'How We Work',
      ADD COLUMN IF NOT EXISTS "version_process_heading"  varchar DEFAULT 'From brief to delivery — every time.';
  `)

  // ── 13. _home_page_v — showreel columns ──────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      ADD COLUMN IF NOT EXISTS "version_showreel_label"    varchar DEFAULT 'SHOWREEL 2025',
      ADD COLUMN IF NOT EXISTS "version_showreel_heading"  varchar DEFAULT 'See the work in motion.',
      ADD COLUMN IF NOT EXISTS "version_showreel_tagline"  varchar DEFAULT 'AAA game art and XR production — delivered at scale.',
      ADD COLUMN IF NOT EXISTS "version_showreel_video_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v"
        ADD CONSTRAINT "_home_page_v_showreel_video_id_fk"
        FOREIGN KEY ("version_showreel_video_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── 14. _home_page_v — testimonials columns ───────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      ADD COLUMN IF NOT EXISTS "version_testimonials_label"   varchar DEFAULT 'Client Voices',
      ADD COLUMN IF NOT EXISTS "version_testimonials_heading"  varchar DEFAULT 'Trusted by studios that ship.';
  `)

  // ── 15. _home_page_v — blog preview columns ───────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      ADD COLUMN IF NOT EXISTS "version_blog_preview_label"   varchar DEFAULT 'From the Studio',
      ADD COLUMN IF NOT EXISTS "version_blog_preview_heading"  varchar DEFAULT 'Latest insights.';
  `)

  // ── 16. _home_page_v_version_engine_badges — version child table ──────────────
  // Version child tables use id serial PRIMARY KEY + _uuid varchar (ERROR 22 rule)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_home_page_v_version_engine_badges" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial PRIMARY KEY NOT NULL,
      "_uuid"      varchar,
      "name"       varchar,
      "logo_id"    integer
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_engine_badges"
        ADD CONSTRAINT "_home_page_v_version_engine_badges_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_home_page_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_engine_badges"
        ADD CONSTRAINT "_home_page_v_version_engine_badges_logo_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_engine_badges_order_idx"
      ON "_home_page_v_version_engine_badges" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_engine_badges_parent_id_idx"
      ON "_home_page_v_version_engine_badges" USING btree ("_parent_id");
  `)

  // ── 17. _home_page_v_version_process_steps — version child table ──────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_home_page_v_version_process_steps" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          serial PRIMARY KEY NOT NULL,
      "_uuid"       varchar,
      "icon"        varchar,
      "title"       varchar,
      "description" varchar
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_process_steps"
        ADD CONSTRAINT "_home_page_v_version_process_steps_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_home_page_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_process_steps_order_idx"
      ON "_home_page_v_version_process_steps" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_process_steps_parent_id_idx"
      ON "_home_page_v_version_process_steps" USING btree ("_parent_id");
  `)

  // ── 18. _home_page_v_version_testimonials_items — version child table ──────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_home_page_v_version_testimonials_items" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial PRIMARY KEY NOT NULL,
      "_uuid"      varchar,
      "quote"      varchar,
      "name"       varchar,
      "role"       varchar,
      "avatar_id"  integer
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_testimonials_items"
        ADD CONSTRAINT "_home_page_v_version_testimonials_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_home_page_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_testimonials_items"
        ADD CONSTRAINT "_home_page_v_version_testimonials_items_avatar_id_fk"
        FOREIGN KEY ("avatar_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_testimonials_items_order_idx"
      ON "_home_page_v_version_testimonials_items" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_home_page_v_version_testimonials_items_parent_id_idx"
      ON "_home_page_v_version_testimonials_items" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop version child tables
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_testimonials_items";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_process_steps";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_engine_badges";`)

  // Drop main child tables
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_testimonials_items";`)
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_process_steps";`)
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_engine_badges";`)

  // Remove _home_page_v columns
  await db.execute(sql`
    ALTER TABLE "_home_page_v"
      DROP COLUMN IF EXISTS "version_sections_show_studio_intro",
      DROP COLUMN IF EXISTS "version_sections_show_engine_badges",
      DROP COLUMN IF EXISTS "version_sections_show_featured_work",
      DROP COLUMN IF EXISTS "version_sections_show_services",
      DROP COLUMN IF EXISTS "version_sections_show_process",
      DROP COLUMN IF EXISTS "version_sections_show_showreel",
      DROP COLUMN IF EXISTS "version_sections_show_testimonials",
      DROP COLUMN IF EXISTS "version_sections_show_blog_preview",
      DROP COLUMN IF EXISTS "version_studio_intro_label",
      DROP COLUMN IF EXISTS "version_studio_intro_heading",
      DROP COLUMN IF EXISTS "version_studio_intro_body1",
      DROP COLUMN IF EXISTS "version_studio_intro_body2",
      DROP COLUMN IF EXISTS "version_studio_intro_image_id",
      DROP COLUMN IF EXISTS "version_studio_intro_link_label",
      DROP COLUMN IF EXISTS "version_studio_intro_link_url",
      DROP COLUMN IF EXISTS "version_process_label",
      DROP COLUMN IF EXISTS "version_process_heading",
      DROP COLUMN IF EXISTS "version_showreel_label",
      DROP COLUMN IF EXISTS "version_showreel_heading",
      DROP COLUMN IF EXISTS "version_showreel_tagline",
      DROP COLUMN IF EXISTS "version_showreel_video_id",
      DROP COLUMN IF EXISTS "version_testimonials_label",
      DROP COLUMN IF EXISTS "version_testimonials_heading",
      DROP COLUMN IF EXISTS "version_blog_preview_label",
      DROP COLUMN IF EXISTS "version_blog_preview_heading";
  `)

  // Remove home_page columns
  await db.execute(sql`
    ALTER TABLE "home_page"
      DROP COLUMN IF EXISTS "sections_show_studio_intro",
      DROP COLUMN IF EXISTS "sections_show_engine_badges",
      DROP COLUMN IF EXISTS "sections_show_featured_work",
      DROP COLUMN IF EXISTS "sections_show_services",
      DROP COLUMN IF EXISTS "sections_show_process",
      DROP COLUMN IF EXISTS "sections_show_showreel",
      DROP COLUMN IF EXISTS "sections_show_testimonials",
      DROP COLUMN IF EXISTS "sections_show_blog_preview",
      DROP COLUMN IF EXISTS "studio_intro_label",
      DROP COLUMN IF EXISTS "studio_intro_heading",
      DROP COLUMN IF EXISTS "studio_intro_body1",
      DROP COLUMN IF EXISTS "studio_intro_body2",
      DROP COLUMN IF EXISTS "studio_intro_image_id",
      DROP COLUMN IF EXISTS "studio_intro_link_label",
      DROP COLUMN IF EXISTS "studio_intro_link_url",
      DROP COLUMN IF EXISTS "process_label",
      DROP COLUMN IF EXISTS "process_heading",
      DROP COLUMN IF EXISTS "showreel_label",
      DROP COLUMN IF EXISTS "showreel_heading",
      DROP COLUMN IF EXISTS "showreel_tagline",
      DROP COLUMN IF EXISTS "showreel_video_id",
      DROP COLUMN IF EXISTS "testimonials_label",
      DROP COLUMN IF EXISTS "testimonials_heading",
      DROP COLUMN IF EXISTS "blog_preview_label",
      DROP COLUMN IF EXISTS "blog_preview_heading";
  `)
}
