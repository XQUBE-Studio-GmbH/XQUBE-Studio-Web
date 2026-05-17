import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Drops and recreates all global version tables with verified schema.
// This replaces the partial/potentially-corrupted state from 20250517_global_versions.
// Safe to re-run (IF NOT EXISTS / IF EXISTS guards throughout).

export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ── Drop child tables first (FK constraints prevent dropping parents first) ─
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_stats" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_credentials" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_hubs" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_why_xqube" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v_version_pipelines_steps" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v_version_pipelines" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_navigation_v_version_main_nav" CASCADE;`)

  // ── Drop parent version tables ────────────────────────────────────────────
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_contact_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_navigation_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_site_settings_v" CASCADE;`)

  // ── _home_page_v ─────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE "_home_page_v" (
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
    CREATE TABLE "_home_page_v_version_stats" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar,
      "label"      varchar
    );
  `)

  // ── _about_page_v ────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE "_about_page_v" (
      "id"                     serial PRIMARY KEY NOT NULL,
      "version_intro_body1"    varchar,
      "version_intro_body2"    varchar,
      "version_intro_image_id" integer,
      "version__status"        varchar DEFAULT 'draft',
      "created_at"             timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at"             timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest"                 boolean,
      "autosave"               boolean
    );
  `)

  await db.execute(sql`
    CREATE TABLE "_about_page_v_version_credentials" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "value"      varchar,
      "label"      varchar,
      "detail"     varchar
    );
  `)

  await db.execute(sql`
    CREATE TABLE "_about_page_v_version_hubs" (
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
    CREATE TABLE "_about_page_v_version_why_xqube" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "title"      varchar,
      "body"       varchar
    );
  `)

  // ── _contact_page_v ──────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE "_contact_page_v" (
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

  // ── _services_page_v ─────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE "_services_page_v" (
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
    CREATE TABLE "_services_page_v_version_pipelines" (
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
    CREATE TABLE "_services_page_v_version_pipelines_steps" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "step"       varchar
    );
  `)

  // ── _navigation_v ────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE "_navigation_v" (
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
    CREATE TABLE "_navigation_v_version_main_nav" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "label"      varchar,
      "url"        varchar
    );
  `)

  // ── _site_settings_v ─────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE "_site_settings_v" (
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

  // ── _navigation_v — ctaButton fields ─────────────────────────────────────
  // navigation also has a ctaButton group → version_cta_button_label / url already in _navigation_v above
  // mainNav array → _navigation_v_version_main_nav above

  // ── Indexes ──────────────────────────────────────────────────────────────

  // _home_page_v
  await db.execute(sql`CREATE INDEX "_home_page_v_version_stats_order_idx"  ON "_home_page_v_version_stats" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX "_home_page_v_version_stats_parent_idx" ON "_home_page_v_version_stats" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX "_home_page_v_version__status_idx"      ON "_home_page_v" USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX "_home_page_v_latest_idx"               ON "_home_page_v" USING btree ("latest");`)
  await db.execute(sql`CREATE INDEX "_home_page_v_created_at_idx"           ON "_home_page_v" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX "_home_page_v_updated_at_idx"           ON "_home_page_v" USING btree ("updated_at");`)

  // _about_page_v
  await db.execute(sql`CREATE INDEX "_about_page_v_credentials_order_idx"   ON "_about_page_v_version_credentials" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_credentials_parent_idx"  ON "_about_page_v_version_credentials" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_hubs_order_idx"          ON "_about_page_v_version_hubs" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_hubs_parent_idx"         ON "_about_page_v_version_hubs" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_why_xqube_order_idx"     ON "_about_page_v_version_why_xqube" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_why_xqube_parent_idx"    ON "_about_page_v_version_why_xqube" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_version__status_idx"     ON "_about_page_v" USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_latest_idx"              ON "_about_page_v" USING btree ("latest");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_created_at_idx"          ON "_about_page_v" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX "_about_page_v_updated_at_idx"          ON "_about_page_v" USING btree ("updated_at");`)

  // _contact_page_v
  await db.execute(sql`CREATE INDEX "_contact_page_v_version__status_idx"   ON "_contact_page_v" USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX "_contact_page_v_latest_idx"            ON "_contact_page_v" USING btree ("latest");`)
  await db.execute(sql`CREATE INDEX "_contact_page_v_created_at_idx"        ON "_contact_page_v" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX "_contact_page_v_updated_at_idx"        ON "_contact_page_v" USING btree ("updated_at");`)

  // _services_page_v
  await db.execute(sql`CREATE INDEX "_services_page_v_pipelines_order_idx"        ON "_services_page_v_version_pipelines" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX "_services_page_v_pipelines_parent_idx"       ON "_services_page_v_version_pipelines" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX "_services_page_v_pip_steps_order_idx"        ON "_services_page_v_version_pipelines_steps" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX "_services_page_v_pip_steps_parent_idx"       ON "_services_page_v_version_pipelines_steps" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX "_services_page_v_version__status_idx"        ON "_services_page_v" USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX "_services_page_v_latest_idx"                 ON "_services_page_v" USING btree ("latest");`)
  await db.execute(sql`CREATE INDEX "_services_page_v_created_at_idx"             ON "_services_page_v" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX "_services_page_v_updated_at_idx"             ON "_services_page_v" USING btree ("updated_at");`)

  // _navigation_v
  await db.execute(sql`CREATE INDEX "_navigation_v_main_nav_order_idx"       ON "_navigation_v_version_main_nav" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX "_navigation_v_main_nav_parent_idx"      ON "_navigation_v_version_main_nav" USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX "_navigation_v_version__status_idx"      ON "_navigation_v" USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX "_navigation_v_latest_idx"               ON "_navigation_v" USING btree ("latest");`)
  await db.execute(sql`CREATE INDEX "_navigation_v_created_at_idx"           ON "_navigation_v" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX "_navigation_v_updated_at_idx"           ON "_navigation_v" USING btree ("updated_at");`)

  // _site_settings_v
  await db.execute(sql`CREATE INDEX "_site_settings_v_version__status_idx"   ON "_site_settings_v" USING btree ("version__status");`)
  await db.execute(sql`CREATE INDEX "_site_settings_v_latest_idx"            ON "_site_settings_v" USING btree ("latest");`)
  await db.execute(sql`CREATE INDEX "_site_settings_v_created_at_idx"        ON "_site_settings_v" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX "_site_settings_v_updated_at_idx"        ON "_site_settings_v" USING btree ("updated_at");`)

  // ── Foreign keys ─────────────────────────────────────────────────────────

  // _home_page_v child tables → _home_page_v
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v_version_stats"
        ADD CONSTRAINT "_home_page_v_version_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  // _home_page_v → media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_home_page_v"
        ADD CONSTRAINT "_home_page_v_hero_showcase_image_id_fk"
        FOREIGN KEY ("version_hero_showcase_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // _about_page_v child tables → _about_page_v
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v_version_credentials"
        ADD CONSTRAINT "_about_page_v_version_credentials_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v_version_hubs"
        ADD CONSTRAINT "_about_page_v_version_hubs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v_version_hubs"
        ADD CONSTRAINT "_about_page_v_version_hubs_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v_version_why_xqube"
        ADD CONSTRAINT "_about_page_v_version_why_xqube_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  // _about_page_v → media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_about_page_v"
        ADD CONSTRAINT "_about_page_v_intro_image_id_fk"
        FOREIGN KEY ("version_intro_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // _contact_page_v → media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_contact_page_v"
        ADD CONSTRAINT "_contact_page_v_hero_image_id_fk"
        FOREIGN KEY ("version_hero_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // _services_page_v child tables
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_services_page_v_version_pipelines"
        ADD CONSTRAINT "_services_page_v_version_pipelines_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_services_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_services_page_v_version_pipelines"
        ADD CONSTRAINT "_services_page_v_version_pipelines_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_services_page_v_version_pipelines_steps"
        ADD CONSTRAINT "_services_page_v_version_pipelines_steps_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_services_page_v_version_pipelines"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  // _services_page_v → media
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_services_page_v"
        ADD CONSTRAINT "_services_page_v_hero_image_id_fk"
        FOREIGN KEY ("version_hero_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // _navigation_v child table → _navigation_v
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_navigation_v_version_main_nav"
        ADD CONSTRAINT "_navigation_v_version_main_nav_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v_version_stats" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_credentials" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_hubs" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v_version_why_xqube" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v_version_pipelines_steps" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v_version_pipelines" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_navigation_v_version_main_nav" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_home_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_about_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_contact_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_services_page_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_navigation_v" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "_site_settings_v" CASCADE;`)
}
