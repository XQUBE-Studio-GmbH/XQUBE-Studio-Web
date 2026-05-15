import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── home_page: hero showcase image ───────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "hero_showcase_image_id" integer;`)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_showcase_image_id_fk"
        FOREIGN KEY ("hero_showcase_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── about_page: intro image ───────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "intro_image_id" integer;`)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page" ADD CONSTRAINT "about_page_intro_image_id_fk"
        FOREIGN KEY ("intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── about_page_hubs: hub photo ────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "about_page_hubs" ADD COLUMN IF NOT EXISTS "image_id" integer;`)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page_hubs" ADD CONSTRAINT "about_page_hubs_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── contact_page: hero image ──────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "hero_image_id" integer;`)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_hero_image_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── services_page: hero image ─────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "hero_image_id" integer;`)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services_page" ADD CONSTRAINT "services_page_hero_image_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── services_page_pipelines ───────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_page_pipelines" (
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
    CREATE TABLE IF NOT EXISTS "services_page_pipelines_steps" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "step"       varchar
    );
  `)

  // ── services collection: thumbnail image ──────────────────────────────────────
  await db.execute(sql`ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "image_id" integer;`)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services" ADD CONSTRAINT "services_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── blog_posts: cover image ───────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;`)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_image_id_fk"
        FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── Indexes ───────────────────────────────────────────────────────────────────
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_page_pipelines_order_idx"        ON "services_page_pipelines"       USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_page_pipelines_parent_idx"       ON "services_page_pipelines"       USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_page_pipelines_steps_order_idx"  ON "services_page_pipelines_steps" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "services_page_pipelines_steps_parent_idx" ON "services_page_pipelines_steps" USING btree ("_parent_id");`)

  // ── Foreign keys ──────────────────────────────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services_page_pipelines"
        ADD CONSTRAINT "services_page_pipelines_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services_page_pipelines"
        ADD CONSTRAINT "services_page_pipelines_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "services_page_pipelines_steps"
        ADD CONSTRAINT "services_page_pipelines_steps_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_pipelines"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "services_page_pipelines_steps";`)
  await db.execute(sql`DROP TABLE IF EXISTS "services_page_pipelines";`)
  await db.execute(sql`ALTER TABLE "blog_posts"      DROP COLUMN IF EXISTS "cover_image_id";`)
  await db.execute(sql`ALTER TABLE "services"        DROP COLUMN IF EXISTS "image_id";`)
  await db.execute(sql`ALTER TABLE "services_page"   DROP COLUMN IF EXISTS "hero_image_id";`)
  await db.execute(sql`ALTER TABLE "contact_page"    DROP COLUMN IF EXISTS "hero_image_id";`)
  await db.execute(sql`ALTER TABLE "about_page_hubs" DROP COLUMN IF EXISTS "image_id";`)
  await db.execute(sql`ALTER TABLE "about_page"      DROP COLUMN IF EXISTS "intro_image_id";`)
  await db.execute(sql`ALTER TABLE "home_page"       DROP COLUMN IF EXISTS "hero_showcase_image_id";`)
}
