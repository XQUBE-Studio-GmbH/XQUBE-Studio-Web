import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the image-size columns that Payload expects when imageSizes is configured
// on the media collection (thumbnail / card / hero).
// The initial migration created the media table before imageSizes was added,
// so these columns are missing and cause "column does not exist" errors.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── thumbnail ──────────────────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_url"       varchar;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_width"     numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_height"    numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_mime_type" varchar;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filesize"  numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filename"  varchar;`)

  // ── card ───────────────────────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_url"            varchar;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_width"          numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_height"         numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_mime_type"      varchar;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filesize"       numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filename"       varchar;`)

  // ── hero ───────────────────────────────────────────────────────────────────
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_url"            varchar;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_width"          numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_height"         numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_mime_type"      varchar;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_filesize"       numeric;`)
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_hero_filename"       varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_url";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_width";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_height";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_mime_type";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_filesize";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_thumbnail_filename";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_url";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_width";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_height";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_mime_type";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_filesize";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_filename";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_hero_url";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_hero_width";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_hero_height";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_hero_mime_type";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_hero_filesize";`)
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_hero_filename";`)
}
