# XQube Studio — Website v2.0

**Stack:** Next.js 14 + Payload CMS 2.0 + Supabase + Vercel  
**Phase:** 1 — Full marketing site with dynamic CMS

---

## Project Structure

```
xqube-studio-web/
├── src/
│   ├── app/                      # Next.js pages (App Router)
│   │   ├── layout.tsx            # Root layout: SEO, GA4, Navbar, Footer
│   │   ├── page.tsx              # Homepage
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── sitemap.ts            # Auto-generated sitemap.xml
│   │   ├── robots.ts             # Auto-generated robots.txt
│   │   └── api/contact/          # Contact form → info@xqubestudio.com
│   ├── components/
│   │   ├── layout/               # Navbar, Footer, MobileNav
│   │   ├── ui/                   # Analytics (GA4), CookieBanner (GDPR)
│   │   └── sections/             # Page sections (Hero, Services, Portfolio...)
│   ├── lib/payload.ts            # All CMS data fetching helpers
│   └── styles/globals.css        # XQube design system CSS
├── payload/
│   ├── collections/              # CMS content types
│   │   ├── Users.ts              # Role-based access (5 roles)
│   │   ├── Media.ts              # Image/file uploads
│   │   ├── Portfolio.ts          # Portfolio items
│   │   ├── Services.ts           # Service offerings
│   │   ├── ContentCollections.ts # Team, Clients (logo strip), Blog
│   │   └── Inquiries.ts          # Phase 2: Lead management
│   ├── globals/Globals.ts        # Site Settings + Navigation
│   ├── payload.config.ts         # Main CMS configuration
│   └── admin.css                 # XQube-branded admin panel
├── .env.example                  # All required environment variables
├── tailwind.config.ts            # XQube design tokens
└── vercel.json                   # Production deployment config
```

---

## Setup Instructions

### Step 1 — Supabase (5 min)
1. [supabase.com](https://supabase.com) → New Project → Name: `xqube-studio`
2. Region: **Frankfurt** (eu-central-1) — closest to Vienna
3. Copy: Database URI (Settings → Database → URI), Project URL, anon key

### Step 2 — Resend Email (3 min)
1. [resend.com](https://resend.com) → Free account
2. Add domain: `xqubestudio.com` → add DNS records to Wix
3. Copy API key

### Step 3 — Environment Variables
Copy `.env.example` → `.env.local` and fill in all values.

### Step 4 — Deploy to Vercel
1. Push folder to private GitHub repo
2. Vercel → New Project → Import from GitHub
3. Add env variables in Vercel project settings
4. Deploy

### Step 5 — Connect Domain
1. Vercel → Settings → Domains → Add `www.xqubestudio.com`
2. Copy DNS records Vercel provides
3. Wix → Settings → Domains → Manage DNS → Add records
4. Wait 24–48 hours

### Step 6 — Create Admin Account
1. Visit `https://www.xqubestudio.com/admin`
2. Create Super Admin on first visit
3. Start adding content

---

## Admin Roles

| Role | Access |
|---|---|
| Super Admin (Tanvir) | Everything + user management |
| Admin (Alin) | All content, no user management |
| BD Manager (Shifat) | Leads & inquiries only |
| Content Editor | Portfolio, pages, SEO |
| Viewer (Kaushik) | Read-only |

---

## Content Priority After Launch

1. Site Settings → logo, tagline, GA4 ID
2. Navigation → verify links
3. Portfolio → add all assets
4. Services → Game Art, XR, xKIT, Staff Aug
5. Team → visible team members
6. Clients → white logo versions of BMW, INDG, etc.

---

## Phase 2 (next build)
Quote builder + lead management + blog/Pritom + multilingual

*XQube Studio GmbH — xqubestudio.com*
