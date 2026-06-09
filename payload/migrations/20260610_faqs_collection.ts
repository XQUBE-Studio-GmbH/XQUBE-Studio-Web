import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the faqs collection table.
// Stores general FAQs (About page) and service-specific FAQs (service detail pages).

export const up = async ({ db }: MigrateUpArgs): Promise<void> => {
  await db.execute(sql`DROP TABLE IF EXISTS "faqs";`)
  await db.execute(sql`CREATE TABLE "faqs" ("id" varchar PRIMARY KEY NOT NULL, "question" varchar NOT NULL, "answer" varchar NOT NULL, "category" varchar NOT NULL, "service_id" varchar, "faq_group" varchar DEFAULT 'none', "order" numeric DEFAULT 0, "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL, "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL);`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "faqs_category_idx" ON "faqs" ("category");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "faqs_service_id_idx" ON "faqs" ("service_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "faqs_order_idx" ON "faqs" ("order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "faqs_created_at_idx" ON "faqs" ("created_at");`)
}

export const down = async ({ db }: MigrateDownArgs): Promise<void> => {
  await db.execute(sql`DROP TABLE IF EXISTS "faqs";`)
}
