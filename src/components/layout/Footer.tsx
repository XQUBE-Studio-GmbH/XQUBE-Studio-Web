import Link from 'next/link'
import { getSiteSettings } from '@/lib/payload'

export async function Footer() {
  const settings = await getSiteSettings() as any

  const contact = settings?.contact || {
    email:      'info@xqubestudio.com',
    calendly:   'https://calendly.com/tanvirkhandlxqsmgs',
    linkedin:   'https://www.linkedin.com/company/xqubestudio',
    artstation: 'https://www.artstation.com/xqubestudio',
  }

  const footerCopy = settings?.footerCopy || `© ${new Date().getFullYear()} XQube Studio GmbH. All rights reserved.`

  return (
    <footer className="border-t border-xq-border bg-xq-bg">
      <div className="xq-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-xq-accent rounded flex items-center justify-center">
                <span className="text-black font-black text-sm">X</span>
              </div>
              <span className="font-bold text-white">XQube Studio</span>
            </div>
            <p className="text-xq-muted text-sm leading-relaxed max-w-xs">
              AAA game art and XR production studio. Vienna · Dubai · Dhaka.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href={contact.artstation}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold"
                aria-label="ArtStation"
              >
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
                <a href={`mailto:${contact.email}`} className="text-sm text-xq-muted hover:text-xq-accent transition-colors">
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-xq-accent hover:opacity-80 transition-opacity"
                >
                  Book a Discovery Call →
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-xq-border">
              <p className="text-xs text-xq-muted">
                GmbH registered in Vienna, Austria.
                GDPR compliant. IP ownership clear.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-xq-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-xq-muted">{footerCopy}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-xq-muted hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-xs text-xq-muted hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
