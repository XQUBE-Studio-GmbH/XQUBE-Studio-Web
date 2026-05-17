'use client'

import Image from 'next/image'
import { useLivePreview } from '@payloadcms/live-preview-react'
import ContactForm from '@/app/(frontend)/contact/ContactForm'
import type { ContactInfo, ContactPageCopy } from '@/app/(frontend)/contact/page'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactPageGlobal {
  hero?: {
    label?:         string
    heading?:       string
    subtext?:       string
    calendlyLabel?: string
    image?: { url?: string; alt?: string } | null
  }
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FB_HERO = {
  label:         'Get in Touch',
  heading:       "Let's talk about your project",
  subtext:       "Book a discovery call for a scoped conversation, or fill out the brief and we'll respond within 24–48 hours.",
  calendlyLabel: 'Book a Discovery Call',
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialData: ContactPageGlobal
  contactInfo: ContactInfo
  serverURL:   string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ContactPageClient({ initialData, contactInfo, serverURL }: Props) {
  const { data: cp } = useLivePreview<ContactPageGlobal>({
    initialData,
    serverURL: typeof window !== 'undefined'
      ? (window !== window.parent && document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin)
      : serverURL,
    depth: 2,
  })

  const h = cp.hero ?? {}

  const heroLabel    = h.label         ?? FB_HERO.label
  const heroHeading  = h.heading        ?? FB_HERO.heading
  const heroSubtext  = h.subtext        ?? FB_HERO.subtext
  const heroImage    = h.image as { url?: string; alt?: string } | null | undefined

  // pageCopy passed to ContactForm — hero text is shown in the banner above,
  // so we pass empty strings for label/heading/subtext to suppress duplication.
  const pageCopy: ContactPageCopy = {
    label:         '',
    heading:       '',
    subtext:       '',
    calendlyLabel: h.calendlyLabel ?? FB_HERO.calendlyLabel,
    image:         null,  // image used in banner above, not in form column
  }

  return (
    <>
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#060e08] to-[#0a1f13]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {heroImage?.url && (
          <div className="absolute inset-0">
            <Image src={heroImage.url} alt={heroImage.alt || heroHeading} fill className="object-cover" priority />
          </div>
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        {/* Text */}
        <div className="xq-container relative z-10">
          <div className="max-w-3xl">
            <div className="xq-label mb-6">{heroLabel}</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6 leading-[1.05]">
              {heroHeading}
            </h1>
            {heroSubtext && (
              <p className="text-base sm:text-lg text-xq-muted max-w-2xl leading-relaxed">
                {heroSubtext}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Contact Form ─────────────────────────────────────── */}
      <ContactForm contactInfo={contactInfo} pageCopy={pageCopy} />
    </>
  )
}
