import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds:
//   1. "tools" collection table — shared software/tool library with logo upload
//   2. "portfolio_tools_used" child table — relationship array on portfolio → tools
//   3. "folder" column on "media" table — basic folder organisation
//
// Column type rules (learned from initial migration):
//   - Collection id columns → serial PRIMARY KEY (integer, auto-increment)
//   - Upload/relationship columns pointing to a collection → integer (matches serial PK)
//   - Child table id → varchar PRIMARY KEY (UUID string, per Payload child-table convention)
//   - Child table _parent_id → integer (matches parent collection's serial PK)
//   - FKs via DO $$ BEGIN...EXCEPTION WHEN duplicate_object...END $$; (same as initial migration)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. tools table ────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tools" (
      "id"         serial PRIMARY KEY NOT NULL,
      "name"       varchar NOT NULL,
      "category"   varchar,
      "logo_id"    integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "tools_name_idx"     ON "tools" USING btree ("name");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "tools_category_idx" ON "tools" USING btree ("category");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "tools_created_at_idx" ON "tools" USING btree ("created_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "tools_updated_at_idx" ON "tools" USING btree ("updated_at");`)

  // FK: tools.logo_id → media.id  (both integer — no type mismatch)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "tools"
        ADD CONSTRAINT "tools_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── 2. portfolio_tools_used child table ──────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_tools_used" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "tool_id"    integer
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_tools_used_order_idx"  ON "portfolio_tools_used" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_tools_used_parent_idx" ON "portfolio_tools_used" USING btree ("_parent_id");`)

  // FK: portfolio_tools_used._parent_id → portfolio.id  (both integer)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_tools_used"
        ADD CONSTRAINT "portfolio_tools_used_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // FK: portfolio_tools_used.tool_id → tools.id  (both integer)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_tools_used"
        ADD CONSTRAINT "portfolio_tools_used_tool_id_fk"
        FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── 3. media folder column ────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "folder" varchar;`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "media_folder_idx" ON "media" USING btree ("folder");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "media_folder_idx";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "folder";`)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_tools_used";`)
  await db.execute(sql`DROP INDEX IF EXISTS "tools_updated_at_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "tools_created_at_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "tools_category_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "tools_name_idx";`)
  await db.execute(sql`DROP TABLE IF EXISTS "tools";`)
}
