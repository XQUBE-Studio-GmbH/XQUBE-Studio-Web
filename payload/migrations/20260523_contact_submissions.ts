import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export const up = async ({ db }: MigrateUpArgs): Promise<void> => {
  await db.execute(sql`DROP TABLE IF EXISTS "contact_submissions";`)
  await db.execute(sql`
    CREATE TABLE "contact_submissions" (
      "id"           varchar       PRIMARY KEY NOT NULL,
      "name"         varchar       NOT NULL,
      "email"        varchar       NOT NULL,
      "company"      varchar,
      "project_type" varchar,
      "engine"       varchar,
      "budget"       varchar,
      "timeline"     varchar,
      "message"      varchar       NOT NULL,
      "status"       varchar       DEFAULT 'new',
      "updated_at"   timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"   timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "contact_submissions_created_at_idx" ON "contact_submissions" ("created_at");`)
}

export const down = async ({ db }: MigrateDownArgs): Promise<void> => {
  await db.execute(sql`DROP TABLE IF EXISTS "contact_submissions";`)
}
