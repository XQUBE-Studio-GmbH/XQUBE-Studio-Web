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
| Media Storage | DigitalOcean Spaces (S3-compatible CDN) |
| Hosting | Vercel — Frankfurt region |
| Styling | Tailwind CSS v3 |
| Language | TypeScript (strict mode) |
| Email | Resend |
| Analytics | Google Analytics 4 (GDPR Consent Mode v2) |
| Node.js | 24.x (pinned in Vercel project settings) |

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
│   │   ├── layout.tsx                     # Root layout — minimal shell
│   │   ├── globals.css                    # Design system tokens & component classes
│   │   ├── robots.ts
│   │   ├── sitemap.ts                     # Build-phase guarded sitemap
│   │   ├── (frontend)/                    # Marketing site route group
│   │   │   ├── layout.tsx                 # Navbar + Footer + GA4 + cookie consent
│   │   │   ├── page.tsx                   # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx               # Portfolio grid with category filter
│   │   │   │   └── [slug]/page.tsx        # Portfolio detail — gallery, video, tools
│   │   │   ├── blog/page.tsx
│   │   │   ├── contact/page.tsx           # Contact form → Resend
│   │   │   ├── privacy/page.tsx
│   │   │   └── cookies/page.tsx
│   │   ├── (payload)/                     # Payload CMS route group
│   │   │   ├── admin/
│   │   │   │   └── admin.css              # Custom admin overrides
│   │   │   └── api/                       # Payload REST API
│   │   └── api/
│   │       ├── contact/route.ts           # Contact form → Resend
│   │       └── invite-user/route.ts       # Admin invite → Resend
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CookieBanner.tsx               # GA4 Consent Mode v2 banner
│   │   ├── PortfolioGallery.tsx           # Gallery grid with fullscreen lightbox
│   │   ├── ScrollReveal.tsx
│   │   ├── PageHero.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── GeneratePasswordButton.tsx     # Admin: password gen + invite send
│   │   ├── UsersSaveButton.tsx            # Admin: hides Save on create (invite handles it)
│   │   ├── admin/
│   │   │   ├── MustChangePasswordGuard.tsx  # Blocks panel until password is changed
│   │   │   ├── AdminLogo.tsx
│   │   │   ├── AdminIcon.tsx
│   │   │   └── SlugField.tsx              # Auto-generates URL slug from title
│   │   └── live-preview/                  # Live-preview client wrappers (one per page)
│   │       ├── HomePageClient.tsx
│   │       ├── AboutPageClient.tsx
│   │       ├── ServicesPageClient.tsx
│   │       ├── NavbarClient.tsx
│   │       └── ...
│   ├── instrumentation.ts                 # Runs DB migrations + clears locks on startup
│   ├── types/
│   │   └── cms.ts                         # Shared CMS TypeScript interfaces
│   └── lib/
│       ├── serializeLexical.ts            # Lexical rich-text → HTML
│       └── livePreview.ts
├── payload/
│   ├── payload.config.ts                  # Full CMS configuration
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
| `/` | Home — hero slideshow, stats, client strip, engine badges, featured work, services, process, CTA |
| `/about` | About — intro, credentials, hubs, team, why XQUBE, CTA |
| `/services` | Services listing with pipeline tabs |
| `/portfolio` | Portfolio grid with category filter |
| `/portfolio/[slug]` | Portfolio detail — gallery lightbox, video embed, tools used |
| `/blog` | Blog listing |
| `/contact` | Contact form (sends via Resend) |
| `/privacy` | Privacy Policy |
| `/cookies` | Cookie Policy |
| `/admin` | Payload CMS admin panel |

---

## Payload CMS

Admin panel at `/admin`. All DB schema changes are managed via `prodMigrations` in `payload.config.ts` — applied automatically on cold start via `instrumentation.ts`.

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
| `media` | File uploads (images + video) stored on DigitalOcean Spaces CDN — with alt text and folder organisation |
| `portfolio` | Portfolio items — title, slug, category, hero image, gallery, video, overview (Lexical), tools used, specs, SEO fields, status (draft / published / archived) |
| `services` | Service definitions with features, platforms |
| `team-members` | Team profiles with photo, role, bio |
| `blog-posts` | Blog articles with Lexical rich-text, cover image, SEO fields |
| `clients` | Client logos — managed inline via Homepage → Client Logo Strip (hidden from sidebar) |
| `tools` | Software/tool library (name, logo, category) — referenced by Portfolio and Homepage Engine Badges (hidden from sidebar) |

### Globals

| Slug | Group | Description |
|---|---|---|
| `site-settings` | Settings | Studio name, tagline, contact info, social links, Calendly URL, footer copy, GA ID, global SEO defaults |
| `navigation` | Settings | Menu links with per-link visibility toggle, CTA button |
| `home-page` | Pages | Full homepage — hero slides, studio intro, client logo strip, engine badges, featured work, process steps, showreel, testimonials, stats, CTA, SEO |
| `about-page` | Pages | Hero, intro, credentials, hubs, why XQUBE cards, SEO |
| `services-page` | Services | Services hero, production pipeline tabs, SEO |
| `portfolio-page` | Portfolio | Portfolio hero, drag-to-reorder display order, SEO |
| `contact-page` | Pages | Contact hero and section copy, SEO |
| `blog-page` | Blog | Blog hero and section copy, SEO |

### Key Admin Features

- **Invite flow** — Admins generate a password and send an invitation email in one click. New users must change their password on first login (`MustChangePasswordGuard` blocks the panel until they do)
- **SEO fields** — Every portfolio item, blog post, and page global has Meta Title, Meta Description, OG Image, and noIndex toggle
- **Media folders** — Visual folder tree in the Media library for organising uploads
- **Drag-to-reorder** — Client Logo Strip and Engine Badges on the Homepage global; Portfolio display order on the Portfolio Page global
- **Nav visibility** — Each nav link has a Visible toggle; uncheck to hide without deleting
- **Portfolio archive** — Status field: `draft`, `published`, `archived` — soft-delete without permanent removal
- **Gallery lightbox** — Portfolio gallery opens fullscreen with arrow navigation and ESC to close
- **Live Preview** — Edit any page global and see the site update in real-time in the split-screen preview panel
- **Auto-migrations** — `instrumentation.ts` runs `payload.db.migrate()` on every cold start; no manual `payload migrate` step needed on deploy

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

**Prerequisites:** Node.js 24.x, npm

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

> **Note:** `push: true` is active in development — Payload auto-syncs the DB schema locally. In production, `push` is disabled and `prodMigrations` runs instead via `instrumentation.ts`.

---

## Deployment

Deployed on **Vercel** (Frankfurt region, Node.js 24.x). All environment variables are set in the Vercel project dashboard.

- Every push to `main` triggers an automatic deploy
- DB migrations run automatically on the next cold start after deploy (no manual step needed)
- Media files are served from DigitalOcean Spaces CDN — never stored on Vercel

### Important rules
- **Never** use `npm audit fix --force` — it would downgrade Next.js to v9
- **Never** push to `main` without explicit sign-off from the project owner
- Node.js is pinned to **24.x** in Vercel — do not add an `engines` field to `package.json`

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
