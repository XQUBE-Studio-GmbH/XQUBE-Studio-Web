import Link from 'next/link'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteSettingsGlobal {
  contact?: {
    email?:      string
    phone?:      string
    address?:    string
    calendly?:   string
    linkedin?:   string
    artstation?: string
  }
  footerCopy?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Footer({ settings }: { settings?: SiteSettingsGlobal }) {
  const email      = settings?.contact?.email      ?? 'info@xqubestudio.com'
  const calendly   = settings?.contact?.calendly   ?? 'https://calendly.com/tanvirkhandlxqsmgs'
  const linkedin   = settings?.contact?.linkedin   ?? 'https://www.linkedin.com/company/xqubestudio'
  const artstation = settings?.contact?.artstation ?? 'https://www.artstation.com/xqubestudio'
  const footerCopy = settings?.footerCopy          ?? `© ${new Date().getFullYear()} XQube Studio GmbH. All rights reserved.`

  return (
    <footer className="border-t border-xq-border bg-xq-bg">
      <div className="xq-container py-12 md:py-16">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand block */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.svg" alt="XQube Studio" width={120} height={69} className="h-14 w-auto" />
            </Link>
            <p className="text-xq-muted text-sm leading-relaxed max-w-xs mt-4">
              AAA game art and XR production studio. Vienna · Dubai · Dhaka.
            </p>
            <div className="flex gap-3 mt-6">
              <a href={linkedin} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold">
                in
              </a>
              <a href={artstation} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold">
                AS
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home',      href: '/' },
                { label: 'About',     href: '/about' },
                { label: 'Services',  href: '/services' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Blog',      href: '/blog' },
                { label: 'Contact',   href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-xq-muted hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${email}`} className="text-sm text-xq-muted hover:text-xq-accent transition-colors break-all">
                  {email}
                </a>
              </li>
              <li>
                <a href={calendly} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-xq-accent hover:opacity-80 transition-opacity">
                  Book a Call →
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-xq-border">
              <p className="text-xs text-xq-muted">GmbH registered in Vienna, Austria. GDPR compliant.</p>
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
