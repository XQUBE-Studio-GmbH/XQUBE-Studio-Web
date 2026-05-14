import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ─── New scalar columns on portfolio ────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "client"        varchar;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "year"          numeric;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "video_url"     varchar;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "overview"      jsonb;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "poly_count"    varchar;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "texture_res"   varchar;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "delivery_time" varchar;`)

  // ─── portfolio_gallery (array field) ────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_gallery" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "image_id"   integer,
      "caption"    varchar
    );
  `)

  // ─── portfolio_software (array field) ───────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_software" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "tool"       varchar
    );
  `)

  // ─── Indexes ────────────────────────────────────────────────────────────────
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_gallery_order_idx"    ON "portfolio_gallery"  USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_gallery_parent_idx"   ON "portfolio_gallery"  USING btree ("_parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_software_order_idx"   ON "portfolio_software" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_software_parent_idx"  ON "portfolio_software" USING btree ("_parent_id");`)

  // ─── Foreign keys ────────────────────────────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_gallery"
        ADD CONSTRAINT "portfolio_gallery_image_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_gallery"
        ADD CONSTRAINT "portfolio_gallery_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_software"
        ADD CONSTRAINT "portfolio_software_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_software";`)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_gallery";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "delivery_time";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "texture_res";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "poly_count";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "overview";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "video_url";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "year";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "client";`)
}
