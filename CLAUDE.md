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
**Where:** Build warning — `src/app/(frontend)/services/page.tsx`
**Root cause:** Raw `<img>` tag used for pipeline showcase images instead of Next.js `<Image>`.
**Fix:** Always use `<Image>` from `next/image`. For fill-mode inside a positioned container:
```tsx
import Image from 'next/image'
// container must have position: relative (or aspect-* class)
<Image src={url} alt="..." fill className="object-cover" />
```
**Never use:** `<img src={...} />` — always `<Image>`.

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
- Always `IF NOT EXISTS` / `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object` for idempotency
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
