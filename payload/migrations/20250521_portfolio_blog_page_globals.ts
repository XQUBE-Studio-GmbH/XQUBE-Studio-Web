import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds two new page globals — portfolio-page and blog-page — each with a
// CMS-managed hero section (label, heading, subtitle, image).
// portfolio-page also has hero CTA fields (ctaLabel, ctaUrl).
// Both get versions/drafts/autosave, so we create both the main table and
// the _v version table, including version_updated_at / version_created_at
// (Payload wraps global base timestamps inside the version group — see ERROR 21).

export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ── Main tables ───────────────────────────────────────────────────────────

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_page" (
      "id"              serial PRIMARY KEY NOT NULL,
      "hero_label"      varchar DEFAULT 'Our Work',
      "hero_heading"    varchar DEFAULT 'AAA Game Art. Delivered.',
      "hero_subtitle"   varchar DEFAULT 'Browse our portfolio of AAA-quality game art produced for studios worldwide — characters, weapons, environments, and XR assets.',
      "hero_image_id"   integer,
      "hero_cta_label"  varchar DEFAULT 'Start a Project',
      "hero_cta_url"    varchar DEFAULT '/contact',
      "_status"         varchar DEFAULT 'draft',
      "updated_at"      timestamp(3) with time zone,
      "created_at"      timestamp(3) with time zone
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "blog_page" (
      "id"            serial PRIMARY KEY NOT NULL,
      "hero_label"    varchar DEFAULT 'Insights',
      "hero_heading"  varchar DEFAULT 'Behind the Studio',
      "hero_subtitle" varchar DEFAULT 'Thoughts on game art production, XR development, and studio operations from the XQube team.',
      "hero_image_id" integer,
      "_status"       varchar DEFAULT 'draft',
      "updated_at"    timestamp(3) with time zone,
      "created_at"    timestamp(3) with time zone
    );
  `)

  // ── Status indexes on main tables ─────────────────────────────────────────

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_page_status_idx" ON "portfolio_page" USING btree ("_status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "blog_page_status_idx"      ON "blog_page"      USING btree ("_status");`)

  // ── Version tables ────────────────────────────────────────────────────────

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_portfolio_page_v" (
      "id"                       serial PRIMARY KEY NOT NULL,
      "version_hero_label"       varchar,
      "version_hero_heading"     varchar,
      "version_hero_subtitle"    varchar,
      "version_hero_image_id"    integer,
      "version_hero_cta_label"   varchar,
      "version_hero_cta_url"     varchar,
      "version__status"          varchar DEFAULT 'draft',
      "version_updated_at"       timestamp(3) with time zone,
      "version_created_at"       timestamp(3) with time zone,
      "created_at"               timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"               timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                   boolean,
      "autosave"                 boolean
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_blog_page_v" (
      "id"                    serial PRIMARY KEY NOT NULL,
      "version_hero_label"    varchar,
      "version_hero_heading"  varchar,
      "version_hero_subtitle" varchar,
      "version_hero_image_id" integer,
      "version__status"       varchar DEFAULT 'draft',
      "version_updated_at"    timestamp(3) with time zone,
      "version_created_at"    timestamp(3) with time zone,
      "created_at"            timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"            timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                boolean,
      "autosave"              boolean
    );
  `)

  // ── Version table indexes ─────────────────────────────────────────────────

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_portfolio_page_v_version__status_idx" ON "_portfolio_page_v" USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_portfolio_page_v_latest_idx"          ON "_portfolio_page_v" USING btree ("latest");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_portfolio_page_v_created_at_idx"      ON "_portfolio_page_v" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_portfolio_page_v_updated_at_idx"      ON "_portfolio_page_v" USING btree ("updated_at");`)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_blog_page_v_version__status_idx" ON "_blog_page_v" USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_blog_page_v_latest_idx"          ON "_blog_page_v" USING btree ("latest");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_blog_page_v_created_at_idx"      ON "_blog_page_v" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_blog_page_v_updated_at_idx"      ON "_blog_page_v" USING btree ("updated_at");`)

  // ── Foreign keys ──────────────────────────────────────────────────────────

  // portfolio_page.hero_image_id → media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_page"
        ADD CONSTRAINT "portfolio_page_hero_image_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // blog_page.hero_image_id → media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "blog_page"
        ADD CONSTRAINT "blog_page_hero_image_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // _portfolio_page_v.version_hero_image_id → media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_portfolio_page_v"
        ADD CONSTRAINT "_portfolio_page_v_hero_image_id_fk"
        FOREIGN KEY ("version_hero_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // _blog_page_v.version_hero_image_id → media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_blog_page_v"
        ADD CONSTRAINT "_blog_page_v_hero_image_id_fk"
        FOREIGN KEY ("version_hero_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_portfolio_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_blog_page_v"      CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_page"    CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "blog_page"         CASCADE;`)
}
