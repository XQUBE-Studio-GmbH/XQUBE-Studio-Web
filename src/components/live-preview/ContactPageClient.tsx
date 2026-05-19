'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import ContactForm from '@/app/(frontend)/contact/ContactForm'
import PageHero from '@/components/PageHero'
import { getLivePreviewServerURL } from '@/lib/livePreview'
import type { ContactPageGlobal } from '@/types/cms'
import type { ContactInfo, ContactPageCopy } from '@/app/(frontend)/contact/page'

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FB_HERO = {
  label:         'Get in Touch',
  heading:       "Let's talk about your project",
  subtext:       "Book a discovery call for a scoped conversation, or fill out the brief and we'll respond within 24–48 hours.",
  calendlyLabel: 'Book a Call',
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
    serverURL: getLivePreviewServerURL(serverURL),
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
      <PageHero
        label={heroLabel}
        heading={heroHeading}
        subtitle={heroSubtext}
        image={heroImage}
      />

      {/* ── Contact Form ─────────────────────────────────────── */}
      <ContactForm contactInfo={contactInfo} pageCopy={pageCopy} />
    </>
  )
}
