import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

    -- ─── Enum types ──────────────────────────────────────────────────────────────
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_role" AS ENUM(
        'super-admin', 'admin', 'bd-manager', 'content-editor', 'viewer'
      );
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_portfolio_category" AS ENUM(
        'characters', 'weapons', 'vehicles', 'environments', 'props', 'vr-assets'
      );
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_portfolio_status" AS ENUM('published', 'draft');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('published', 'draft');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    -- ─── users ───────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "users" (
      "id"                         serial PRIMARY KEY NOT NULL,
      "name"                       varchar,
      "role"                       "public"."enum_users_role" DEFAULT 'viewer',
      "updated_at"                 timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"                 timestamp(3) with time zone DEFAULT now() NOT NULL,
      "email"                      varchar NOT NULL,
      "reset_password_token"       varchar,
      "reset_password_expiration"  timestamp(3) with time zone,
      "salt"                       varchar,
      "hash"                       varchar,
      "login_attempts"             numeric DEFAULT 0,
      "lock_until"                 timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "users_sessions" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "created_at"  timestamp(3) with time zone DEFAULT now() NOT NULL,
      "expires_at"  timestamp(3) with time zone
    );

    -- ─── media ───────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "media" (
      "id"               serial PRIMARY KEY NOT NULL,
      "alt"              varchar NOT NULL,
      "updated_at"       timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"       timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url"              varchar,
      "thumbnail_u_r_l"  varchar,
      "filename"         varchar,
      "mime_type"        varchar,
      "filesize"         numeric,
      "width"            numeric,
      "height"           numeric,
      "focal_x"          numeric,
      "focal_y"          numeric
    );

    -- ─── portfolio ───────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "portfolio" (
      "id"                serial PRIMARY KEY NOT NULL,
      "title"             varchar NOT NULL,
      "slug"              varchar NOT NULL,
      "category"          "public"."enum_portfolio_category",
      "hero_image_id"     integer,
      "short_description" varchar,
      "featured"          boolean DEFAULT false,
      "status"            "public"."enum_portfolio_status" DEFAULT 'draft',
      "updated_at"        timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"        timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- ─── services ────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "services" (
      "id"                serial PRIMARY KEY NOT NULL,
      "title"             varchar NOT NULL,
      "slug"              varchar NOT NULL,
      "short_description" varchar,
      "description"       jsonb,
      "featured"          boolean DEFAULT false,
      "order"             numeric DEFAULT 0,
      "updated_at"        timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"        timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- ─── team_members ────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "team_members" (
      "id"         serial PRIMARY KEY NOT NULL,
      "name"       varchar NOT NULL,
      "role"       varchar NOT NULL,
      "bio"        varchar,
      "photo_id"   integer,
      "order"      numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- ─── clients ─────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "clients" (
      "id"         serial PRIMARY KEY NOT NULL,
      "name"       varchar NOT NULL,
      "logo_id"    integer NOT NULL,
      "featured"   boolean DEFAULT true,
      "order"      numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- ─── blog_posts ──────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "blog_posts" (
      "id"         serial PRIMARY KEY NOT NULL,
      "title"      varchar NOT NULL,
      "slug"       varchar NOT NULL,
      "excerpt"    varchar,
      "content"    jsonb,
      "status"     "public"."enum_blog_posts_status" DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- ─── Globals ─────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id"                         serial PRIMARY KEY NOT NULL,
      "site_name"                  varchar DEFAULT 'XQube Studio',
      "tagline"                    varchar DEFAULT 'Where Art Meets Precision',
      "contact_email"              varchar DEFAULT 'info@xqubestudio.com',
      "contact_calendly"           varchar DEFAULT 'https://calendly.com/tanvirkhandlxqsmgs',
      "contact_linkedin"           varchar DEFAULT 'https://www.linkedin.com/company/xqubestudio',
      "contact_artstation"         varchar DEFAULT 'https://www.artstation.com/xqubestudio',
      "seo_title"                  varchar DEFAULT 'XQube Studio | AAA Game Art & XR Production',
      "seo_description"            varchar,
      "analytics_ga_measurement_id" varchar,
      "footer_copy"                varchar DEFAULT '© 2025 XQube Studio GmbH. All rights reserved.',
      "updated_at"                 timestamp(3) with time zone,
      "created_at"                 timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "navigation" (
      "id"               serial PRIMARY KEY NOT NULL,
      "cta_button_label" varchar DEFAULT 'Book a Call',
      "cta_button_url"   varchar DEFAULT 'https://calendly.com/tanvirkhandlxqsmgs',
      "updated_at"       timestamp(3) with time zone,
      "created_at"       timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "navigation_main_nav" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "label"      varchar NOT NULL,
      "url"        varchar NOT NULL
    );

    -- ─── Payload built-ins ───────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "payload_preferences" (
      "id"         serial PRIMARY KEY NOT NULL,
      "key"        varchar,
      "value"      jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
      "id"        serial PRIMARY KEY NOT NULL,
      "order"     integer,
      "parent_id" integer NOT NULL,
      "path"      varchar NOT NULL,
      "users_id"  integer
    );

    CREATE TABLE IF NOT EXISTS "payload_migrations" (
      "id"         serial PRIMARY KEY NOT NULL,
      "name"       varchar,
      "batch"      numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
      "id"          serial PRIMARY KEY NOT NULL,
      "global_slug" varchar,
      "updated_at"  timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"  timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
      "id"              serial PRIMARY KEY NOT NULL,
      "order"           integer,
      "parent_id"       integer NOT NULL,
      "path"            varchar NOT NULL,
      "users_id"        integer,
      "media_id"        integer,
      "portfolio_id"    integer,
      "services_id"     integer,
      "team_members_id" integer,
      "clients_id"      integer,
      "blog_posts_id"   integer
    );

    -- ─── Indexes ─────────────────────────────────────────────────────────────────
    CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx"              ON "users"              USING btree ("email");
    CREATE INDEX        IF NOT EXISTS "users_created_at_idx"         ON "users"              USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "users_updated_at_idx"         ON "users"              USING btree ("updated_at");
    CREATE INDEX        IF NOT EXISTS "users_sessions_order_idx"     ON "users_sessions"     USING btree ("_order");
    CREATE INDEX        IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions"     USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx"           ON "media"              USING btree ("filename");
    CREATE INDEX        IF NOT EXISTS "media_created_at_idx"         ON "media"              USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "media_updated_at_idx"         ON "media"              USING btree ("updated_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "portfolio_slug_idx"           ON "portfolio"          USING btree ("slug");
    CREATE INDEX        IF NOT EXISTS "portfolio_status_idx"         ON "portfolio"          USING btree ("status");
    CREATE INDEX        IF NOT EXISTS "portfolio_created_at_idx"     ON "portfolio"          USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "portfolio_updated_at_idx"     ON "portfolio"          USING btree ("updated_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_idx"            ON "services"           USING btree ("slug");
    CREATE INDEX        IF NOT EXISTS "services_created_at_idx"      ON "services"           USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "services_updated_at_idx"      ON "services"           USING btree ("updated_at");
    CREATE INDEX        IF NOT EXISTS "team_members_created_at_idx"  ON "team_members"       USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "team_members_updated_at_idx"  ON "team_members"       USING btree ("updated_at");
    CREATE INDEX        IF NOT EXISTS "clients_created_at_idx"       ON "clients"            USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "clients_updated_at_idx"       ON "clients"            USING btree ("updated_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_idx"          ON "blog_posts"         USING btree ("slug");
    CREATE INDEX        IF NOT EXISTS "blog_posts_status_idx"        ON "blog_posts"         USING btree ("status");
    CREATE INDEX        IF NOT EXISTS "blog_posts_created_at_idx"    ON "blog_posts"         USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "blog_posts_updated_at_idx"    ON "blog_posts"         USING btree ("updated_at");
    CREATE INDEX        IF NOT EXISTS "nav_main_nav_order_idx"       ON "navigation_main_nav" USING btree ("_order");
    CREATE INDEX        IF NOT EXISTS "nav_main_nav_parent_id_idx"   ON "navigation_main_nav" USING btree ("_parent_id");
    CREATE INDEX        IF NOT EXISTS "payload_prefs_key_idx"        ON "payload_preferences" USING btree ("key");
    CREATE INDEX        IF NOT EXISTS "payload_prefs_created_at_idx" ON "payload_preferences" USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "payload_prefs_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
    CREATE INDEX        IF NOT EXISTS "payload_prefs_rels_order_idx"     ON "payload_preferences_rels" USING btree ("order");
    CREATE INDEX        IF NOT EXISTS "payload_prefs_rels_parent_idx"    ON "payload_preferences_rels" USING btree ("parent_id");
    CREATE INDEX        IF NOT EXISTS "payload_prefs_rels_path_idx"      ON "payload_preferences_rels" USING btree ("path");
    CREATE INDEX        IF NOT EXISTS "payload_prefs_rels_users_id_idx"  ON "payload_preferences_rels" USING btree ("users_id");
    CREATE INDEX        IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "payload_locked_docs_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
    CREATE INDEX        IF NOT EXISTS "payload_locked_docs_created_at_idx"  ON "payload_locked_documents" USING btree ("created_at");
    CREATE INDEX        IF NOT EXISTS "payload_locked_docs_rels_order_idx"  ON "payload_locked_documents_rels" USING btree ("order");
    CREATE INDEX        IF NOT EXISTS "payload_locked_docs_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
    CREATE INDEX        IF NOT EXISTS "payload_locked_docs_rels_path_idx"   ON "payload_locked_documents_rels" USING btree ("path");

    -- ─── Foreign keys ────────────────────────────────────────────────────────────
    DO $$ BEGIN
      ALTER TABLE "users_sessions"
        ADD CONSTRAINT "users_sessions_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "portfolio"
        ADD CONSTRAINT "portfolio_hero_image_id_media_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "team_members"
        ADD CONSTRAINT "team_members_photo_id_media_id_fk"
        FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "clients"
        ADD CONSTRAINT "clients_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "navigation_main_nav"
        ADD CONSTRAINT "navigation_main_nav_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels"
        ADD CONSTRAINT "payload_preferences_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels"
        ADD CONSTRAINT "payload_preferences_rels_users_fk"
        FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_docs_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_docs_rels_users_fk"
        FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_docs_rels_media_fk"
        FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_docs_rels_portfolio_fk"
        FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_docs_rels_services_fk"
        FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_docs_rels_team_members_fk"
        FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_docs_rels_clients_fk"
        FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_docs_rels_blog_posts_fk"
        FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload_locked_documents_rels";
    DROP TABLE IF EXISTS "payload_locked_documents";
    DROP TABLE IF EXISTS "payload_preferences_rels";
    DROP TABLE IF EXISTS "payload_migrations";
    DROP TABLE IF EXISTS "payload_preferences";
    DROP TABLE IF EXISTS "navigation_main_nav";
    DROP TABLE IF EXISTS "navigation";
    DROP TABLE IF EXISTS "site_settings";
    DROP TABLE IF EXISTS "blog_posts";
    DROP TABLE IF EXISTS "clients";
    DROP TABLE IF EXISTS "team_members";
    DROP TABLE IF EXISTS "services";
    DROP TABLE IF EXISTS "portfolio";
    DROP TABLE IF EXISTS "media";
    DROP TABLE IF EXISTS "users_sessions";
    DROP TABLE IF EXISTS "users";
    DROP TYPE IF EXISTS "public"."enum_blog_posts_status";
    DROP TYPE IF EXISTS "public"."enum_portfolio_status";
    DROP TYPE IF EXISTS "public"."enum_portfolio_category";
    DROP TYPE IF EXISTS "public"."enum_users_role";
  `)
}
