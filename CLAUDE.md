# XQube Studio Web — Project Rules for Claude

## Stack
- Next.js 15 App Router · Payload CMS v3 · Supabase (Postgres) · Tailwind CSS · Vercel

---

## RESOLVED BUILD & RUNTIME ERRORS (full history)

Every error below was hit, diagnosed, and fixed in production. Do not reintroduce them.

---

### ERROR 1 — "Functions cannot be passed directly to Client Components"
**Error digest:** `1003323670`
**Where:** `/admin` on first load
**Root cause:** `handleServerFunctions` was passed directly as the `serverFunction` prop to
Payload's `RootLayout`. It must be a Server Action (async function with `'use server'`).
**Fix:** `src/app/(payload)/admin/[[...segments]]/layout.tsx`
```tsx
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'  // also required — see ERROR 3

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}
```
**Never:** `serverFunction={handleServerFunctions}` — this passes it directly without 'use server'.

---

### ERROR 2 — `relation "users" does not exist`
**Error digest:** `2462853924`
**Where:** Every Payload API endpoint on Vercel
**Root cause:** `push: true` in `postgresAdapter` is hardcoded to skip when
`NODE_ENV=production`. Vercel always sets `NODE_ENV=production`. So the schema was
never created.
**Fix:** Use `prodMigrations` array in `postgresAdapter`. Payload runs these on every
cold start and tracks them via `payload_migrations` table.
```ts
prodMigrations: [
  { name: '20250513_initial', up: initialMigration.up, down: initialMigration.down },
],
```

---

### ERROR 3 — Admin panel completely unstyled (white/broken UI)
**Where:** `/admin` after login was reached
**Root cause:** `@payloadcms/next/css` (306KB Payload admin stylesheet) was never
imported in the admin layout.
**Fix:** Add to `src/app/(payload)/admin/[[...segments]]/layout.tsx`:
```ts
import '@payloadcms/next/css'
```

---

### ERROR 4 — Admin dashboard blank/black content area
**Where:** `/admin` dashboard after login
**Root cause:** `globals.css` was imported in the root `app/layout.tsx`, so its rules
(`body { background: #000 }`, `* { padding: 0; margin: 0 }`, font overrides) bled into
Payload's admin panel and destroyed its CSS.
**Fix:** Remove `globals.css` from root layout entirely. Import it only in
`src/app/(frontend)/layout.tsx` so it never touches admin routes.

---

### ERROR 5 — ESLint build failure after adding `.eslintrc.json`
**Where:** Vercel build step (linting)
**Root cause:** New strict config caught pre-existing `@typescript-eslint/no-explicit-any`
and `react/no-unescaped-entities` errors across many page files, treating them as errors.
**Fix:** `.eslintrc.json` — set as warnings, not errors:
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off"
  }
}
```

---

### ERROR 6 — `EMAXCONNSESSION: max clients reached in session mode`
**Where:** Every Payload API call at runtime (Vercel serverless)
**Root cause:** Supabase session pooler (PgBouncer session mode, port 5432) caps at
15 total connections. Vercel serverless creates a new connection pool per function
invocation (default `max: 10`). 2 warm instances = 20 connections → instant failure.
**Fix (part A):** Switch `DATABASE_URI` to Supabase **transaction pooler** (port **6543**)
and append `?pgbouncer=true`:
```
postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```
**Fix (part B):** Add `max: 1` to the pool config in `payload/payload.config.ts`:
```ts
pool: {
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
  max: 1,  // one connection per serverless invocation
},
```
**Never use:** Session pooler (port 5432) for serverless deployments.

---

### ERROR 7 — `ENOTFOUND tenant/user postgres.PROJECT_REF not found`
**Where:** Vercel build logs during static page generation AND runtime cold starts
**Root cause:** Two sub-causes:
  1. Vercel's build runners have different network routing than serverless functions
     and cannot reliably reach the Supabase pooler at all.
  2. `generateStaticParams` was calling `getPayload()` during build, triggering a
     full Payload DB init + migration check from the build runner network.
**Fix:** See ERROR 8 and ERROR 9 below (force-dynamic + remove generateStaticParams).

---

### ERROR 8 — Fatal DB errors on CMS-dependent pages during build
**Where:** Build logs — `blog/page.tsx`, `portfolio/page.tsx`, `blog/[slug]`, `portfolio/[slug]`
**Root cause:** `export const revalidate = 60` causes Next.js to pre-render pages at
build time, which called `getPayload()` from a build runner that can't reach the DB.
**Fix:** Replace `revalidate = 60` with `force-dynamic` on ALL pages that call `getPayload()`:
```ts
// CORRECT — never pre-rendered, always rendered at request time
export const dynamic = 'force-dynamic'

// WRONG — triggers DB call from build runner
export const revalidate = 60
```

---

### ERROR 9 — `generateStaticParams` still calls DB even with `force-dynamic`
**Where:** Build logs — `blog/[slug]/page.tsx`, `portfolio/[slug]/page.tsx`
**Root cause:** Next.js executes `generateStaticParams` during build to discover routes,
even on `force-dynamic` pages. This triggered `getPayload()` → DB connection → fatal error.
**Fix:** Remove `generateStaticParams` entirely from `force-dynamic` pages.
All slugs render on-demand at request time. `dynamicParams = true` (the default) handles unknown slugs.
```ts
// DELETE this entire function from force-dynamic pages:
export async function generateStaticParams() { ... }
```

---

### ERROR 10 — Sitemap calling DB during build
**Where:** Build logs — `app/sitemap.ts`
**Root cause:** `sitemap()` called `getPayload()` unconditionally, including during
`next build` when the DB is unreachable from build runners.
**Fix:** Add a build-phase guard at the top of `sitemap()`:
```ts
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

export default async function sitemap() {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return staticRoutes  // skip DB entirely during build
  }
  // ... normal DB fetch at runtime
}
```

---

### ERROR 11 — Incomplete migration (tables missing in production)
**Where:** Admin panel — `/api/users/me` and `/api/payload-preferences/nav` returning 500
**Root cause:** The entire migration was written as a single `await db.execute(sql\`...\`)`
block with all DDL statements. Drizzle's parameterized query handling does not reliably
execute multi-statement blocks — tables near the bottom (`payload_preferences`,
`payload_preferences_rels`, `payload_locked_documents`, etc.) were silently skipped.
**Fix:** Every single DDL statement must be its own `await db.execute(sql\`...\`)` call:
```ts
// CORRECT
await db.execute(sql`CREATE TABLE IF NOT EXISTS "users" (...);`)
await db.execute(sql`CREATE TABLE IF NOT EXISTS "media" (...);`)
await db.execute(sql`CREATE TABLE IF NOT EXISTS "payload_preferences" (...);`)

// WRONG — statements at the bottom silently don't execute
await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "users" (...);
  CREATE TABLE IF NOT EXISTS "media" (...);
  CREATE TABLE IF NOT EXISTS "payload_preferences" (...);
`)
```

---

### ERROR 12 — TypeScript assignability error in `generateStaticParams`
**Where:** Build — `blog/[slug]/page.tsx`, `portfolio/[slug]/page.tsx`
**Root cause:** Payload's `find()` with `select: { slug: true }` returns docs with
`slug` typed as `unknown`. Annotating the map parameter as `{ slug: string }` causes
a TypeScript assignability conflict.
**Fix:** Don't annotate the parameter — cast the value after access:
```ts
// CORRECT
res.docs.map((doc) => ({ slug: doc.slug as string }))

// WRONG — TS error: Type '{ slug: unknown }' is not assignable to '{ slug: string }'
res.docs.map((doc: { slug: string }) => ({ slug: doc.slug }))
```

---

### ERROR 13 — Admin panel hangs for 300 seconds then times out
**Error:** `Vercel Runtime Timeout Error: Task timed out after 300 seconds`
**Digest:** `1031758794`
**Where:** `/admin` on every request after fixing DATABASE_URI
**Root cause:** Payload's admin initialization uses `Promise.all()` internally to run
multiple DB queries in parallel. With `max: 1` in the pool config, only one query gets
a connection — all others wait in the pool queue with **no timeout**, so they hang
indefinitely until Vercel kills the function at 300 seconds.
The `max: 1` restriction was added to fix EMAXCONNSESSION (ERROR 6), but that issue was
specific to the **session pooler** (port 5432). Since switching to the **transaction pooler**
(port 6543), PgBouncer handles multiplexing at its own level — `max: 1` is no longer
needed and causes a pool deadlock on concurrent queries.
**Fix:** `payload/payload.config.ts`:
```ts
pool: {
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
  max: 5,                          // was 1 — safe on transaction pooler
  connectionTimeoutMillis: 10000,  // fail fast instead of hanging 300s
},
push: process.env.NODE_ENV !== 'production', // explicit production guard
```
**Rule:** `max: 1` is only needed for the session pooler (port 5432). With the
transaction pooler (port 6543), use `max: 5` or higher. Always add
`connectionTimeoutMillis` to prevent silent 300s hangs.

---

### WARNING 1 — `<img>` tag LCP warning
**Where:** Build warning — any file using a raw `<img>` tag (hit in `services/page.tsx` and `AdminLogo.tsx`)
**Root cause:** Raw `<img>` tag used instead of Next.js `<Image>`. Applies to ALL files including Payload admin custom components.
**Fix:** Always use `<Image>` from `next/image`:
```tsx
import Image from 'next/image'

// Fixed dimensions (e.g. logos):
<Image src="/logo.svg" alt="..." width={320} height={183} priority />

// Fill-mode inside a positioned container:
<Image src={url} alt="..." fill className="object-cover" />
```
**Never use:** `<img src={...} />` anywhere — frontend pages, admin components, or otherwise. Always `<Image>`.

---

### WARNING 2 — Node.js Version Override / engine conflict warning on Vercel
**Where:** Build warnings — `package.json` + "Node.js Version Override" badge in Vercel Deployment Settings
**Attempts and what happened:**
1. `"node": ">=18.20.2"` → Vercel warns it will auto-upgrade on new major releases
2. `"node": ">=18.20.2 <23"` → Vercel warns "Node.js Version Override — project settings (22.x) will be used instead"
3. `"node": "22.x"` → Same "Node.js Version Override" warning still appears

**Root cause:** The warning fires whenever BOTH of these exist simultaneously:
  - `engines.node` in `package.json`
  - An explicit Node.js version set in **Vercel → Project Settings → General → Node.js Version**
  Even if both say the same version, Vercel warns about the override conflict.

**Correct fix (Vercel dashboard — not code):**
  Go to **Vercel → Project Settings → General → Node.js Version → remove the override (set to default)**.
  Vercel will then read `engines.node` from `package.json` as the single source of truth.

**Final fix:** Remove the `engines` field from `package.json` entirely.
**Gotcha:** When removing the last field in a JSON object, also remove the trailing comma
from the field above it — JSON does not allow trailing commas. Caused build failure:
`Expected double-quoted property name in JSON at position 1024`

**Final fix:** Remove the `engines` field from `package.json` entirely.
Vercel's project-level Node.js version setting takes over as the single source of truth.
No conflict = no warning. The Node.js version is still pinned via Vercel project settings.

**Rule:** Do NOT add an `engines` field to `package.json` for this project.
Vercel controls the Node.js version through its project settings. Having both causes the
"Node.js Version Override" warning on every build. If the Node.js version needs changing,
update it in **Vercel → Project Settings** only.

---

### ERROR 17 — Blank create-user page (admin form hidden by CSS)
**Where:** `/admin/collections/users/create` — entire form content area blank
**Root cause (part A):** `admin.css` used `div:has(input#field-password)` to hide Payload's
built-in password fields. CSS `:has()` matches **every ancestor div** up the tree, not just
the immediate parent. This caused the Auth section container, the Form wrapper, and every
other ancestor `<div>` to be hidden with `display: none !important` — hiding the entire form.
**Root cause (part B):** The selector was not scoped, so `.field-type.password` also matched
the login page's password field, hiding it and preventing login.
**Fix:** `src/app/(payload)/admin/admin.css`:
```css
/* CORRECT — targets only Payload's field wrapper, scoped to users collection */
.collection-edit--users .field-type.password,
.collection-edit--users .field-type.confirm-password {
  display: none !important;
}

/* WRONG — :has() matches ALL ancestor divs, hiding the entire form */
div:has(input#field-password) { display: none !important; }

/* WRONG — not scoped, also hides the login page password field */
.field-type.password { display: none !important; }
```
**Key facts:**
- Payload's password field wrapper class: `field-type password` (`fieldBaseClass = 'field-type'` + `'password'`)
- Payload adds `collection-edit--users` to the `<main>` element on the users create/edit page only
- The admin login form also uses `field-type password` — never hide it globally

---

## Payload Admin — Architecture Rules

### Admin layout (`src/app/(payload)/admin/[[...segments]]/layout.tsx`)
Must always have:
1. `import '@payloadcms/next/css'` — without this the admin UI is completely unstyled
2. `serverFunction` must be an async function with `'use server'` in the body
3. Never import `globals.css` here or anywhere in `(payload)` routes

### Root layout (`src/app/layout.tsx`)
Must be a minimal shell — no CSS imports, no client code:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
```
`suppressHydrationWarning` on both `<html>` and `<body>` is required — Payload's
`RootLayout` injects `data-theme`, `dir`, and `lang` attributes at runtime.

### Frontend layout (`src/app/(frontend)/layout.tsx`)
This is the only place for:
- `import '../globals.css'`
- `CookieBanner`
- Organisation LD-JSON structured data

---

## Database Rules

### Connection (Vercel + Supabase)
- **Transaction pooler only** — port `6543`, append `?pgbouncer=true`
- **Never session pooler** — port `5432` caps at 15 connections, causes `EMAXCONNSESSION`
- **`max: 1`** in pool config — one connection per serverless function
- SSL required: `ssl: { rejectUnauthorized: false }`

### Migrations
- `push: true` is ignored in production — use `prodMigrations` array
- Each DDL statement = its own `await db.execute(sql\`...\`)` — no multi-statement blocks
- **Single-line statements only** — multiline template content can cause edge cases with Drizzle's sql tag
- **NEVER use `DO $$ BEGIN ... END $$;`** — Drizzle's `sql` tag mishandles PostgreSQL dollar-quoting (`$$`); the block fails (see ERROR 24)
- **NEVER use REFERENCES / inline FK constraints in CREATE TABLE** — Drizzle + PgBouncer rejects them (see ERROR 24); omit FKs entirely; Payload works without DB-level FK constraints
- **Idempotency for new tables**: use `DROP TABLE IF EXISTS` then `CREATE TABLE` (no IF NOT EXISTS on CREATE); safe because new tables start empty. Do NOT use `CREATE TABLE IF NOT EXISTS` with any REFERENCES or complex column definitions
- **Idempotency for new columns**: use `ALTER TABLE "x" ADD COLUMN IF NOT EXISTS "col" type;` — this is safe and works correctly
- **Idempotency for indexes**: use `CREATE INDEX IF NOT EXISTS` — safe
- DB reset (`DROP SCHEMA public CASCADE`) wipes `payload_migrations` — next cold start re-runs all migrations from scratch

### DB reset procedure (when needed)
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
After reset: redeploy on Vercel so the new cold start runs migrations cleanly.

---

## ESLint Config (`.eslintrc.json`)
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off"
  }
}
```

---

### ERROR 14 — `ERR_REQUIRE_ASYNC_MODULE` during `payload generate:importmap`
**Error:** `Error [ERR_REQUIRE_ASYNC_MODULE]: require() cannot be used on an ESM graph with top-level await`
**Where:** Build logs — `payload generate:importmap` step
**Root cause:** Node.js 22+ added support for `require()`-ing sync ESM modules, but NOT modules with top-level `await`. `@payloadcms/storage-s3` (via AWS SDK v3) uses top-level await. tsx's CJS register hook causes Node.js to attempt `require()` on that ESM graph, which Node.js 22+/24 rejects.
**Fix:** Change Node.js version to **20.x** in **Vercel → Project Settings → General → Node.js Version**.
Node.js 20 does not attempt `require(esm)` at all — tsx uses its own transform pipeline and avoids the issue entirely.
**Never use Node.js 22 or 24** for this project while `@payloadcms/storage-s3` (or any package using top-level await) is in the dependency tree. Stick to Node.js 20.x LTS.

---

### ERROR 15 — `ERR_MODULE_NOT_FOUND` for migration files during `payload generate:importmap`
**Error:** `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/vercel/path0/payload/migrations/20250513_initial'`
**Where:** Build logs — `payload generate:importmap` step
**Root cause:** Migration imports in `payload.config.ts` had no file extension. tsx running in ESM mode requires explicit extensions to resolve TypeScript files.
**Fix (part A):** Add `.ts` extension to all migration imports in `payload/payload.config.ts`:
```ts
import * as initialMigration from './migrations/20250513_initial.ts'
```
**Fix (part B):** Add `"allowImportingTsExtensions": true` to `tsconfig.json` so TypeScript's type-checking pass in `next build` doesn't reject `.ts` import extensions.
Precondition: `"noEmit": true` must already be set (it is, since Next.js handles emission via SWC).

---

### ERROR 16 — `TypeError: Illegal constructor` in undici during `payload generate:importmap`
**Error:** `TypeError: TypeError: Illegal constructor` at `new CacheStorage` in `undici/lib/web/cache/cachestorage.js`
**Where:** Build logs — `payload generate:importmap` step (on Node.js 20.x)
**Root cause:** tsx's CJS register hook (used internally by the Payload CLI) triggers a conflict between the `undici` npm package (pulled in by `@payloadcms/storage-s3` → AWS SDK v3) and Node.js 20's own built-in undici (used for the stable `fetch` API). The two copies use different `Symbol` / `WeakSet` instances for identity checks, so `new CacheStorage()` fails with `Illegal constructor`.
**Fix:** Remove `payload generate:importmap` from the Vercel build command. Use `"build": "next build"` only. Maintain `importMap.ts` manually and commit it to git.
**Why not auto-generate:** The Payload CLI's tsx-based config loading is incompatible with Node.js 20 + `@payloadcms/storage-s3` due to the undici conflict. Node.js 24 had `ERR_REQUIRE_ASYNC_MODULE` (async ESM), Node.js 20 has `Illegal constructor` (undici). There is no Vercel-compatible Node.js version where auto-generation works cleanly with the S3 plugin present.
**Rule for importMap.ts maintenance:** When adding a new custom component to any collection or global, add it to `src/app/(payload)/admin/importMap.ts` manually. The file only needs entries for dynamically-resolved components (custom `admin.components.*` entries and plugin-provided client handlers). Payload's own core components that are statically imported do NOT need entries.

---

---

### ERROR 18 — `resendAdapter` crashes build when `RESEND_API_KEY` is empty
**Error:** `Error: Missing API key. Pass it to the constructor 'new Resend("re_123")'`
**Where:** Build logs — "Collecting page data" at `app/api/contact/route.js`
**Root cause:** The Resend SDK throws immediately in the constructor when `apiKey` is `''`. During Next.js's build phase, even `force-dynamic` routes have their module imported (to read exports like `dynamic`, `revalidate`). This imports Payload config → initialises `resendAdapter({ apiKey: '' })` → throws → build exits with code 1.
**Wrong fix:** Setting `apiKey: process.env.RESEND_API_KEY || ''` — the `|| ''` fallback feeds an empty string to Resend which is what causes the throw.
**Fix:** Conditionally include the email adapter only when the key is present:
```ts
...(process.env.RESEND_API_KEY
  ? {
      email: resendAdapter({
        defaultFromAddress: 'noreply@xqubestudio.com',
        defaultFromName: 'XQube Studio',
        apiKey: process.env.RESEND_API_KEY,
      }),
    }
  : {}),
```
**Rule:** Never pass `|| ''` to an SDK constructor that validates its key. Always guard with a conditional so the adapter is only instantiated when the env var is actually set.

---

### ERROR 19 — `'baseURL' does not exist in type 'S3StorageOptions'`
**Error:** `Type error: Object literal may only specify known properties, and 'baseURL' does not exist in type 'S3StorageOptions'.`
**Where:** Build logs — TypeScript type-check at `payload/payload.config.ts:839`
**Root cause:** `baseURL` is not a valid top-level option on `@payloadcms/storage-s3`. The correct way to set the public URL for uploaded files is `generateFileURL` inside `collections.media`.
**Wrong fix:** `baseURL: 'https://...'` at the top level of `s3Storage({...})`.
**Fix:** Move URL generation inside `collections.media.generateFileURL`:
```ts
s3Storage({
  acl: 'public-read', // valid top-level option
  collections: {
    media: {
      generateFileURL: ({ filename, prefix }) => {
        const cdnBase = process.env.DO_SPACES_CDN_URL
          || `https://${process.env.DO_SPACES_BUCKET || 'xqube-web-media'}.${process.env.DO_SPACES_REGION || 'fra1'}.cdn.digitaloceanspaces.com`
        return `${cdnBase}${prefix ? `/${prefix}` : ''}/${filename}`
      },
    },
  },
  bucket: process.env.DO_SPACES_BUCKET || 'xqube-web-media',
  config: { ... },
})
```
**Rule:** Always check `node_modules/@payloadcms/storage-s3/dist/index.d.ts` for the actual `S3StorageOptions` type before adding new options. Valid top-level options: `acl`, `bucket`, `clientCacheKey`, `clientUploads`, `collections`, `config`, `disableLocalStorage`, `enabled`, `signedDownloads`, `useCompositePrefixes`.

---

### ERROR 22 — Version child (array) tables: wrong `id` type and missing `_uuid` column
**Error:** `Failed query: select ... "_about_page_v_version_credentials"."_uuid" ...` → `err: {}`
**Where:** Runtime — Vercel logs when querying any global that has array fields and `versions: { drafts: true }`
**Root cause:** Payload passes array child fields through `idToUUID()` before building version child tables. This renames the `id` field to `_uuid`. Then `setColumnID()` finds no `id` field and generates a fresh `serial` primary key. Hand-written migrations used `"id" varchar PRIMARY KEY` (wrong type, wrong for version tables) and omitted the `_uuid varchar` column entirely.
**Correct schema for every version child table:**
```sql
CREATE TABLE "_home_page_v_version_stats" (
  "_order"     integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id"         serial PRIMARY KEY NOT NULL,  -- serial, NOT varchar
  "_uuid"      varchar,                      -- required: holds original UUID
  "value"      varchar,
  "label"      varchar
);
```
**Wrong schema (do not use):**
```sql
"id"  varchar PRIMARY KEY NOT NULL,  -- ← wrong type for version child tables
-- missing: "_uuid" varchar           -- ← required column
```
**Also:** For nested array tables (e.g. `_services_page_v_version_pipelines_steps`), `_parent_id` references the parent child table's `id` which is now `serial` (integer) — so `_parent_id` must be `integer`, not `varchar`.
**Rule:** Version child tables always use `id serial PRIMARY KEY` + `_uuid varchar`. Regular (non-version) child tables use `id varchar PRIMARY KEY` (UUID string). Never mix the two patterns.

---

### ERROR 21 — Global version tables missing `version_updated_at` / `version_created_at`
**Error:** `Failed query: select "_about_page_v"."id", ... "_about_page_v"."version_updated_at", "_about_page_v"."version_created_at" ...` → admin globals 404
**Where:** Runtime — Vercel logs when `versions: { drafts: true }` is enabled on any global
**Root cause:** Payload automatically adds `updatedAt` and `createdAt` as **base fields** to every global. When a global has `versions: { drafts: true }`, Payload wraps ALL global fields (including those base fields) inside a `version` group. The result is that the version table gets `version_updated_at` and `version_created_at` columns in addition to the top-level `created_at`/`updated_at` from `timestamps: true`. Hand-written migrations that only model user-defined fields miss these base-field columns entirely.
**Wrong:** Only including `created_at`/`updated_at` in the `_*_v` table schema.
**Fix:** Every global version table (`_home_page_v`, `_about_page_v`, etc.) must have ALL of these timestamp columns:
```sql
"version_updated_at" timestamp(3) with time zone,   -- from global's base updatedAt inside version group
"version_created_at" timestamp(3) with time zone,   -- from global's base createdAt inside version group
"updated_at"         timestamp(3) with time zone DEFAULT now() NOT NULL,  -- from timestamps:true
"created_at"         timestamp(3) with time zone DEFAULT now() NOT NULL,  -- from timestamps:true
```
**Rule:** When writing version table migrations for Payload globals, ALWAYS include `version_updated_at` and `version_created_at` columns. Also see ERROR 22 for child table schema rules. These are invisible in the global config (they're Payload base fields, not user-defined), but they ARE in the version table because the entire global field set — including base fields — is wrapped inside the `version` group.

---

### ERROR 20 — Admin globals return 404 after enabling `versions: { drafts: true }`
**Error:** `GET /admin/globals/home-page 404` — Payload admin renders "This page could not be found"
**Where:** Runtime — all `/admin/globals/*` routes after deploying `versions: { drafts: true }` on globals
**Root cause:** `versions: { drafts: true }` requires `_<slug>_v` version tables in the DB (e.g. `_home_page_v`, `_about_page_v`). If the migration creating those tables fails or hasn't run, Payload cannot initialise the globals and returns 404 for every global admin route.
**Important:** Live Preview (`useLivePreview` iframe in admin) works **without** `versions: { drafts: true }` — it is pure `postMessage` and does not touch version tables. Only the Save Draft → Publish workflow needs versions enabled.
**Fix (immediate):** Comment out `versions: { drafts: true }` on all globals to restore the admin. Live Preview continues to work.
**Fix (proper — future):** Before re-enabling versions, verify the version table schema against what Payload v3 actually generates by running with `push: true` in a local dev environment, dumping the auto-created schema, and using that as the migration template. The hand-written `20250517_global_versions.ts` migration may have schema mismatches.
**Rule:** Never enable `versions: { drafts: true }` on globals in production without first verifying the version table schema in a local dev environment with `push: true`.

---

## DigitalOcean Spaces — Image Upload Rules

### Public access setup
- **File Listing** (Settings → File Listing): Controls directory listing ONLY. Does NOT make individual files public.
- **Per-file ACL**: Must use `acl: 'public-read'` in `s3Storage()` so every uploaded file gets public read permissions.
- **CDN**: When CDN is enabled on the bucket, use the CDN endpoint as the base URL: `https://{bucket}.{region}.cdn.digitaloceanspaces.com`
- **`next.config.mjs` remotePatterns**: Must include both origin and CDN hostnames:
  ```js
  { protocol: 'https', hostname: '**.digitaloceanspaces.com' },     // origin
  { protocol: 'https', hostname: '**.cdn.digitaloceanspaces.com' }, // CDN
  ```

### Why images broke after admin upload
Without `generateFileURL`, Payload falls back to serving files through `/api/media/file/{filename}`. That route is gated by the media collection's `access.read` (set to `isLoggedIn`), so public visitors get 403. Setting `generateFileURL` returns a direct CDN URL bypassing Payload's access control entirely.

---

### ERROR 23 — Payload live preview iframe shows "refused to connect"
**Error:** `[host] refused to connect.` broken-document icon inside the live preview iframe panel
**Where:** Payload admin → any global edit page with live preview enabled
**Root cause:** `vercel.json` had `{ "key": "X-Frame-Options", "value": "DENY" }` applied to ALL routes (`/(.*)`). `X-Frame-Options: DENY` instructs the browser to never allow the page to be embedded in any iframe, regardless of origin. Chrome renders this as the "refused to connect" broken-document error page inside the iframe — it is NOT a TCP connection error despite the wording.
**Wrong fixes tried:**
1. Using `window.location.origin` as `serverURL` in `useLivePreview` — gives the iframe's own origin, not the admin's origin; doesn't affect the frame-blocking issue at all
2. Adding `Content-Security-Policy: frame-ancestors` in `next.config.mjs` without removing the `X-Frame-Options: DENY` from `vercel.json` — `vercel.json` headers are applied at Vercel's edge and can override Next.js response headers
**Correct fix (three parts):**
1. **`vercel.json`** — Remove `X-Frame-Options: DENY` from the global `/(.*)`  rule; add it back scoped to `/admin(.*)` only (admin still protected from clickjacking):
```json
{ "source": "/(.*)",     "headers": [/* nosniff, xss-protection, referrer — no X-Frame-Options */] },
{ "source": "/admin(.*)", "headers": [{ "key": "X-Frame-Options", "value": "DENY" }] }
```
2. **`next.config.mjs`** — Add `Content-Security-Policy: frame-ancestors` on frontend routes to explicitly allow both admin origins:
```js
async headers() {
  return [{
    source: '/((?!admin).*)',
    headers: [{
      key: 'Content-Security-Policy',
      value: [
        "frame-ancestors 'self'",
        'https://xqube-studio-web.vercel.app',
        process.env.NEXT_PUBLIC_SITE_URL,
      ].filter(Boolean).join(' '),
    }],
  }]
},
```
3. **`useLivePreview` serverURL** — Use `document.referrer` to dynamically get the admin's actual origin for `ready()` postMessage (the targetOrigin must match whatever URL the admin is accessed from):
```ts
serverURL: typeof window !== 'undefined'
  ? (window !== window.parent && document.referrer
    ? new URL(document.referrer).origin
    : window.location.origin)
  : serverURL,
```
**Why `document.referrer`:** When the frontend page is loaded inside the admin's iframe, `document.referrer` is set to the parent admin page URL. Extracting `.origin` from it gives the exact admin origin at runtime — works regardless of whether admin is accessed via the Vercel URL or the custom domain.
**Rule:** Never apply `X-Frame-Options: DENY` globally in `vercel.json` on a project that uses Payload live preview. Always scope it to `/admin(.*)` only, and control frontend framing policy via CSP `frame-ancestors` in `next.config.mjs`.

---

### ERROR 24 — Migration CREATE TABLE fails with `"type": "f"` error on cold start
**Error:** `Error running migration <name> Failed query: CREATE TABLE IF NOT EXISTS "tools" (...) err: { "type": "f", ... }` or `DO $$ BEGIN ... END $$; err: { "type": "f", ... }`
**Where:** Runtime — Vercel logs on cold start when a migration contains `REFERENCES` inline in `CREATE TABLE` or `DO $$ ... $$` blocks
**Root cause (two related issues):**
1. `DO $$ BEGIN ... END $$;` — Drizzle's `sql` tag mishandles PostgreSQL dollar-quoting (`$$`); fails before reaching DB.
2. `CREATE TABLE IF NOT EXISTS "x" (... "col" varchar REFERENCES "other"("id") ...)` — when the table already exists from a previous partial migration, Drizzle + PgBouncer transaction mode rejects the `REFERENCES` clause in the `CREATE TABLE` statement.
**Wrong fixes tried:**
- `DO $body$ BEGIN ... END $body$;` — same dollar-quoting issue
- `CREATE TABLE IF NOT EXISTS` with inline `REFERENCES` — rejected by Drizzle/PgBouncer when table pre-exists
**Correct fix:** For NEW tables (no existing production data):
```ts
// CORRECT — drop first, then plain CREATE (no FK constraints, no IF NOT EXISTS)
await db.execute(sql`DROP TABLE IF EXISTS "portfolio_tools_used";`) // children first
await db.execute(sql`DROP TABLE IF EXISTS "tools";`)
await db.execute(sql`CREATE TABLE "tools" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "logo_id" varchar, "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL, "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL);`)
// No REFERENCES/FK constraints — Payload works without DB-level FKs

// WRONG
await db.execute(sql`CREATE TABLE IF NOT EXISTS "tools" ("logo_id" varchar REFERENCES "media"("id") ON DELETE SET NULL, ...);`)

// WRONG
await db.execute(sql`DO $$ BEGIN ALTER TABLE "tools" ADD CONSTRAINT ... END $$;`)
```
**Rule:** Never use `DO $$ ... $$` blocks. Never use inline `REFERENCES` in `CREATE TABLE`. For new empty tables: `DROP IF EXISTS` then plain `CREATE TABLE`. For new columns on existing tables: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (safe and works). FK constraints are never needed — Payload manages relationships in its own query layer.

---

## Git Rule
**Never push to git unless the user explicitly asks.** Always commit locally first,
show what was changed, then wait for "push" confirmation.

## CLAUDE.md Maintenance Rule
**Whenever any error or warning is fixed — in this chat or any future chat — immediately
update this CLAUDE.md file** with:
- The error/warning message (exact text)
- Where it appeared (build log, runtime, which file)
- Root cause
- The wrong fix (if one was tried first)
- The correct fix with code example
- The rule to prevent recurrence

This file is the single source of truth for this project. Keep it current.
