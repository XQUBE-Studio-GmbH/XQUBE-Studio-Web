# XQUBE Studio — Official Website

Official marketing website for **XQUBE Studio GmbH**, a AAA game art and XR production studio headquartered in Vienna, Austria with hubs in Dubai (MENA) and Dhaka (Production).

**Live:** https://www.xqubestudio.com
**Repository:** https://github.com/XQUBE-Studio-GmbH/XQUBE-Studio-Web

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, `force-dynamic`) |
| CMS | Payload CMS v3 (postgres adapter) |
| Database | Supabase (PostgreSQL, transaction pooler port 6543) |
| Media Storage | DigitalOcean Spaces (S3-compatible CDN, WebP auto-conversion on upload) |
| Hosting | Vercel — Frankfurt region |
| Styling | Tailwind CSS v3 |
| Language | TypeScript (strict mode, zero `any`) |
| Email | Resend |
| Analytics | Google Analytics 4 (GDPR Consent Mode v2) |
| Node.js | 20.x (pinned in Vercel project settings) |
| Font | Urbanist (self-hosted via `next/font/google`, no render-blocking request) |

---

## Design System

| Token | Value |
|---|---|
| Font | Urbanist (Google Fonts, self-hosted) |
| Background | `#000000` |
| Card | `#0E0E0E` |
| Accent | `#14CB72` |
| Muted text | `#8D95A8` |
| Light text | `#C4CAD8` |
| Border | `#1A1A1A` |

Tailwind aliases: `xq-bg`, `xq-card`, `xq-accent`, `xq-muted`, `xq-light`, `xq-border`, `xq-surface`

Component classes: `.xq-container`, `.xq-section`, `.xq-card`, `.xq-btn-primary`, `.xq-btn-ghost`, `.xq-label`, `.xq-input`

---

## Project Structure

```
xqube-web/
├── public/
│   ├── logo.svg
│   └── llms.txt                           # LLM discovery file (llmstxt.org spec)
├── scripts/
│   ├── migrate-images-to-webp.ts  # One-time JPG/PNG → WebP bulk migration
│   ├── run-seo-migration.ts       # One-time SEO fields backfill
│   ├── seed-services.ts           # Seed script — service records via REST API
│   └── seed.ts                    # Seed script — general CMS data
├── src/
│   ├── middleware.ts                      # Markdown content negotiation (Accept: text/markdown)
│   ├── app/
│   │   ├── layout.tsx                     # Root layout — minimal shell
│   │   ├── globals.css                    # Design system tokens & component classes
│   │   ├── robots.ts                      # Sitemap pointer + explicit AI bot allow rules
│   │   ├── sitemap.ts                     # Dynamic sitemap — STATIC_PAGES + CMS_COLLECTIONS
│   │   ├── (frontend)/                    # Marketing site route group
│   │   │   ├── layout.tsx                 # Navbar + Footer + GA4 + cookie consent + JSON-LD
│   │   │   ├── page.tsx                   # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── services/
│   │   │   │   ├── page.tsx               # Services listing with pipeline tabs
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx           # Service detail — tools, related portfolio, FAQs
│   │   │   │       └── index.md/route.ts  # Markdown version for AI crawlers (all slugs)
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx               # Portfolio grid with category filter
│   │   │   │   └── [slug]/page.tsx        # Portfolio detail — gallery, video, tools
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx        # Blog article with Lexical rich-text
│   │   │   ├── contact/page.tsx           # Contact form → Resend + CMS save
│   │   │   ├── scope/
│   │   │   │   ├── page.tsx               # Project scoping tool — multi-step quote form
│   │   │   │   ├── ScopingForm.tsx
│   │   │   │   └── confirmed/page.tsx     # Post-submit confirmation with Calendly embed
│   │   │   ├── privacy/page.tsx
│   │   │   ├── cookies/page.tsx
│   │   │   └── dev/email-preview/page.tsx # Dev-only email template preview
│   │   ├── (payload)/                     # Payload CMS route group
│   │   │   ├── admin/
│   │   │   │   ├── admin.css              # Custom admin overrides
│   │   │   │   └── importMap.ts           # Manually maintained import map
│   │   │   └── api/                       # Payload REST API
│   │   ├── .well-known/
│   │   │   ├── ai-plugin.json/route.ts    # OpenAI plugin manifest
│   │   │   ├── openapi.json/route.ts      # OpenAPI 3.1 spec for AI tool use
│   │   │   ├── api-catalog/route.ts       # RFC 9727 API catalog
│   │   │   ├── oauth-authorization-server/route.ts
│   │   │   └── oauth-protected-resource/route.ts
│   │   └── api/
│   │       ├── contact/route.ts           # Contact form → Resend + saves to CMS
│   │       ├── scope/route.ts             # Scope form submission handler
│   │       └── invite-user/route.ts       # Admin invite → Resend
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CookieBanner.tsx               # GA4 Consent Mode v2 banner
│   │   ├── PortfolioGallery.tsx           # Gallery grid with fullscreen lightbox
│   │   ├── ScrollReveal.tsx
│   │   ├── PageHero.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── StatCounter.tsx                # Animated stats counter
│   │   ├── GeneratePasswordButton.tsx     # Admin: password gen + invite send
│   │   ├── UsersSaveButton.tsx            # Admin: hides Save on create (invite handles it)
│   │   ├── admin/
│   │   │   ├── MustChangePasswordGuard.tsx  # Blocks panel until password is changed
│   │   │   ├── AdminLogo.tsx
│   │   │   ├── AdminIcon.tsx
│   │   │   ├── AdminStyles.tsx
│   │   │   └── SlugField.tsx              # Auto-generates URL slug from title
│   │   └── live-preview/                  # Live-preview client wrappers (one per page)
│   │       ├── HomePageClient.tsx
│   │       ├── AboutPageClient.tsx
│   │       ├── ServicesPageClient.tsx
│   │       ├── BlogPageClient.tsx
│   │       ├── ContactPageClient.tsx
│   │       ├── FooterClient.tsx
│   │       ├── NavbarClient.tsx
│   │       └── PortfolioPageClient.tsx
│   ├── instrumentation.node.ts            # Runs DB migrations + clears locks on startup
│   ├── types/
│   │   └── cms.ts                         # Shared CMS TypeScript interfaces
│   └── lib/
│       ├── buildPageMetadata.ts           # Shared Next.js Metadata builder
│       ├── cachedData.ts                  # All data fetchers with unstable_cache + tags
│       ├── jsonLd.ts                      # JSON-LD schema builders (Organization, BreadcrumbList, etc.)
│       ├── livePreview.ts
│       ├── og.tsx                         # OpenGraph image generation helpers
│       ├── serializeLexical.ts            # Lexical rich-text → HTML
│       └── useParallaxOffset.ts           # Parallax scroll hook
├── payload/
│   ├── payload.config.ts                  # Full CMS configuration + revalidation hooks
│   ├── constants.ts                       # Role constants (ROLES.SUPER_ADMIN etc.)
│   └── migrations/                        # All production migrations
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── CLAUDE.md                              # Project rules & resolved error log for AI context
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero slideshow, stats, client strip, engine badges, featured work, services, process, engagement models, CTA |
| `/about` | About — intro, credentials, hubs, team, why XQUBE, CTA |
| `/services` | Services listing with pipeline tabs |
| `/services/[slug]` | Service detail — description, tools, related portfolio work, FAQ accordion |
| `/services/[slug]/index.md` | Markdown version of service detail for AI crawlers |
| `/portfolio` | Portfolio grid with category filter |
| `/portfolio/[slug]` | Portfolio detail — gallery lightbox, video embed, tools used, related work |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog article — Lexical rich-text, cover image, SEO meta |
| `/contact` | Contact form (sends via Resend + saves to CMS) |
| `/scope` | Project scoping tool — multi-step quote form, saves brief to CMS |
| `/scope/confirmed` | Post-submit confirmation with Calendly embed |
| `/privacy` | Privacy Policy |
| `/cookies` | Cookie Policy |
| `/admin` | Payload CMS admin panel |
| `/llms.txt` | LLM discovery file — services, portfolio, team, contact info |
| `/.well-known/ai-plugin.json` | OpenAI plugin manifest |
| `/.well-known/openapi.json` | OpenAPI 3.1 spec |
| `/.well-known/api-catalog` | RFC 9727 API catalog |

---

## Payload CMS

Admin panel at `/admin`. All DB schema changes are managed via `prodMigrations` in `payload.config.ts` — applied automatically on cold start via `instrumentation.node.ts`.

### User Roles

| Role | Access |
|---|---|
| `super-admin` | Full access — can create/delete users, access everything |
| `admin` | Can manage users, all content, all settings |
| `content-editor` | Can create/edit/delete content; cannot manage users or settings |
| `viewer` | Read-only — can browse the admin but cannot edit anything |

### Collections

| Slug | Description |
|---|---|
| `users` | Admin accounts with invite flow, role management, and forced password change on first login |
| `media` | File uploads (images + video) stored on DigitalOcean Spaces CDN — auto-converted to WebP on upload, with alt text and folder organisation |
| `portfolio` | Portfolio items — title, slug, category, hero image, gallery, video, overview (Lexical), tools used, specs, SEO fields, status (draft / published / archived) |
| `services` | Service definitions with features, platforms, and tool references |
| `team-members` | Team profiles with photo, role, bio |
| `blog-posts` | Blog articles with Lexical rich-text, cover image, SEO fields |
| `contact-submissions` | All contact form submissions saved to CMS — name, email, company, message, timestamp |
| `faqs` | FAQ entries with category (`general` or `service-specific`), linked service, question, answer, and sort order — rendered as accordions with `FAQPage` JSON-LD |
| `clients` | Client logos — managed inline via Homepage → Client Logo Strip (hidden from sidebar) |
| `tools` | Software/tool library (name, logo, category) — referenced by Portfolio and Homepage Engine Badges (hidden from sidebar) |

### Globals

| Slug | Group | Description |
|---|---|---|
| `site-settings` | Settings | Studio name, tagline, contact info, social links, Calendly URL, footer copy, GA ID, global SEO defaults |
| `navigation` | Settings | Menu links with per-link visibility toggle, CTA button |
| `home-page` | Pages | Full homepage — hero slides, studio intro, client logo strip, engine badges, featured work, process steps, showreel, testimonials, stats, engagement models, CTA, SEO |
| `about-page` | Pages | Hero, intro, credentials, hubs, why XQUBE cards, SEO |
| `services-page` | Services | Services hero, production pipeline tabs, SEO |
| `portfolio-page` | Portfolio | Portfolio hero, drag-to-reorder display order, SEO |
| `contact-page` | Pages | Contact hero and section copy, SEO |
| `blog-page` | Blog | Blog hero and section copy, SEO |

### Key Admin Features

- **Invite flow** — Admins generate a password and send an invitation email in one click. New users must change their password on first login (`MustChangePasswordGuard` blocks the panel until they do)
- **Instant cache revalidation** — Every `afterChange` and `afterDelete` hook calls `revalidateTag()` automatically. Changes made in the admin panel are live on the frontend within seconds — no 5-minute wait
- **SEO fields** — Every portfolio item, blog post, service, and page global has Meta Title, Meta Description, OG Image, and noIndex toggle
- **WebP auto-conversion** — Images uploaded via the media library are automatically converted to WebP (quality 85) by a `beforeOperation` hook before the S3 plugin saves them to DigitalOcean Spaces. No manual conversion needed
- **Dynamic sitemap** — `sitemap.ts` generates entries from `STATIC_PAGES` (hardcoded routes) and `CMS_COLLECTIONS` (queries Payload for all published portfolio items, services, and blog posts). Add new static routes or CMS-driven collections in one place
- **Contact submissions inbox** — Every contact form submission is saved to the `contact-submissions` CMS collection in addition to being emailed via Resend. Browse and filter submissions in the admin panel
- **JSON-LD structured data** — Organization, WebSite, BlogPosting, Service/ItemList, CreativeWork, FAQPage, and BreadcrumbList schemas emitted on every relevant page. Helps Google Knowledge Panel and LLM crawlers identify the studio
- **FAQ system** — `faqs` CMS collection with category (`general` or `service-specific`) and per-service linking. Accordions auto-render on service detail pages and the about page. `FAQPage` JSON-LD emitted per page. 38 entries auto-seeded across 7 pages via production migrations. No manual entry needed to launch
- **Project scoping tool** — `/scope` multi-step quote form. Submits to `/api/scope`, saves a structured brief to the `contact-submissions` collection, then redirects to `/scope/confirmed` which embeds the Calendly booking widget
- **Media folders** — Visual folder tree in the Media library for organising uploads
- **Drag-to-reorder** — Client Logo Strip and Engine Badges on the Homepage global; Portfolio display order on the Portfolio Page global
- **Nav visibility** — Each nav link has a Visible toggle; uncheck to hide without deleting
- **Portfolio archive** — Status field: `draft`, `published`, `archived` — soft-delete without permanent removal
- **Gallery lightbox** — Portfolio gallery opens fullscreen with arrow navigation and ESC to close
- **Live Preview** — Edit any page global and see the site update in real-time in the split-screen preview panel
- **Auto-migrations** — `instrumentation.node.ts` runs `payload.db.migrate()` on every cold start; no manual `payload migrate` step needed on deploy

---

## SEO & Structured Data

JSON-LD schemas are emitted via inline `<script type="application/ld+json">` tags on each page:

| Page | Schemas |
|---|---|
| All pages (layout) | `Organization` (with `alternateName`), `WebSite` (with `SearchAction`) |
| `/blog/[slug]` | `BlogPosting`, `BreadcrumbList` |
| `/services` | `ItemList` of `Service` |
| `/services/[slug]` | `Service`, `FAQPage` |
| `/portfolio/[slug]` | `CreativeWork`, `BreadcrumbList` |
| `/contact` | `LocalBusiness` |
| `/about` | `Organization` with `Person[]` team members, `FAQPage` |

Builder utilities live in `src/lib/jsonLd.ts`. Organization and social links are pulled from the `site-settings` global so they stay in sync with CMS data.

`Organization` includes `alternateName` fields (`"XQUBE"`, `"XQube"`, `"XQube Studio"`) to help LLM entity resolution link the studio's mentions across the web.

---

## AI & LLM Discoverability

The site implements a full LLM discoverability stack so AI assistants (ChatGPT, Perplexity, Gemini, Claude, Grok) can accurately describe the studio when users ask about game art studios.

| Mechanism | Path | Purpose |
|---|---|---|
| **llms.txt** | `/llms.txt` | Plain-text studio summary per [llmstxt.org](https://llmstxt.org) spec — services, portfolio, contact, team |
| **AI bot allow rules** | `/robots.txt` | Explicit `Allow: /` for GPTBot, Claude-Web, PerplexityBot, Googlebot-Extended, and other LLM crawlers |
| **Markdown content negotiation** | `src/middleware.ts` | Rewrites requests with `Accept: text/markdown` to `/index.md` handlers — serves structured Markdown instead of HTML |
| **Per-service Markdown** | `/services/[slug]/index.md` | Consolidated `[slug]/index.md/route.ts` serves Markdown summaries for all 6 service pages. Accessible by AI crawlers that prefer Markdown |
| **OpenAPI spec** | `/.well-known/openapi.json` | OpenAPI 3.1 spec describing available endpoints |
| **AI plugin manifest** | `/.well-known/ai-plugin.json` | OpenAI plugin manifest for tool-use integrations |
| **API catalog** | `/.well-known/api-catalog` | RFC 9727 API catalog — links to OpenAPI spec and plugin manifest |
| **`Link` headers** | All responses | `rel=api-catalog` and `rel=describedby` headers on every page response |
| **alternateName in JSON-LD** | Layout | `Organization` schema includes alternate brand spellings for entity resolution |

> **Architectural note:** The per-service Markdown routes live under `[slug]/index.md/route.ts` (a single consolidated handler), **not** as static directories like `uefn-roblox/index.md/route.ts`. Static named directories inside a route group that also has a `[slug]/page.tsx` will shadow the dynamic route and cause 404s for the matching slugs — Next.js static segments take priority over `[slug]`. See CLAUDE.md ERROR 28.

---

## Media & Image Pipeline

All media is stored on **DigitalOcean Spaces** (Frankfurt CDN).

### WebP auto-conversion (upload time)
Images uploaded through the Payload admin are intercepted by a `beforeOperation` hook in `payload.config.ts` that converts them to WebP at quality 85 using `sharp` before the file reaches the S3 storage plugin. The filename, mime type, and filesize are all updated so the DB record reflects the converted file.

> **Note:** Payload's built-in `formatOptions` upload config only works with local disk storage — it is bypassed by `@payloadcms/storage-s3`, which uploads the original file before Payload's sharp processing runs. The `beforeOperation` hook approach works at a lower level and guarantees conversion regardless of storage backend.

SVGs, GIFs, videos, and already-WebP files are skipped automatically. If sharp fails for any reason, the original file is saved as a fallback rather than blocking the upload.

### Bulk migration script
A one-time migration script converts existing JPG/PNG images to WebP in-place:
```bash
# Dry run — shows what would be converted, no changes made
npx tsx --env-file=.env.local scripts/migrate-images-to-webp.ts

# Execute — converts and uploads WebP, deletes originals
npx tsx --env-file=.env.local scripts/migrate-images-to-webp.ts --execute
```
Document IDs are preserved — all CMS references update automatically since the same media record ID is kept.

### `unoptimized: true` (important)
`next.config.mjs` has `images: { unoptimized: true }`. This bypasses Vercel's `/_next/image` optimisation pipeline entirely. **Do not remove this** while on Vercel's free plan. The free plan caps at ~1,000 unique image source URLs/month — after the 199-image WebP migration exceeded that quota, Vercel returned HTTP 402 on all images. With `unoptimized: true`, images are served directly from the DO Spaces CDN (already WebP) without hitting the quota.

> If upgrading to Vercel Pro, `unoptimized: true` can be removed to re-enable responsive `srcset` generation.

---

## Cache Architecture

All data fetchers in `src/lib/cachedData.ts` use `unstable_cache` with tag-based invalidation. Tags are revalidated instantly when content is saved in the CMS — no waiting for TTL expiry.

| Cache Tag | Invalidated By |
|---|---|
| `home` | `home-page` global, `portfolio`, `services`, `clients`, `tools` collections |
| `about` | `about-page` global, `team-members`, `media` collections |
| `services` | `services-page` global, `services`, `tools` collections |
| `portfolio` | `portfolio-page` global, `portfolio`, `tools` collections |
| `blog` | `blog-page` global, `blog-posts` collection |
| `contact` | `contact-page` global, `site-settings` global |
| `layout` | `navigation` global, `site-settings` global, `media` collection |
| `faqs` | `faqs` collection, `about`, `services` |

Default TTL: 300–600 seconds (fallback for changes outside the CMS).

### `getServiceBySlug` — React `cache()` instead of `unstable_cache`

`getServiceBySlug` is wrapped with React's `cache()` rather than `unstable_cache`. This deduplicates the DB query within a single request (e.g. `generateMetadata` + page component both calling it) without persisting `null` across requests. `unstable_cache` would permanently cache a `null` return from the first cold-start request if the seed migrations hadn't run yet — React `cache()` avoids this because it never survives beyond the current request.

### Vercel CDN — `Cache-Control: no-store` for service pages

`next.config.mjs` sets `Cache-Control: no-store` on `/services/:slug` responses. This prevents the Vercel edge CDN from caching 404 responses that were generated before content was seeded — without it, a CDN-cached 404 will continue serving even after the page starts returning 200.

---

## Performance

Current PageSpeed Insights scores (mobile):

| Metric | Score |
|---|---|
| Performance | ~84 |
| LCP | ~4.4s (hero h1, fully SSR — first paint has no animation delay) |
| FCP | ~1.8s |
| CLS | 0 |
| TBT | ~50ms |

### Optimisations applied
- **Hero video mobile skip** — The 3–4 MB hero video is not loaded on mobile (`window.matchMedia('(min-width: 768px)')` check after mount). Mobile gets the hero image only
- **LCP animation fix** — Hero h1 skips `animate-[fadeUp]` (which starts at opacity:0) on first paint. Subsequent slide transitions still animate. Prevents ~2.5s LCP delay from CSS animation
- **WebP images** — All 199 media library images migrated to WebP (50–70% smaller than JPEG)
- **Self-hosted font** — Urbanist loaded via `next/font/google` (self-hosted, no render-blocking third-party request)
- **Legacy polyfill removal** — Removed `@babel/polyfill` and similar unused legacy bundles
- **OG image quota fix** — `next.config.mjs` rewrites OG image requests to bypass Vercel's `/_next/image` optimisation pipeline. Without this, auto-generated OG images hit the monthly image transformation quota on the free plan
- **CDN preconnect** — `<link rel="preconnect">` to DO Spaces CDN added in layout
- **Image `sizes` props** — All `fill`-mode `<Image>` components have correct `sizes` props for accurate browser hint selection

### Known remaining opportunities
- **Responsive image sizing** — `unoptimized: true` serves full-resolution WebP regardless of screen size. Upgrade to Vercel Pro to re-enable `srcset` generation
- **CDN cache TTL** — DO Spaces default is 1 hour. Setting `Cache-Control: max-age=31536000` (1 year) on media files would improve repeat-visit LCP
- **Render-blocking CSS** — ~560ms from Tailwind's CSS bundle. Addressable with CSS splitting / critical CSS extraction
- **GTM unused JS** — Google Tag Manager injects ~64KB of unused JS. Consider loading conditionally post-interaction

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URI` | Supabase PostgreSQL transaction pooler URL (`port 6543`, append `?pgbouncer=true`) |
| `PAYLOAD_SECRET` | 32-char random secret for Payload JWT signing |
| `NEXT_PUBLIC_SITE_URL` | Full production URL (e.g. `https://www.xqubestudio.com`) |
| `RESEND_API_KEY` | Resend API key — contact form + invite emails |
| `CONTACT_EMAIL` | Recipient for contact form submissions |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`) |
| `DO_SPACES_KEY` | DigitalOcean Spaces access key |
| `DO_SPACES_SECRET` | DigitalOcean Spaces secret key |
| `DO_SPACES_BUCKET` | Spaces bucket name |
| `DO_SPACES_REGION` | Spaces region (e.g. `fra1`) |
| `DO_SPACES_CDN_URL` | CDN endpoint URL for public file serving |

---

## Local Development

**Prerequisites:** Node.js 20.x, npm

```bash
# 1. Clone the repository
git clone https://github.com/XQUBE-Studio-GmbH/XQUBE-Studio-Web.git
cd XQUBE-Studio-Web/xqube-web

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in all values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
Payload admin: [http://localhost:3000/admin](http://localhost:3000/admin)

> **Note:** `push: true` is active in development — Payload auto-syncs the DB schema locally. In production, `push` is disabled and `prodMigrations` runs instead via `instrumentation.node.ts`.

---

## Deployment

Deployed on **Vercel** (Frankfurt region, Node.js 20.x). All environment variables are set in the Vercel project dashboard.

- Every push to `main` triggers an automatic deploy
- DB migrations run automatically on the next cold start after deploy (no manual step needed)
- Media files are served from DigitalOcean Spaces CDN — never stored on Vercel

### Important rules
- **Never** use `npm audit fix --force` — it would downgrade Next.js to v9
- **Never** push to `main` without explicit sign-off from the project owner
- Node.js is pinned to **20.x** in Vercel — do not add an `engines` field to `package.json` and do not change to 22.x or 24.x (breaks `@payloadcms/storage-s3` import resolution — see CLAUDE.md ERROR 14)
- **Never remove `unoptimized: true`** from `next.config.mjs` without first upgrading Vercel to Pro or provisioning an alternative image resizer — removing it on the free plan will immediately cause HTTP 402 errors on all images once the monthly quota is exceeded
- **Never create static named directories inside a route group that also has a `[slug]/page.tsx`** — e.g. adding `services/uefn-roblox/` will shadow the `[slug]` dynamic route and cause 404s for that slug. Next.js resolves static segments before dynamic ones. If you need sub-routes under a specific slug, create them under `[slug]/` (e.g. `[slug]/index.md/route.ts`). See CLAUDE.md ERROR 28

---

## Migration Notes

All schema changes go through `prodMigrations` in `payload/payload.config.ts`. Key rules (full details in `CLAUDE.md`):

- Each DDL statement = its own `await db.execute(sql\`...\`)` call
- Never use `DO $$ ... $$` dollar-quoting blocks
- Never use inline `REFERENCES` in `CREATE TABLE`
- Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for adding columns
- For new tables: `DROP TABLE IF EXISTS` then plain `CREATE TABLE`
- When changing array subfields on a versioned global, update both the regular child table **and** the version child table (`_<slug>_v_version_<field>`)

---

## Contact

**XQUBE Studio GmbH**
Rathausstrasse 21/12, 1010 Vienna, Austria
info@xqubestudio.com

[LinkedIn](https://www.linkedin.com/company/xqubestudio) · [ArtStation](https://www.artstation.com/xqubestudio)
