import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Enables Payload's built-in visual folder browser on the Media collection.
//
// What this migration does:
//   1. Creates the payload_folders table (used by Payload's folder system)
//   2. Adds payload_folders_id to the two rels tables (required for every new collection)
//   3. Seeds folder records from the unique values already in media.folder (text)
//   4. Adds media.folder_id (integer relationship) and links all existing files
//   5. Drops the old media.folder text column — no manual reassignment needed

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. Create payload_folders table ──────────────────────────────────────────
  await db.execute(sql`DROP TABLE IF EXISTS "payload_folders";`)
  await db.execute(sql`CREATE TABLE "payload_folders" ("id" serial PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "folder_id" integer, "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL, "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_folders_name_idx" ON "payload_folders" USING btree ("name");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");`)

  // ── 2. Register payload_folders in the rels tables ────────────────────────────
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "payload_folders_id" integer;`)
  await db.execute(sql`ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "payload_folders_id" integer;`)

  // ── 3. Seed folders from existing media.folder text values ────────────────────
  // Insert one folder record per unique non-empty folder name already on media rows.
  await db.execute(sql`INSERT INTO "payload_folders" ("name", "updated_at", "created_at") SELECT DISTINCT "folder", now(), now() FROM "media" WHERE "folder" IS NOT NULL AND "folder" != '';`)

  // ── 4. Add folder_id to media and wire up existing files ─────────────────────
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "folder_id" integer;`)
  await db.execute(sql`UPDATE "media" SET "folder_id" = pf."id" FROM "payload_folders" pf WHERE "media"."folder" = pf."name";`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "media_folder_idx" ON "media" USING btree ("folder_id");`)

  // ── 5. Drop the old text field — replaced by the relationship ─────────────────
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "folder";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore the old text column (values lost — rollback is best-effort)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "folder" varchar;`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "folder_id";`)
  await db.execute(sql`ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "payload_folders_id";`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_folders_id";`)
  await db.execute(sql`DROP TABLE IF EXISTS "payload_folders";`)
}
