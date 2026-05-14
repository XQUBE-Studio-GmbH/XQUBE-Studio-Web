import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ─── home_page global ────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page" (
      "id"                   serial PRIMARY KEY NOT NULL,
      "hero_label"           varchar DEFAULT 'Vienna · Dubai · Dhaka',
      "hero_headline"        varchar DEFAULT 'Where Art Meets Precision',
      "hero_subtitle"        varchar DEFAULT 'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
      "hero_primary_label"   varchar DEFAULT 'Book a Discovery Call',
      "hero_primary_url"     varchar DEFAULT 'https://calendly.com/tanvirkhandlxqsmgs',
      "hero_secondary_label" varchar DEFAULT 'View Portfolio',
      "hero_secondary_url"   varchar DEFAULT '/portfolio',
      "cta_headline"         varchar DEFAULT 'Looking for a long-term art partner?',
      "cta_subtitle"         varchar DEFAULT 'We might be the right fit.',
      "cta_button_label"     varchar DEFAULT 'Start a Conversation',
      "cta_button_url"       varchar DEFAULT '/contact',
      "updated_at"           timestamp(3) with time zone,
      "created_at"           timestamp(3) with time zone
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_stats" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar,
      "label"      varchar
    );
  `)

  // ─── about_page global ───────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "about_page" (
      "id"           serial PRIMARY KEY NOT NULL,
      "intro_body1" varchar,
      "intro_body2" varchar,
      "updated_at"   timestamp(3) with time zone,
      "created_at"   timestamp(3) with time zone
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "about_page_credentials" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar,
      "label"      varchar,
      "detail"     varchar
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "about_page_hubs" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "flag"       varchar,
      "city"       varchar,
      "country"    varchar,
      "role"       varchar,
      "detail"     varchar
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "about_page_why_xqube" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "title"      varchar,
      "body"       varchar
    );
  `)

  // ─── services_features (new array on services collection) ────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_features" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "feature"    varchar
    );
  `)

  // ─── Alter existing tables ───────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_phone"   varchar;`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_address" varchar;`)
  await db.execute(sql`ALTER TABLE "services"      ADD COLUMN IF NOT EXISTS "icon"            varchar;`)
  await db.execute(sql`ALTER TABLE "services"      ADD COLUMN IF NOT EXISTS "platforms"       varchar;`)
  await db.execute(sql`ALTER TABLE "clients"       ADD COLUMN IF NOT EXISTS "sector"          varchar;`)
  await db.execute(sql`ALTER TABLE "clients"       ADD COLUMN IF NOT EXISTS "note"            varchar;`)

  // ─── Indexes ─────────────────────────────────────────────────────────────────
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "home_page_stats_order_idx"          ON "home_page_stats"        USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "home_page_stats_parent_idx"         ON "home_page_stats"        USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "about_credentials_order_idx"        ON "about_page_credentials" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "about_credentials_parent_idx"       ON "about_page_credentials" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "about_hubs_order_idx"               ON "about_page_hubs"        USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "about_hubs_parent_idx"              ON "about_page_hubs"        USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "about_why_xqube_order_idx"          ON "about_page_why_xqube"   USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "about_why_xqube_parent_idx"         ON "about_page_why_xqube"   USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_features_order_idx"        ON "services_features"      USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_features_parent_idx"       ON "services_features"      USING btree ("_parent_id");`)

  // ─── Foreign keys ────────────────────────────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_stats"
        ADD CONSTRAINT "home_page_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page_credentials"
        ADD CONSTRAINT "about_page_credentials_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page_hubs"
        ADD CONSTRAINT "about_page_hubs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page_why_xqube"
        ADD CONSTRAINT "about_page_why_xqube_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services_features"
        ADD CONSTRAINT "services_features_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "services_features";`)
  await db.execute(sql`DROP TABLE IF EXISTS "about_page_why_xqube";`)
  await db.execute(sql`DROP TABLE IF EXISTS "about_page_hubs";`)
  await db.execute(sql`DROP TABLE IF EXISTS "about_page_credentials";`)
  await db.execute(sql`DROP TABLE IF EXISTS "about_page";`)
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_stats";`)
  await db.execute(sql`DROP TABLE IF EXISTS "home_page";`)
  await db.execute(sql`ALTER TABLE "clients"       DROP COLUMN IF EXISTS "note";`)
  await db.execute(sql`ALTER TABLE "clients"       DROP COLUMN IF EXISTS "sector";`)
  await db.execute(sql`ALTER TABLE "services"      DROP COLUMN IF EXISTS "platforms";`)
  await db.execute(sql`ALTER TABLE "services"      DROP COLUMN IF EXISTS "icon";`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "contact_address";`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "contact_phone";`)
}
