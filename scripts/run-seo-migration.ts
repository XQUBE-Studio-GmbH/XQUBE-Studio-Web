/**
 * One-off script to run the 20260522_seo_fields migration directly via pg.
 * Uses the same direct-connection conversion as seed.ts.
 *
 * Run: NODE_ENV=production npx tsx --env-file=.env.local scripts/run-seo-migration.ts
 */

import { Client } from 'pg'

const rawUri = process.env.DATABASE_URI
if (!rawUri) { console.error('DATABASE_URI not set in .env.local'); process.exit(1) }

// Strip doubled "postgresql" prefix if present
function cleanUrl(poolerUrl: string): string {
  return poolerUrl.replace(/^postgresqlpostgresql:\/\//, 'postgresql://')
}

const client = new Client({
  connectionString: cleanUrl(rawUri),
  ssl: { rejectUnauthorized: false },
})

const statements = [
  // Collections
  `ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
  `ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
  `ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  `ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
  `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
  `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  `ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false`,

  // Page globals
  `ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
  `ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
  `ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  `ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
  `ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
  `ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  `ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
  `ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
  `ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  `ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "portfolio_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
  `ALTER TABLE "portfolio_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
  `ALTER TABLE "portfolio_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  `ALTER TABLE "portfolio_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "blog_page" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
  `ALTER TABLE "blog_page" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
  `ALTER TABLE "blog_page" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  `ALTER TABLE "blog_page" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false`,

  // Version tables
  `ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar`,
  `ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar`,
  `ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer`,
  `ALTER TABLE "_home_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "_about_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar`,
  `ALTER TABLE "_about_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar`,
  `ALTER TABLE "_about_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer`,
  `ALTER TABLE "_about_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "_contact_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar`,
  `ALTER TABLE "_contact_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar`,
  `ALTER TABLE "_contact_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer`,
  `ALTER TABLE "_contact_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar`,
  `ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar`,
  `ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer`,
  `ALTER TABLE "_services_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "_portfolio_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar`,
  `ALTER TABLE "_portfolio_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar`,
  `ALTER TABLE "_portfolio_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer`,
  `ALTER TABLE "_portfolio_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false`,

  `ALTER TABLE "_blog_page_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar`,
  `ALTER TABLE "_blog_page_v" ADD COLUMN IF NOT EXISTS "version_seo_description" varchar`,
  `ALTER TABLE "_blog_page_v" ADD COLUMN IF NOT EXISTS "version_seo_image_id" integer`,
  `ALTER TABLE "_blog_page_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false`,
]

async function run() {
  console.log('Connecting to database…')
  await client.connect()
  console.log('Connected. Running SEO migration…\n')

  for (const stmt of statements) {
    const table = stmt.match(/"([^"]+)"/)?.[1] ?? ''
    const col   = stmt.match(/ADD COLUMN IF NOT EXISTS "([^"]+)"/)?.[1] ?? ''
    try {
      await client.query(stmt)
      console.log(`  ✓  ${table}.${col}`)
    } catch (err: any) {
      console.error(`  ✗  ${table}.${col} — ${err.message}`)
      await client.end()
      process.exit(1)
    }
  }

  await client.end()
  console.log('\nMigration complete ✅')
}

run().catch(async (err) => {
  console.error(err)
  await client.end()
  process.exit(1)
})
