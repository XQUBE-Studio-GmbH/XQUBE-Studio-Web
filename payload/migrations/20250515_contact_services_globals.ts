import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_page" (
      "id"                   serial PRIMARY KEY NOT NULL,
      "hero_label"           varchar DEFAULT 'Get in Touch',
      "hero_heading"         varchar DEFAULT 'Let''s talk about your project',
      "hero_subtext"         varchar DEFAULT 'Book a discovery call for a scoped conversation, or fill out the brief and we''ll respond within 24–48 hours.',
      "hero_calendly_label"  varchar DEFAULT 'Book a Discovery Call',
      "updated_at"           timestamp(3) with time zone,
      "created_at"           timestamp(3) with time zone
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_page" (
      "id"               serial PRIMARY KEY NOT NULL,
      "hero_label"       varchar DEFAULT 'What We Offer',
      "hero_heading"     varchar DEFAULT 'Production-grade services for serious studios',
      "hero_subtitle"    varchar DEFAULT 'From a single asset to a fully embedded team — we scale to your needs.',
      "cta_heading"      varchar DEFAULT 'Looking for a long-term art partner?',
      "cta_subtitle"     varchar DEFAULT 'We might be the right fit.',
      "cta_button_label" varchar DEFAULT 'Start a Conversation',
      "cta_button_url"   varchar DEFAULT '/contact',
      "updated_at"       timestamp(3) with time zone,
      "created_at"       timestamp(3) with time zone
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "services_page";`)
  await db.execute(sql`DROP TABLE IF EXISTS "contact_page";`)
}
