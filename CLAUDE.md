# XQube Studio Web — Project Rules for Claude

## Stack
- Next.js 15 App Router · Payload CMS v3 · Supabase (Postgres) · Tailwind CSS · Vercel

---

## Build Rules (enforce every commit — these caused real build failures)

### 1. Never use `<img>` — always use `<Image>` from next/image
```tsx
// WRONG
<img src={url} alt="..." className="..." />

// CORRECT
import Image from 'next/image'
<Image src={url} alt="..." width={800} height={600} className="..." />
// or with fill:
<Image src={url} alt="..." fill className="object-cover" />
```
ESLint will warn, Next.js will penalise LCP. No exceptions.

---

### 2. Pages that call `getPayload()` must use `force-dynamic`
Vercel build runners cannot reach the Supabase transaction pooler. Any page
that calls `getPayload()` (directly or via a data-fetching helper) must have:
```ts
export const dynamic = 'force-dynamic'
```
Do NOT use `export const revalidate = N` on these pages — it causes build-time
DB calls that fail with `ENOTFOUND tenant/user`.

---

### 3. Never add `generateStaticParams` to pages with `force-dynamic`
Next.js still executes `generateStaticParams` during build even on
`force-dynamic` pages, which triggers `getPayload()` → DB connection → build
error. Simply omit it. All slugs render on-demand at request time.

---

### 4. Sitemap must skip DB during build
`app/sitemap.ts` must bail out early during `next build`:
```ts
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
  return staticRoutes  // skip DB entirely during build
}
```

---

### 5. No `any` types — use proper types or targeted casts
ESLint is set to `"@typescript-eslint/no-explicit-any": "warn"`. Fix the
underlying type, or use a targeted `as SomeType` cast with a comment explaining
why. Never silence with `// eslint-disable-next-line`.

Payload's `find()` with `select` returns fields typed as `unknown` — cast after
access:
```ts
res.docs.map((doc) => ({ slug: doc.slug as string }))
// NOT: (doc: { slug: string }) => ...  ← TypeScript rejects this
```

---

## Database / Supabase Rules

### Connection
- Use **transaction pooler** (port **6543**) for `DATABASE_URI` — not session
  pooler (port 5432, which caps at 15 connections and causes `EMAXCONNSESSION`
  on Vercel serverless).
- Add `?pgbouncer=true` to the connection string.
- Keep `max: 1` in `postgresAdapter pool` config to limit connections per
  serverless function invocation.

### Migrations
- `push: true` is ignored in production (`NODE_ENV=production`). Use
  `prodMigrations` array in `postgresAdapter` for schema changes on Vercel.
- Write each DDL statement as a separate `await db.execute(sql\`...\`)` call —
  never one giant multi-statement block (Drizzle doesn't reliably execute them).
- Always use `IF NOT EXISTS` / `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object`
  patterns for idempotency.
- Resetting the DB (`DROP SCHEMA public CASCADE`) also wipes `payload_migrations`,
  so the next cold start re-runs all `prodMigrations` from scratch. This is
  intentional and required after a DB reset.

---

## Payload CMS Rules

### Admin layout
- `handleServerFunctions` must be wrapped in an async function with `'use server'`
  before being passed as `serverFunction` prop — it cannot be passed directly.
- `import '@payloadcms/next/css'` must be in the admin layout or the UI renders
  completely unstyled.

### CSS isolation
- `globals.css` (which sets `body { background: #000 }` etc.) must only be
  imported in `src/app/(frontend)/layout.tsx` — never in the root layout.
  If it bleeds into `(payload)` routes it destroys Payload's admin CSS.

---

## Vercel / Next.js Rules

- `package.json` engines must be pinned with an upper bound:
  `"node": ">=18.20.2 <23"` — prevents Vercel auto-upgrading to an untested
  future major Node version.
- Never push to git unless explicitly asked by the user.
