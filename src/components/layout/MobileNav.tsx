'use client'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  links: { label: string; url: string; openInNewTab?: boolean }[]
  cta: { label: string; url: string }
}

export function MobileNav({ links, cta }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-xq-muted hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        <div className="w-5 space-y-1.5">
          <span className={`block h-0.5 bg-current transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-xq-bg border-b border-xq-border py-4 px-6 space-y-3">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              onClick={() => setOpen(false)}
              className="block py-2 text-xq-muted hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={cta.url}
            target="_blank"
            className="xq-btn-primary w-full justify-center mt-2"
            onClick={() => setOpen(false)}
          >
            {cta.label}
          </Link>
        </div>
      )}
    </div>
  )
}
