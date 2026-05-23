import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the contact_submissions_id column to payload_locked_documents_rels.
// Payload queries this column for every registered collection; omitting it
// causes a "column does not exist" error on the admin panel at runtime.

export const up = async ({ db }: MigrateUpArgs): Promise<void> => {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "contact_submissions_id" varchar;
  `)
}

export const down = async ({ db }: MigrateDownArgs): Promise<void> => {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "contact_submissions_id";
  `)
}
