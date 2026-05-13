import Link from 'next/link'

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-xq-bg/80 backdrop-blur-md border-b border-xq-border">
      <div className="xq-container">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-xq-accent rounded flex items-center justify-center">
              <span className="text-black font-black text-sm leading-none">X</span>
            </div>
            <span className="font-bold text-white tracking-tight">
              XQube <span className="text-xq-accent">Studio</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home',      href: '/' },
              { label: 'About',     href: '/about' },
              { label: 'Services',  href: '/services' },
              { label: 'Portfolio', href: '/portfolio' },
              { label: 'Blog',      href: '/blog' },
              { label: 'Contact',   href: '/contact' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-xq-muted hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="https://calendly.com/tanvirkhandlxqsmgs"
            target="_blank"
            rel="noopener noreferrer"
            className="xq-btn-primary text-sm hidden md:inline-flex"
          >
            Book a Call
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-xq-border bg-xq-bg">
      <div className="xq-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
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
              <a href="https://www.linkedin.com/company/xqubestudio" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold">
                in
              </a>
              <a href="https://www.artstation.com/xqubestudio" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold">
                AS
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-sm text-xq-muted hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:info@xqubestudio.com" className="text-sm text-xq-muted hover:text-xq-accent transition-colors">
                  info@xqubestudio.com
                </a>
              </li>
              <li>
                <a href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-xq-accent hover:opacity-80 transition-opacity">
                  Book a Discovery Call →
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-xq-border">
              <p className="text-xs text-xq-muted">GmbH registered in Vienna, Austria. GDPR compliant.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-xq-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-xq-muted">© {new Date().getFullYear()} XQube Studio GmbH. All rights reserved.</p>
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
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}
