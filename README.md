# XQube Studio — Official Website

Official marketing website for **XQube Studio GmbH**, a AAA game art and XR production studio headquartered in Vienna, Austria with hubs in Dubai (MENA) and Dhaka (Production).

**Live (testing):** https://xqube-website2.vercel.app  
**Production domain:** https://www.xqubestudio.com *(DNS switch to Vercel pending full QA)*  
**Repository:** https://github.com/XQUBE-Studio-GmbH/XQUBE-Studio-Web

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS v3 (postgres adapter) |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel — Frankfurt region |
| Styling | Tailwind CSS v3 |
| Language | TypeScript (strict mode) |
| Email | Resend |
| Analytics | Google Analytics 4 (GDPR consent-gated) |

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
│   └── logo.svg                     # Brand logo (viewBox cropped to content)
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout — GA4, JSON-LD, metadata
│   │   ├── globals.css              # Design system tokens & component classes
│   │   ├── robots.ts                # robots.txt
│   │   ├── sitemap.ts               # sitemap.xml (static)
│   │   ├── (frontend)/              # Marketing site route group
│   │   │   ├── layout.tsx           # Navbar + Footer wrapper
│   │   │   ├── page.tsx             # Home
│   │   │   ├── about/page.tsx       # About
│   │   │   ├── services/page.tsx    # Services
│   │   │   ├── portfolio/page.tsx   # Portfolio
│   │   │   ├── blog/page.tsx        # Blog
│   │   │   ├── contact/page.tsx     # Contact (form → Resend)
│   │   │   ├── privacy/page.tsx     # Privacy Policy
│   │   │   └── cookies/page.tsx     # Cookie Policy
│   │   ├── (payload)/               # Payload CMS route group
│   │   │   ├── admin/               # CMS admin panel at /admin
│   │   │   └── api/                 # Payload REST API
│   │   └── api/
│   │       └── contact/route.ts     # Contact form API → Resend
│   ├── components/
│   │   └── Navbar.tsx               # Mobile-responsive navbar (client component)
│   └── lib/                         # Shared utilities
├── payload/
│   └── payload.config.ts            # Payload CMS configuration
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/services` | Services |
| `/portfolio` | Portfolio |
| `/blog` | Blog |
| `/contact` | Contact — form sends via Resend |
| `/privacy` | Privacy Policy |
| `/cookies` | Cookie Policy |
| `/admin` | Payload CMS |

---

## Payload CMS

Admin panel at `/admin`. Collections and globals configured:

**Collections**
- `users` — Admin accounts with 5 role levels: Super Admin, Admin, BD Manager, Content Editor, Viewer
- `media` — File uploads with alt text
- `portfolio` — Portfolio items (title, slug, category, image, featured, status)
- `services` — Service definitions
- `team-members` — Team profiles
- `clients` — Client logos and details
- `blog-posts` — Blog articles with rich-text content

**Globals**
- `site-settings` — Sitename, tagline, contact info, Calendly URL, footer copy, GA ID
- `navigation` — Main nav links and CTA button

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URI` | Supabase PostgreSQL connection string |
| `PAYLOAD_SECRET` | 32-char random secret for Payload CMS |
| `NEXT_PUBLIC_SITE_URL` | Full site URL (e.g. `https://www.xqubestudio.com`) |
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `CONTACT_EMAIL` | Recipient email for contact form submissions |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

---

## Local Development

**Prerequisites:** Node.js 18+, npm

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

Open [http://localhost:3000](http://localhost:3000) in your browser.  
Payload CMS admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deployment

The site is deployed on **Vercel** (Frankfurt region). All environment variables are set in the Vercel project dashboard.

**Testing deployment:** https://xqube-website2.vercel.app

DNS switch from Wix to Vercel will happen after full local QA is complete. No pushes to `main` without explicit sign-off.

---

## Services

1. **Game Art Production** — Characters, environments, weapons, vehicles, props, UI/UX. Platforms: UE5, Unity, UEFN, Roblox.
2. **VR Game Assets** — Production-ready assets for Meta Quest, HTC Vive, PSVR2.
3. **Interactive Development** — UEFN islands, Roblox experiences, VR games (Unity C# + Unreal Blueprint).
4. **Staff Augmentation** — Dedicated resources embedded in client pipelines.

---


## Contact

**XQube Studio GmbH**  
Rathausstrasse 21/12, 1010 Vienna, Austria  
info@xqubestudio.com  
[calendly.com/tanvirkhandlxqsmgs](https://calendly.com/tanvirkhandlxqsmgs)

[LinkedIn](https://www.linkedin.com/company/xqubestudio) · [ArtStation](https://www.artstation.com/xqubestudio)
