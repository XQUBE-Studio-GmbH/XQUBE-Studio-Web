/**
 * Seed script — pre-populates Payload CMS globals with existing site copy.
 * Uses direct postgres queries (no Payload init) for speed and reliability.
 *
 * Run once after deploying: npm run seed
 */

import { Client } from 'pg'
import { randomUUID } from 'node:crypto'

const rawUri = process.env.DATABASE_URI
if (!rawUri) { console.error('DATABASE_URI not set in .env.local'); process.exit(1) }

// Transaction pooler (port 6543) only works on Vercel — convert to direct connection for local use
function toDirectUrl(poolerUrl: string): string {
  const u = new URL(poolerUrl)
  const projectRef = u.username.includes('.') ? u.username.split('.')[1] : u.username
  const password   = encodeURIComponent(decodeURIComponent(u.password))
  return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`
}

const uri = rawUri.includes(':6543') ? toDirectUrl(rawUri) : rawUri

const db = new Client({
  connectionString: uri,
  ssl: { rejectUnauthorized: false },
})

// ─── Table bootstrap (idempotent — runs before seeding) ──────────────────────

async function ensureTables() {
  // home_page
  await db.query(`CREATE TABLE IF NOT EXISTS "home_page" ("id" serial PRIMARY KEY NOT NULL, "hero_label" varchar, "hero_headline" varchar, "hero_subtitle" varchar, "hero_primary_label" varchar, "hero_primary_url" varchar, "hero_secondary_label" varchar, "hero_secondary_url" varchar, "cta_headline" varchar, "cta_subtitle" varchar, "cta_button_label" varchar, "cta_button_url" varchar, "updated_at" timestamp(3) with time zone, "created_at" timestamp(3) with time zone)`)
  await db.query(`CREATE TABLE IF NOT EXISTS "home_page_stats" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "value" varchar, "label" varchar)`)

  // about_page
  await db.query(`CREATE TABLE IF NOT EXISTS "about_page" ("id" serial PRIMARY KEY NOT NULL, "intro_body1" varchar, "intro_body2" varchar, "updated_at" timestamp(3) with time zone, "created_at" timestamp(3) with time zone)`)
  await db.query(`CREATE TABLE IF NOT EXISTS "about_page_credentials" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "value" varchar, "label" varchar, "detail" varchar)`)
  await db.query(`CREATE TABLE IF NOT EXISTS "about_page_hubs" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "flag" varchar, "city" varchar, "country" varchar, "role" varchar, "detail" varchar)`)
  await db.query(`CREATE TABLE IF NOT EXISTS "about_page_why_xqube" ("_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "title" varchar, "body" varchar)`)

  // contact_page
  await db.query(`CREATE TABLE IF NOT EXISTS "contact_page" ("id" serial PRIMARY KEY NOT NULL, "hero_label" varchar, "hero_heading" varchar, "hero_subtext" varchar, "hero_calendly_label" varchar, "updated_at" timestamp(3) with time zone, "created_at" timestamp(3) with time zone)`)

  // services_page
  await db.query(`CREATE TABLE IF NOT EXISTS "services_page" ("id" serial PRIMARY KEY NOT NULL, "hero_label" varchar, "hero_heading" varchar, "hero_subtitle" varchar, "cta_heading" varchar, "cta_subtitle" varchar, "cta_button_label" varchar, "cta_button_url" varchar, "updated_at" timestamp(3) with time zone, "created_at" timestamp(3) with time zone)`)
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const HOME_STATS = [
  { value: '15+', label: 'Years Experience' },
  { value: '80+', label: 'Clients Worldwide' },
  { value: '20+', label: 'Core Team Members' },
  { value: '3',   label: 'Global Hubs' },
]

const ABOUT_CREDENTIALS = [
  { value: '15+', label: 'Years Experience', detail: 'XR · game art · AI simulation · delivered across 3 continents' },
  { value: '80+', label: 'Clients Worldwide', detail: 'Gaming · XR · flight sim · digital twin · entertainment' },
  { value: '20+', label: 'Core Team Members', detail: 'Artists, engineers, developers, designers, operations' },
  { value: '3',   label: 'Global Hubs',       detail: 'Vienna · Dubai · Dhaka' },
]

const ABOUT_HUBS = [
  { flag: '🇦🇹', city: 'Vienna', country: 'Austria',    role: 'HQ — Strategy, Leadership & Business Development',  detail: 'EU IP protection · enterprise contracts' },
  { flag: '🇦🇪', city: 'Dubai',  country: 'UAE',         role: 'MENA Hub — Strategic Market Access & Partnerships', detail: 'MENA expansion · enterprise & government access' },
  { flag: '🇧🇩', city: 'Dhaka',  country: 'Bangladesh', role: 'Production Hub — Scalable Delivery & Game Art',      detail: 'Cost efficiency · deep talent pool' },
]

const ABOUT_WHY = [
  { title: 'Zero Handoff Overhead',    body: 'Your brief goes directly to the senior artists doing the work — no account manager layer. Deliverables arrive pipeline-native: FBX, UE5, Unity, your naming conventions, your LOD specs. Zero integration overhead.' },
  { title: '24-Hour Production Cycle', body: 'Vienna, Dubai, and Dhaka span nine time zones. While your team sleeps, work continues. 30–50% faster delivery across 80+ clients — because three hubs in sequence never stop.' },
  { title: 'Engine Agnostic',          body: 'UE5, Unity, Godot, UEFN, Roblox. We match your pipeline, your stack, your standards.' },
  { title: 'Senior Artists Only',      body: 'No juniors on your work. Your Art Director works directly with ours. Your feedback actioned in 24 hours.' },
  { title: 'Pilot-First Model',        body: 'Try one asset before signing anything. Fee credited to Month 1 if you proceed. Zero obligation.' },
  { title: 'End-to-End Pipeline',      body: 'Concept to engine-ready — ZBrush, Substance, UE5, Unity. Full ownership of the deliverable.' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function upsertGlobal(table: string, cols: string[], vals: unknown[]) {
  const colList  = cols.map(c => `"${c}"`).join(', ')
  const valList  = cols.map((_, i) => `$${i + 1}`).join(', ')
  const setList  = cols.filter(c => c !== 'id').map(c => `"${c}" = EXCLUDED."${c}"`).join(', ')
  await db.query(
    `INSERT INTO "${table}" (${colList}) VALUES (${valList}) ON CONFLICT (id) DO UPDATE SET ${setList}`,
    vals,
  )
}

async function replaceChildren(table: string, parentId: number, rows: unknown[][]) {
  await db.query(`DELETE FROM "${table}" WHERE "_parent_id" = $1`, [parentId])
  for (const [i, row] of rows.entries()) {
    const allVals = [i, parentId, randomUUID(), ...row]
    const placeholders = allVals.map((_, j) => `$${j + 1}`).join(', ')
    // columns: _order, _parent_id, id, ...rest determined by row length
    const colCount = allVals.length
    // We pass col count so the query knows the shape; caller provides matching columns
    await db.query(
      `INSERT INTO "${table}" ("_order", "_parent_id", "id", ${(row as unknown[]).map((_,j) => `$col${j}`).join(', ')}) VALUES (${placeholders})`,
      allVals,
    )
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await db.connect()
  console.log('Connected to database.')

  console.log('Ensuring tables exist...')
  await ensureTables()
  console.log('  ✓ tables ready')

  // ── home_page ─────────────────────────────────────────────────────────────
  console.log('Seeding home_page...')
  await upsertGlobal('home_page', [
    'id', 'hero_label', 'hero_headline', 'hero_subtitle',
    'hero_primary_label', 'hero_primary_url',
    'hero_secondary_label', 'hero_secondary_url',
    'cta_headline', 'cta_subtitle', 'cta_button_label', 'cta_button_url',
  ], [
    1, 'Vienna · Dubai · Dhaka', 'Where Art Meets Precision',
    'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
    'Book a Discovery Call', 'https://calendly.com/tanvirkhandlxqsmgs',
    'View Portfolio', '/portfolio',
    'Looking for a long-term art partner?', 'We might be the right fit.',
    'Start a Conversation', '/contact',
  ])
  await db.query(`DELETE FROM "home_page_stats" WHERE "_parent_id" = 1`)
  for (const [i, s] of HOME_STATS.entries()) {
    await db.query(
      `INSERT INTO "home_page_stats" ("_order","_parent_id","id","value","label") VALUES ($1,$2,$3,$4,$5)`,
      [i, 1, randomUUID(), s.value, s.label],
    )
  }
  console.log('  ✓ home_page')

  // ── about_page ────────────────────────────────────────────────────────────
  console.log('Seeding about_page...')
  await upsertGlobal('about_page', [
    'id', 'intro_body1', 'intro_body2',
  ], [
    1,
    'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria. With 15+ years of hands-on delivery across gaming, XR, simulation, and AI — we work with studios worldwide to deliver AAA-quality assets at scale.',
    'Our three-hub model combines European business standards with world-class production capability — giving clients the reliability of a Vienna GmbH with the speed and depth of a Dhaka production team.',
  ])
  await db.query(`DELETE FROM "about_page_credentials" WHERE "_parent_id" = 1`)
  for (const [i, c] of ABOUT_CREDENTIALS.entries()) {
    await db.query(
      `INSERT INTO "about_page_credentials" ("_order","_parent_id","id","value","label","detail") VALUES ($1,$2,$3,$4,$5,$6)`,
      [i, 1, randomUUID(), c.value, c.label, c.detail],
    )
  }
  await db.query(`DELETE FROM "about_page_hubs" WHERE "_parent_id" = 1`)
  for (const [i, h] of ABOUT_HUBS.entries()) {
    await db.query(
      `INSERT INTO "about_page_hubs" ("_order","_parent_id","id","flag","city","country","role","detail") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [i, 1, randomUUID(), h.flag, h.city, h.country, h.role, h.detail],
    )
  }
  await db.query(`DELETE FROM "about_page_why_xqube" WHERE "_parent_id" = 1`)
  for (const [i, w] of ABOUT_WHY.entries()) {
    await db.query(
      `INSERT INTO "about_page_why_xqube" ("_order","_parent_id","id","title","body") VALUES ($1,$2,$3,$4,$5)`,
      [i, 1, randomUUID(), w.title, w.body],
    )
  }
  console.log('  ✓ about_page')

  // ── site_settings contact fields ──────────────────────────────────────────
  console.log('Seeding site_settings...')
  await db.query(`
    UPDATE "site_settings" SET
      "contact_email"      = $1,
      "contact_phone"      = $2,
      "contact_address"    = $3,
      "contact_calendly"   = $4,
      "contact_linkedin"   = $5,
      "contact_artstation" = $6
    WHERE id = 1
  `, [
    'info@xqubestudio.com',
    '+43 650 5207329',
    'Rathausstrasse 21/12, 1010 Vienna, Austria',
    'https://calendly.com/tanvirkhandlxqsmgs',
    'https://www.linkedin.com/company/xqubestudio',
    'https://www.artstation.com/xqubestudio',
  ])
  console.log('  ✓ site_settings')

  // ── contact_page ──────────────────────────────────────────────────────────
  console.log('Seeding contact_page...')
  await upsertGlobal('contact_page', [
    'id', 'hero_label', 'hero_heading', 'hero_subtext', 'hero_calendly_label',
  ], [
    1,
    'Get in Touch',
    "Let's talk about your project",
    "Book a discovery call for a scoped conversation, or fill out the brief and we'll respond within 24–48 hours.",
    'Book a Discovery Call',
  ])
  console.log('  ✓ contact_page')

  // ── services_page ─────────────────────────────────────────────────────────
  console.log('Seeding services_page...')
  await upsertGlobal('services_page', [
    'id', 'hero_label', 'hero_heading', 'hero_subtitle',
    'cta_heading', 'cta_subtitle', 'cta_button_label', 'cta_button_url',
  ], [
    1,
    'What We Offer',
    'Production-grade services for serious studios',
    'From a single asset to a fully embedded team — we scale to your needs.',
    'Looking for a long-term art partner?',
    'We might be the right fit.',
    'Start a Conversation',
    '/contact',
  ])
  console.log('  ✓ services_page')

  await db.end()
  console.log('\nSeed complete.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  db.end().catch(() => {})
  process.exit(1)
})
