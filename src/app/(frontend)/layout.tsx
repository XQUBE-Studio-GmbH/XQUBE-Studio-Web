import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

function Footer() {
  return (
    <footer className="border-t border-xq-border bg-xq-bg">
      <div className="xq-container py-12 md:py-16">
        {/* Main grid: 2 cols on mobile, 4 cols on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand block — full width on mobile, 2 cols on md+ */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.svg"
                alt="XQube Studio"
                width={120}
                height={69}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-xq-muted text-sm leading-relaxed max-w-xs mt-4">
              AAA game art and XR production studio. Vienna · Dubai · Dhaka.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.linkedin.com/company/xqubestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold"
              >
                in
              </a>
              <a
                href="https://www.artstation.com/xqubestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold"
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
                <a
                  href="mailto:info@xqubestudio.com"
                  className="text-sm text-xq-muted hover:text-xq-accent transition-colors break-all"
                >
                  info@xqubestudio.com
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/tanvirkhandlxqsmgs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-xq-accent hover:opacity-80 transition-opacity"
                >
                  Book a Discovery Call →
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
          <p className="text-xs text-xq-muted text-center sm:text-left">
            © {new Date().getFullYear()} XQube Studio GmbH. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-xq-muted hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-xs text-xq-muted hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] relative z-0">{children}</main>
      <Footer />
    </>
  )
}
