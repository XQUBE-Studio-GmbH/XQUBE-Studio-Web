import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds:
//   1. "tools" collection table — shared tool/software library with logo upload
//   2. "portfolio_tools_used" child table — replaces plain-text software array
//      with relationship-based tags pointing at the tools collection
//   3. "folder" column on "media" table — basic folder organisation for the media library

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. tools table ────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tools" (
      "id"         varchar PRIMARY KEY NOT NULL,
      "name"       varchar NOT NULL,
      "category"   varchar,
      "logo_id"    varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "tools"
        ADD CONSTRAINT "tools_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "tools_name_idx" ON "tools" ("name");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "tools_category_idx" ON "tools" ("category");`)

  // ── 2. portfolio_tools_used child table ──────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_tools_used" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "tool_id"    varchar
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_tools_used"
        ADD CONSTRAINT "portfolio_tools_used_parent_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "portfolio"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_tools_used"
        ADD CONSTRAINT "portfolio_tools_used_tool_fk"
        FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_tools_used_order_idx" ON "portfolio_tools_used" ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_tools_used_parent_idx" ON "portfolio_tools_used" ("_parent_id");`)

  // ── 3. media folder column ────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "folder" varchar;`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "media_folder_idx" ON "media" ("folder");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "media_folder_idx";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "folder";`)

  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_tools_used";`)

  await db.execute(sql`DROP INDEX IF EXISTS "tools_category_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "tools_name_idx";`)
  await db.execute(sql`DROP TABLE IF EXISTS "tools";`)
}
