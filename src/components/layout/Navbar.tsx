import Link from 'next/link'
import { getNavigation } from '@/lib/payload'
import { MobileNav } from './MobileNav'

export async function Navbar() {
  const nav = await getNavigation()

  const links = (nav as any)?.mainNav || [
    { label: 'Home',      url: '/' },
    { label: 'About',     url: '/about' },
    { label: 'Services',  url: '/services' },
    { label: 'Portfolio', url: '/portfolio' },
    { label: 'Blog',      url: '/blog' },
    { label: 'Contact',   url: '/contact' },
  ]

  const cta = (nav as any)?.ctaButton || {
    label: 'Book a Call',
    url: 'https://calendly.com/tanvirkhandlxqsmgs',
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-xq-bg/80 backdrop-blur-md border-b border-xq-border">
      <div className="xq-container">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-xq-accent rounded flex items-center justify-center">
              <span className="text-black font-black text-sm leading-none">X</span>
            </div>
            <span className="font-bold text-white tracking-tight">
              XQube <span className="text-xq-accent">Studio</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link: any) => (
              <Link
                key={link.url}
                href={link.url}
                target={link.openInNewTab ? '_blank' : undefined}
                className="text-sm text-xq-muted hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href={cta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="xq-btn-primary text-sm"
            >
              {cta.label}
            </Link>
          </div>

          <MobileNav links={links} cta={cta} />
        </nav>
      </div>
    </header>
  )
}
