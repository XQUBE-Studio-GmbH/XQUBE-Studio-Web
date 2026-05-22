import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds SEO fields (seo_title, seo_description, seo_image_id, seo_no_index) to:
//   Collections:  portfolio, blog_posts
//   Page globals: home_page, about_page, contact_page, services_page, portfolio_page, blog_page
//   Version tables for all six page globals (column prefix: version_seo_*)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Collections ───────────────────────────────────────────────────────────────

  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;`)

  // ── Page globals ──────────────────────────────────────────────────────────────

  await db.execute(sql`ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "portfolio_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "portfolio_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "portfolio_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "portfolio_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "blog_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "blog_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "blog_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "blog_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;`)

  // ── Version tables (globals with versions: { drafts: true }) ─────────────────

  await db.execute(sql`ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "_about_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "_about_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "_about_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "_about_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "_contact_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "_contact_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "_contact_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "_contact_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "_portfolio_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "_portfolio_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "_portfolio_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "_portfolio_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false;`)

  await db.execute(sql`ALTER TABLE "_blog_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;`)
  await db.execute(sql`ALTER TABLE "_blog_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar;`)
  await db.execute(sql`ALTER TABLE "_blog_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer;`)
  await db.execute(sql`ALTER TABLE "_blog_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // ── Version tables ────────────────────────────────────────────────────────────

  await db.execute(sql`ALTER TABLE "_blog_page_v" DROP COLUMN IF EXISTS "version_seo_no_index";`)
  await db.execute(sql`ALTER TABLE "_blog_page_v" DROP COLUMN IF EXISTS "version_seo_image_id";`)
  await db.execute(sql`ALTER TABLE "_blog_page_v" DROP COLUMN IF EXISTS "version_seo_description";`)
  await db.execute(sql`ALTER TABLE "_blog_page_v" DROP COLUMN IF EXISTS "version_seo_title";`)

  await db.execute(sql`ALTER TABLE "_portfolio_page_v" DROP COLUMN IF EXISTS "version_seo_no_index";`)
  await db.execute(sql`ALTER TABLE "_portfolio_page_v" DROP COLUMN IF EXISTS "version_seo_image_id";`)
  await db.execute(sql`ALTER TABLE "_portfolio_page_v" DROP COLUMN IF EXISTS "version_seo_description";`)
  await db.execute(sql`ALTER TABLE "_portfolio_page_v" DROP COLUMN IF EXISTS "version_seo_title";`)

  await db.execute(sql`ALTER TABLE "_services_page_v" DROP COLUMN IF EXISTS "version_seo_no_index";`)
  await db.execute(sql`ALTER TABLE "_services_page_v" DROP COLUMN IF EXISTS "version_seo_image_id";`)
  await db.execute(sql`ALTER TABLE "_services_page_v" DROP COLUMN IF EXISTS "version_seo_description";`)
  await db.execute(sql`ALTER TABLE "_services_page_v" DROP COLUMN IF EXISTS "version_seo_title";`)

  await db.execute(sql`ALTER TABLE "_contact_page_v" DROP COLUMN IF EXISTS "version_seo_no_index";`)
  await db.execute(sql`ALTER TABLE "_contact_page_v" DROP COLUMN IF EXISTS "version_seo_image_id";`)
  await db.execute(sql`ALTER TABLE "_contact_page_v" DROP COLUMN IF EXISTS "version_seo_description";`)
  await db.execute(sql`ALTER TABLE "_contact_page_v" DROP COLUMN IF EXISTS "version_seo_title";`)

  await db.execute(sql`ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_seo_no_index";`)
  await db.execute(sql`ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_seo_image_id";`)
  await db.execute(sql`ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_seo_description";`)
  await db.execute(sql`ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_seo_title";`)

  await db.execute(sql`ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_seo_no_index";`)
  await db.execute(sql`ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_seo_image_id";`)
  await db.execute(sql`ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_seo_description";`)
  await db.execute(sql`ALTER TABLE "_home_page_v" DROP COLUMN IF EXISTS "version_seo_title";`)

  // ── Page globals ──────────────────────────────────────────────────────────────

  await db.execute(sql`ALTER TABLE "blog_page" DROP COLUMN IF EXISTS "seo_no_index";`)
  await db.execute(sql`ALTER TABLE "blog_page" DROP COLUMN IF EXISTS "seo_image_id";`)
  await db.execute(sql`ALTER TABLE "blog_page" DROP COLUMN IF EXISTS "seo_description";`)
  await db.execute(sql`ALTER TABLE "blog_page" DROP COLUMN IF EXISTS "seo_title";`)

  await db.execute(sql`ALTER TABLE "portfolio_page" DROP COLUMN IF EXISTS "seo_no_index";`)
  await db.execute(sql`ALTER TABLE "portfolio_page" DROP COLUMN IF EXISTS "seo_image_id";`)
  await db.execute(sql`ALTER TABLE "portfolio_page" DROP COLUMN IF EXISTS "seo_description";`)
  await db.execute(sql`ALTER TABLE "portfolio_page" DROP COLUMN IF EXISTS "seo_title";`)

  await db.execute(sql`ALTER TABLE "services_page" DROP COLUMN IF EXISTS "seo_no_index";`)
  await db.execute(sql`ALTER TABLE "services_page" DROP COLUMN IF EXISTS "seo_image_id";`)
  await db.execute(sql`ALTER TABLE "services_page" DROP COLUMN IF EXISTS "seo_description";`)
  await db.execute(sql`ALTER TABLE "services_page" DROP COLUMN IF EXISTS "seo_title";`)

  await db.execute(sql`ALTER TABLE "contact_page" DROP COLUMN IF EXISTS "seo_no_index";`)
  await db.execute(sql`ALTER TABLE "contact_page" DROP COLUMN IF EXISTS "seo_image_id";`)
  await db.execute(sql`ALTER TABLE "contact_page" DROP COLUMN IF EXISTS "seo_description";`)
  await db.execute(sql`ALTER TABLE "contact_page" DROP COLUMN IF EXISTS "seo_title";`)

  await db.execute(sql`ALTER TABLE "about_page" DROP COLUMN IF EXISTS "seo_no_index";`)
  await db.execute(sql`ALTER TABLE "about_page" DROP COLUMN IF EXISTS "seo_image_id";`)
  await db.execute(sql`ALTER TABLE "about_page" DROP COLUMN IF EXISTS "seo_description";`)
  await db.execute(sql`ALTER TABLE "about_page" DROP COLUMN IF EXISTS "seo_title";`)

  await db.execute(sql`ALTER TABLE "home_page" DROP COLUMN IF EXISTS "seo_no_index";`)
  await db.execute(sql`ALTER TABLE "home_page" DROP COLUMN IF EXISTS "seo_image_id";`)
  await db.execute(sql`ALTER TABLE "home_page" DROP COLUMN IF EXISTS "seo_description";`)
  await db.execute(sql`ALTER TABLE "home_page" DROP COLUMN IF EXISTS "seo_title";`)

  // ── Collections ───────────────────────────────────────────────────────────────

  await db.execute(sql`ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "seo_no_index";`)
  await db.execute(sql`ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "seo_image_id";`)
  await db.execute(sql`ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "seo_description";`)
  await db.execute(sql`ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "seo_title";`)

  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "seo_no_index";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "seo_image_id";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "seo_description";`)
  await db.execute(sql`ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "seo_title";`)
}
