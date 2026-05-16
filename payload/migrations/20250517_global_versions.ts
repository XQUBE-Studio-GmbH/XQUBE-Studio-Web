import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds version tables for all 6 globals so Payload can store drafts.
// Required when `versions: { drafts: true }` is set on a global.
// Each global gets a `_<slug>_v` table; arrays get child `_<slug>_v_version_<field>` tables.

export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ── _home_page_v ─────────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_home_page_v" (
      "id"                             serial PRIMARY KEY NOT NULL,
      "version_hero_label"             varchar,
      "version_hero_headline"          varchar,
      "version_hero_subtitle"          varchar,
      "version_hero_primary_label"     varchar,
      "version_hero_primary_url"       varchar,
      "version_hero_secondary_label"   varchar,
      "version_hero_secondary_url"     varchar,
      "version_hero_showcase_image_id" integer,
      "version_cta_headline"           varchar,
      "version_cta_subtitle"           varchar,
      "version_cta_button_label"       varchar,
      "version_cta_button_url"         varchar,
      "version__status"                varchar DEFAULT 'draft',
      "created_at"                     timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"                     timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                         boolean,
      "autosave"                       boolean
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_home_page_v_version_stats" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar,
      "label"      varchar
    );
  `)

  // ── _about_page_v ────────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_about_page_v" (
      "id"                       serial PRIMARY KEY NOT NULL,
      "version_intro_body1"      varchar,
      "version_intro_body2"      varchar,
      "version_intro_image_id"   integer,
      "version__status"          varchar DEFAULT 'draft',
      "created_at"               timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"               timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                   boolean,
      "autosave"                 boolean
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_about_page_v_version_credentials" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar,
      "label"      varchar,
      "detail"     varchar
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_about_page_v_version_hubs" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "flag"       varchar,
      "city"       varchar,
      "country"    varchar,
      "role"       varchar,
      "detail"     varchar,
      "image_id"   integer
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_about_page_v_version_why_xqube" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "title"      varchar,
      "body"       varchar
    );
  `)

  // ── _contact_page_v ──────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_contact_page_v" (
      "id"                          serial PRIMARY KEY NOT NULL,
      "version_hero_label"          varchar,
      "version_hero_heading"        varchar,
      "version_hero_subtext"        varchar,
      "version_hero_calendly_label" varchar,
      "version_hero_image_id"       integer,
      "version__status"             varchar DEFAULT 'draft',
      "created_at"                  timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"                  timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                      boolean,
      "autosave"                    boolean
    );
  `)

  // ── _services_page_v ─────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_services_page_v" (
      "id"                       serial PRIMARY KEY NOT NULL,
      "version_hero_label"       varchar,
      "version_hero_heading"     varchar,
      "version_hero_subtitle"    varchar,
      "version_hero_image_id"    integer,
      "version_cta_heading"      varchar,
      "version_cta_subtitle"     varchar,
      "version_cta_button_label" varchar,
      "version_cta_button_url"   varchar,
      "version__status"          varchar DEFAULT 'draft',
      "created_at"               timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"               timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                   boolean,
      "autosave"                 boolean
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_services_page_v_version_pipelines" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "title"       varchar,
      "subtitle"    varchar,
      "description" varchar,
      "tools_used"  varchar,
      "image_id"    integer
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_services_page_v_version_pipelines_steps" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "step"       varchar
    );
  `)

  // ── _navigation_v ────────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_navigation_v" (
      "id"                        serial PRIMARY KEY NOT NULL,
      "version_cta_button_label"  varchar,
      "version_cta_button_url"    varchar,
      "version__status"           varchar DEFAULT 'draft',
      "created_at"                timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"                timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                    boolean,
      "autosave"                  boolean
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_navigation_v_version_main_nav" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "label"      varchar,
      "url"        varchar
    );
  `)

  // ── _site_settings_v ─────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_site_settings_v" (
      "id"                                  serial PRIMARY KEY NOT NULL,
      "version_site_name"                   varchar,
      "version_tagline"                     varchar,
      "version_contact_email"               varchar,
      "version_contact_phone"               varchar,
      "version_contact_address"             varchar,
      "version_contact_calendly"            varchar,
      "version_contact_linkedin"            varchar,
      "version_contact_artstation"          varchar,
      "version_seo_title"                   varchar,
      "version_seo_description"             varchar,
      "version_analytics_ga_measurement_id" varchar,
      "version_footer_copy"                 varchar,
      "version__status"                     varchar DEFAULT 'draft',
      "created_at"                          timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"                          timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                              boolean,
      "autosave"                            boolean
    );
  `)

  // ── Indexes ──────────────────────────────────────────────────────────────────
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_home_page_v_stats_order_idx"                       ON "_home_page_v_version_stats"                  USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_home_page_v_stats_parent_idx"                      ON "_home_page_v_version_stats"                  USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_home_page_v_status_idx"                            ON "_home_page_v"                                USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_home_page_v_latest_idx"                            ON "_home_page_v"                                USING btree ("latest");`)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_about_page_v_credentials_order_idx"                ON "_about_page_v_version_credentials"           USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_about_page_v_credentials_parent_idx"               ON "_about_page_v_version_credentials"           USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_about_page_v_hubs_order_idx"                       ON "_about_page_v_version_hubs"                  USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_about_page_v_hubs_parent_idx"                      ON "_about_page_v_version_hubs"                  USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_about_page_v_why_xqube_order_idx"                  ON "_about_page_v_version_why_xqube"             USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_about_page_v_why_xqube_parent_idx"                 ON "_about_page_v_version_why_xqube"             USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_about_page_v_status_idx"                           ON "_about_page_v"                               USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_about_page_v_latest_idx"                           ON "_about_page_v"                               USING btree ("latest");`)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_contact_page_v_status_idx"                         ON "_contact_page_v"                             USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_contact_page_v_latest_idx"                         ON "_contact_page_v"                             USING btree ("latest");`)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_services_page_v_pipelines_order_idx"               ON "_services_page_v_version_pipelines"          USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_services_page_v_pipelines_parent_idx"              ON "_services_page_v_version_pipelines"          USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_services_page_v_pipelines_steps_order_idx"         ON "_services_page_v_version_pipelines_steps"    USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_services_page_v_pipelines_steps_parent_idx"        ON "_services_page_v_version_pipelines_steps"    USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_services_page_v_status_idx"                        ON "_services_page_v"                            USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_services_page_v_latest_idx"                        ON "_services_page_v"                            USING btree ("latest");`)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_navigation_v_main_nav_order_idx"                   ON "_navigation_v_version_main_nav"              USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_navigation_v_main_nav_parent_idx"                  ON "_navigation_v_version_main_nav"              USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_navigation_v_status_idx"                           ON "_navigation_v"                               USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_navigation_v_latest_idx"                           ON "_navigation_v"                               USING btree ("latest");`)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_site_settings_v_status_idx"                        ON "_site_settings_v"                            USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_site_settings_v_latest_idx"                        ON "_site_settings_v"                            USING btree ("latest");`)

  // ── Foreign keys ─────────────────────────────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_stats"
        ADD CONSTRAINT "_home_page_v_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v"
        ADD CONSTRAINT "_home_page_v_showcase_image_id_fk"
        FOREIGN KEY ("version_hero_showcase_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v_version_credentials"
        ADD CONSTRAINT "_about_page_v_credentials_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v_version_hubs"
        ADD CONSTRAINT "_about_page_v_hubs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v_version_hubs"
        ADD CONSTRAINT "_about_page_v_hubs_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v_version_why_xqube"
        ADD CONSTRAINT "_about_page_v_why_xqube_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v"
        ADD CONSTRAINT "_about_page_v_intro_image_id_fk"
        FOREIGN KEY ("version_intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_contact_page_v"
        ADD CONSTRAINT "_contact_page_v_hero_image_id_fk"
        FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_services_page_v_version_pipelines"
        ADD CONSTRAINT "_services_page_v_pipelines_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_services_page_v_version_pipelines"
        ADD CONSTRAINT "_services_page_v_pipelines_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_services_page_v_version_pipelines_steps"
        ADD CONSTRAINT "_services_page_v_pipelines_steps_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_page_v_version_pipelines"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_services_page_v"
        ADD CONSTRAINT "_services_page_v_hero_image_id_fk"
        FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_navigation_v_version_main_nav"
        ADD CONSTRAINT "_navigation_v_main_nav_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_site_settings_v";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_navigation_v_version_main_nav";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_navigation_v";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v_version_pipelines_steps";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v_version_pipelines";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_contact_page_v";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_why_xqube";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_hubs";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_credentials";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_stats";`)
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v";`)
}
