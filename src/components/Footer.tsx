import Link from 'next/link'
import Image from 'next/image'
import type { NavLink } from '@/components/Navbar'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SocialLink {
  id?:    string
  label:  string
  url:    string
  icon?:  { url?: string; alt?: string } | null
}

export interface SiteSettingsGlobal {
  tagline?: string
  contact?: {
    email?:       string
    phone?:       string
    address?:     string
    calendly?:    string
    socialLinks?: SocialLink[]
  }
  footerCopy?: string
  legalNote?:  string
}

// ─── Platform icons ───────────────────────────────────────────────────────────
// Inline SVGs for platforms whose logos never change.
// Priority: uploaded icon → inline SVG → text abbreviation.
// fill="currentColor" means they inherit the parent <a> hover colour automatically.
const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  artstation: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.927-.388-1.3L15.728 2.713A2.424 2.424 0 0 0 13.561 1.5H8.313l9.003 15.588 2.085 3.613A2.424 2.424 0 0 0 24 17.748zm-10.886-3.766L9.553 5.836 5.572 12.83l-.003.005h7.545z" />
    </svg>
  ),
}

// Text abbreviation fallback for platforms without an inline SVG.
const PLATFORM_ABBR: Record<string, string> = {
  facebook:  'fb',
  instagram: 'ig',
  twitter:   'X',
  x:         'X',
  youtube:   'YT',
  tiktok:    'TT',
  discord:   'DC',
  behance:   'Be',
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { label: 'LinkedIn',   url: 'https://www.linkedin.com/company/xqubestudio' },
  { label: 'ArtStation', url: 'https://www.artstation.com/xqubestudio' },
]

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Home',      url: '/' },
  { label: 'About',     url: '/about' },
  { label: 'Services',  url: '/services' },
  { label: 'Portfolio', url: '/portfolio' },
  { label: 'Blog',      url: '/blog' },
  { label: 'Contact',   url: '/contact' },
]

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  settings?: SiteSettingsGlobal
  navLinks?: NavLink[]
}

export default function Footer({ settings, navLinks: propNavLinks }: Props) {
  const tagline     = settings?.tagline             ?? 'AAA game art and XR production studio. Vienna · Dubai · Dhaka.'
  const email       = settings?.contact?.email      ?? 'info@xqubestudio.com'
  const phone       = settings?.contact?.phone
  const address     = settings?.contact?.address
  const calendly    = settings?.contact?.calendly   ?? 'https://calendly.com/tanvirkhandlxqsmgs'
  const socialLinks = settings?.contact?.socialLinks?.length
    ? settings.contact.socialLinks
    : DEFAULT_SOCIAL_LINKS
  const footerCopy  = settings?.footerCopy          ?? `© ${new Date().getFullYear()} XQUBE Studio GmbH. All rights reserved.`
  const legalNote   = settings?.legalNote           ?? 'GmbH registered in Vienna, Austria. GDPR compliant.'

  const visibleNavLinks = (propNavLinks && propNavLinks.length > 0 ? propNavLinks : DEFAULT_NAV_LINKS)
    .filter((link) => link.visible !== false)

  return (
    <footer className="border-t border-xq-border bg-xq-bg">
      <div className="xq-container py-12 md:py-16">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand block */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.svg" alt="XQUBE Studio" width={120} height={69} className="h-14 w-auto" />
            </Link>
            <p className="text-xq-muted text-sm leading-relaxed max-w-xs mt-4">
              {tagline}
            </p>
            {/* Dynamic social links */}
            <div className="flex flex-wrap gap-3 mt-6">
              {socialLinks.map((social, i) => (
                <a
                  key={social.id ?? i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors overflow-hidden"
                >
                  {social.icon?.url ? (
                    <Image
                      src={social.icon.url}
                      alt={social.icon.alt || social.label}
                      width={18}
                      height={18}
                      className="object-contain opacity-60 group-hover:opacity-100"
                    />
                  ) : PLATFORM_ICONS[social.label.toLowerCase()] ? (
                    PLATFORM_ICONS[social.label.toLowerCase()]
                  ) : (
                    <span className="text-xs font-bold">
                      {PLATFORM_ABBR[social.label.toLowerCase()] ?? social.label.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Navigation</p>
            <ul className="space-y-3">
              {visibleNavLinks.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="text-sm text-xq-muted hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Get in Touch</p>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${email}`} className="text-sm text-xq-muted hover:text-xq-accent transition-colors break-all">
                  {email}
                </a>
              </li>
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm text-xq-muted hover:text-xq-accent transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {address && (
                <li>
                  <p className="text-sm text-xq-muted leading-relaxed">{address}</p>
                </li>
              )}
              <li>
                <a href={calendly} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-xq-accent hover:opacity-80 transition-opacity">
                  Book a Call →
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-xq-border">
              <p className="text-xs text-xq-muted">{legalNote}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-xq-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-xq-muted text-center sm:text-left">{footerCopy}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-xq-muted hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-xs text-xq-muted hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
