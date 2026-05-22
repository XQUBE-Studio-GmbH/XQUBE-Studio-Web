import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds must_change_password boolean column to the users table.
// Set to true when a user is created via the invite flow.
// Cleared by a beforeChange hook when the user saves a new password.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "must_change_password" boolean DEFAULT false NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
      DROP COLUMN IF EXISTS "must_change_password";
  `)
}
