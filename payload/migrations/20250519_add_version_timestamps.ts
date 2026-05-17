import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Payload automatically adds updatedAt + createdAt as base fields to every global.
// When those fields are wrapped in the `version` group for draft versioning,
// they become version_updated_at and version_created_at columns in the _*_v tables.
// Our previous migrations were missing these two columns — this adds them.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "_home_page_v"     ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;`)
  await db.execute(sql`ALTER TABLE "_home_page_v"     ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;`)

  await db.execute(sql`ALTER TABLE "_about_page_v"    ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;`)
  await db.execute(sql`ALTER TABLE "_about_page_v"    ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;`)

  await db.execute(sql`ALTER TABLE "_contact_page_v"  ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;`)
  await db.execute(sql`ALTER TABLE "_contact_page_v"  ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;`)

  await db.execute(sql`ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;`)
  await db.execute(sql`ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;`)

  await db.execute(sql`ALTER TABLE "_navigation_v"    ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;`)
  await db.execute(sql`ALTER TABLE "_navigation_v"    ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;`)

  await db.execute(sql`ALTER TABLE "_site_settings_v" ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone;`)
  await db.execute(sql`ALTER TABLE "_site_settings_v" ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "_home_page_v"     DROP COLUMN IF EXISTS "version_updated_at";`)
  await db.execute(sql`ALTER TABLE "_home_page_v"     DROP COLUMN IF EXISTS "version_created_at";`)
  await db.execute(sql`ALTER TABLE "_about_page_v"    DROP COLUMN IF EXISTS "version_updated_at";`)
  await db.execute(sql`ALTER TABLE "_about_page_v"    DROP COLUMN IF EXISTS "version_created_at";`)
  await db.execute(sql`ALTER TABLE "_contact_page_v"  DROP COLUMN IF EXISTS "version_updated_at";`)
  await db.execute(sql`ALTER TABLE "_contact_page_v"  DROP COLUMN IF EXISTS "version_created_at";`)
  await db.execute(sql`ALTER TABLE "_services_page_v" DROP COLUMN IF EXISTS "version_updated_at";`)
  await db.execute(sql`ALTER TABLE "_services_page_v" DROP COLUMN IF EXISTS "version_created_at";`)
  await db.execute(sql`ALTER TABLE "_navigation_v"    DROP COLUMN IF EXISTS "version_updated_at";`)
  await db.execute(sql`ALTER TABLE "_navigation_v"    DROP COLUMN IF EXISTS "version_created_at";`)
  await db.execute(sql`ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_updated_at";`)
  await db.execute(sql`ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_created_at";`)
}
