'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ─── Types & defaults ─────────────────────────────────────────────────────────

export interface NavLink    { label: string; url: string }
export interface CtaButton  { label?: string; url?: string }

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Home',      url: '/' },
  { label: 'About',     url: '/about' },
  { label: 'Services',  url: '/services' },
  { label: 'Portfolio', url: '/portfolio' },
  { label: 'Blog',      url: '/blog' },
  { label: 'Contact',   url: '/contact' },
]
const DEFAULT_CTA: CtaButton = {
  label: 'Book a Call',
  url:   'https://calendly.com/tanvirkhandlxqsmgs',
}

interface Props {
  navLinks?:  NavLink[]
  ctaButton?: CtaButton
}

export default function Navbar({ navLinks: propLinks, ctaButton: propCta }: Props) {
  const navLinks = (propLinks && propLinks.length > 0) ? propLinks : DEFAULT_NAV_LINKS
  const ctaLabel = propCta?.label ?? DEFAULT_CTA.label!
  const ctaUrl   = propCta?.url   ?? DEFAULT_CTA.url!

  const [open, setOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* ── Top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-xq-bg/80 backdrop-blur-md border-b border-xq-border">
        <div className="xq-container">
          <nav className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
              <Image
                src="/logo.svg"
                alt="XQube Studio"
                width={120}
                height={69}
                priority
                className="h-[60px] w-auto"
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sm text-xq-muted hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <Link
              href={ctaUrl}
              target={ctaUrl.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="xq-btn-primary text-sm hidden md:inline-flex"
            >
              {ctaLabel}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span
                className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 origin-center
                  ${open ? 'rotate-45 translate-y-[7px]' : ''}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white rounded transition-all duration-300
                  ${open ? 'opacity-0 scale-x-0' : ''}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 origin-center
                  ${open ? '-rotate-45 -translate-y-[7px]' : ''}`}
              />
            </button>
          </nav>
        </div>
      </header>

      {/*
        ── Mobile menu overlay ──
        MUST be a sibling of <header>, NOT a child.
        backdrop-filter on the header creates a new fixed-positioning containing block,
        so any position:fixed inside it would size to the header — not the viewport.
        Placing it here (outside header, z-40 < header z-50) solves it.
      */}
      <div
        className={`
          md:hidden fixed left-0 right-0 bottom-0 z-40
          bg-black flex flex-col
          transition-all duration-300 ease-in-out
          ${open ? 'opacity-100 pointer-events-auto top-[72px]' : 'opacity-0 pointer-events-none top-[72px] -translate-y-full'}
        `}
      >
        <div className="xq-container flex flex-col py-8 gap-1 h-full overflow-y-auto">

          {/* Nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-xq-muted hover:text-white active:text-xq-accent transition-colors py-4 border-b border-xq-border/40"
            >
              {link.label}
            </Link>
          ))}

          {/* CTAs */}
          <div className="mt-8 space-y-3">
            <Link
              href={ctaUrl}
              target={ctaUrl.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="xq-btn-primary w-full justify-center py-4 text-base"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="xq-btn-ghost w-full justify-center py-4 text-base"
            >
              Send a Message
            </Link>
          </div>

          {/* Social links */}
          <div className="mt-auto pt-8 pb-6 flex gap-4">
            <a
              href="https://www.linkedin.com/company/xqubestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold"
            >
              in
            </a>
            <a
              href="https://www.artstation.com/xqubestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-xq-border rounded flex items-center justify-center text-xq-muted hover:text-xq-accent hover:border-xq-accent transition-colors text-xs font-bold"
            >
              AS
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
