# XQube Studio — Official Website

Official marketing website for **XQube Studio GmbH**, a AAA game art and XR production studio headquartered in Vienna, Austria with hubs in Dubai (MENA) and Dhaka (Production).

**Live:** https://xqube-studio-web.vercel.app  
**Production domain:** https://www.xqubestudio.com  
**Repository:** https://github.com/XQUBE-Studio-GmbH/XQUBE-Studio-Web

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, `force-dynamic`) |
| CMS | Payload CMS v3 (postgres adapter) |
| Database | Supabase (PostgreSQL, transaction pooler port 6543) |
| Media Storage | DigitalOcean Spaces (S3-compatible CDN) |
| Hosting | Vercel — Frankfurt region |
| Styling | Tailwind CSS v3 |
| Language | TypeScript (strict mode) |
| Email | Resend |
| Analytics | Google Analytics 4 (GDPR consent-gated) |
| Node.js | 20.x (pinned in Vercel project settings) |

---

## Design System

| Token | Value |
|---|---|
| Font | Urbanist (Google Fonts) |
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
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout — minimal shell (no CSS)
│   │   ├── globals.css                  # Design system tokens & component classes
│   │   ├── robots.ts
│   │   ├── sitemap.ts                   # Build-phase guarded sitemap
│   │   ├── (frontend)/                  # Marketing site route group
│   │   │   ├── layout.tsx               # Navbar + Footer + globals.css
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── about/page.tsx           # About
│   │   │   ├── services/page.tsx        # Services
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx             # Portfolio listing with category filter
│   │   │   │   └── [slug]/page.tsx      # Portfolio detail with gallery lightbox
│   │   │   ├── blog/page.tsx            # Blog listing
│   │   │   ├── contact/page.tsx         # Contact (form → Resend)
│   │   │   ├── privacy/page.tsx
│   │   │   └── cookies/page.tsx
│   │   ├── (payload)/                   # Payload CMS route group
│   │   │   ├── admin/                   # /admin panel
│   │   │   └── api/                     # Payload REST API
│   │   └── api/
│   │       └── contact/route.ts         # Contact form → Resend
│   ├── components/
│   │   ├── Navbar.tsx                   # Responsive navbar — reads visible flag per link
│   │   ├── PortfolioGallery.tsx         # Gallery grid with fullscreen lightbox
│   │   ├── ScrollReveal.tsx
│   │   ├── PageHero.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── CookieBanner.tsx
│   │   └── live-preview/               # Live-preview client wrappers (one per page)
│   │       ├── HomePageClient.tsx
│   │       ├── AboutPageClient.tsx
│   │       ├── ServicesPageClient.tsx
│   │       ├── NavbarClient.tsx
│   │       └── ...
│   ├── types/
│   │   └── cms.ts                       # Shared CMS TypeScript interfaces
│   └── lib/
│       ├── serializeLexical.ts          # Lexical rich-text → HTML
│       └── livePreview.ts
├── payload/
│   ├── payload.config.ts                # Full CMS configuration
│   ├── constants.ts                     # Role constants
│   └── migrations/                      # All production migrations (applied via prodMigrations)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── CLAUDE.md                            # Project rules & resolved error log for AI context
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, stats, client strip, engine badges, featured work, services, process, CTA |
| `/about` | About — intro, credentials, hubs, team, why XQube, CTA |
| `/services` | Services listing |
| `/portfolio` | Portfolio grid with category filter |
| `/portfolio/[slug]` | Portfolio detail — gallery lightbox, video embed, tools used, related work |
| `/blog` | Blog listing |
| `/contact` | Contact form (sends via Resend) |
| `/privacy` | Privacy Policy |
| `/cookies` | Cookie Policy |
| `/admin` | Payload CMS admin panel |

---

## Payload CMS

Admin panel at `/admin`. All DB schema changes are managed via `prodMigrations` in `payload.config.ts` — Payload runs these automatically on cold start.

### Collections

| Slug | Description | Sidebar |
|---|---|---|
| `users` | Admin accounts — 5 roles: Super Admin, Admin, BD Manager, Content Editor, Viewer | ✓ |
| `media` | File uploads (DigitalOcean Spaces CDN) with alt text and folder field | ✓ |
| `portfolio` | Portfolio items — title, slug, category, hero image, gallery, video, overview (Lexical), tools used, specs, status (draft / published / archived) | ✓ |
| `services` | Service definitions with features, platforms, and pipeline steps | ✓ |
| `team-members` | Team profiles with photo, role, bio | ✓ |
| `blog-posts` | Blog articles with Lexical rich-text, cover image, tags | ✓ |
| `clients` | Client logos, sector, project note — managed inline via Homepage → Client Logo Strip | Hidden |
| `tools` | Software/tool library (name, logo, category) — managed inline via Homepage → Engine Badges and Portfolio → Tools Used | Hidden |

### Globals

| Slug | Group | Description |
|---|---|---|
| `site-settings` | Settings | Sitename, tagline, contact info, Calendly URL, footer copy, GA ID |
| `navigation` | Settings | Menu links with per-link visibility toggle, CTA button |
| `home-page` | Pages | Full homepage content — hero slides, studio intro, client logo strip (drag-to-reorder), engine badges (drag-to-reorder), featured work, process, showreel, testimonials, stats, CTA |
| `about-page` | Pages | Hero, intro, credentials, hubs, team layout, why XQube cards |
| `services-page` | Pages | Services hero and section copy |
| `portfolio-page` | Pages | Portfolio hero, category labels, featured work display order |
| `contact-page` | Pages | Contact hero and section copy |
| `blog-page` | Pages | Blog hero and section copy |

### Key Admin Features

- **Drag-to-reorder** — Client Logo Strip and Engine Badges on Homepage global support drag handles
- **Nav visibility** — Each nav link has a Visible checkbox; uncheck to hide without deleting (e.g. Blog hidden until content is ready)
- **Portfolio archive** — Status field supports `draft`, `published`, `archived` — soft-delete without permanent removal
- **Gallery lightbox** — Portfolio gallery images open fullscreen with arrow navigation, ESC to close
- **Tools Used** — Portfolio items reference the shared Tools collection; tools display with logo + name pill
- **Inline creation** — Clients and Tools can be created directly from the relationship pickers without leaving the current page

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URI` | Supabase PostgreSQL transaction pooler URL (`port 6543`, append `?pgbouncer=true`) |
| `PAYLOAD_SECRET` | 32-char random secret for Payload CMS |
| `NEXT_PUBLIC_SITE_URL` | Full site URL (e.g. `https://www.xqubestudio.com`) |
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `CONTACT_EMAIL` | Recipient email for contact form submissions |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID |
| `DO_SPACES_KEY` | DigitalOcean Spaces access key |
| `DO_SPACES_SECRET` | DigitalOcean Spaces secret key |
| `DO_SPACES_BUCKET` | Spaces bucket name |
| `DO_SPACES_REGION` | Spaces region (e.g. `fra1`) |
| `DO_SPACES_ENDPOINT` | Spaces endpoint URL |
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

> **Note:** `push: true` in the postgres adapter is active in development — Payload auto-syncs the schema locally. In production (Vercel), `push` is disabled and `prodMigrations` runs instead.

---

## Deployment

Deployed on **Vercel** (Frankfurt region, Node.js 20.x). All environment variables are set in the Vercel project dashboard.

- Every push to `main` triggers an automatic deploy
- DB migrations run automatically on the next cold start after deploy
- Media files are served from DigitalOcean Spaces CDN — not stored on Vercel

### Important deployment rules
- **Never** use `npm audit fix --force` — it would downgrade Next.js to v9
- **Never** push to `main` without explicit sign-off from the project owner
- Node.js version is pinned to **20.x** in Vercel project settings — do not add an `engines` field to `package.json`

---

## Migration Notes

All schema changes go through `prodMigrations` in `payload/payload.config.ts`. Key rules documented in `CLAUDE.md`:

- Each DDL statement = its own `await db.execute(sql\`...\`)` call
- Never use `DO $$ ... $$` dollar-quoting blocks
- Never use inline `REFERENCES` in `CREATE TABLE`
- When changing array field subfields on a versioned global, always update both the regular child table **and** the version child table (`_<slug>_v_version_<field>`)
- Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for adding columns to existing tables
- For new empty tables: `DROP TABLE IF EXISTS` then plain `CREATE TABLE`

---

## Contact

**XQube Studio GmbH**  
Rathausstrasse 21/12, 1010 Vienna, Austria  
info@xqubestudio.com  
[calendly.com/tanvirkhandlxqsmgs](https://calendly.com/tanvirkhandlxqsmgs)

[LinkedIn](https://www.linkedin.com/company/xqubestudio) · [ArtStation](https://www.artstation.com/xqubestudio)
