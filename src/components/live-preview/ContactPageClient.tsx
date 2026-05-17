'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import ContactForm from '@/app/(frontend)/contact/ContactForm'
import type { ContactInfo, ContactPageCopy } from '@/app/(frontend)/contact/page'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactPageGlobal {
  hero?: {
    label?: string
    heading?: string
    subtext?: string
    calendlyLabel?: string
    image?: { url?: string; alt?: string } | null
  }
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
  const pageCopy: ContactPageCopy = {
    label:         h.label         ?? 'Get in Touch',
    heading:       h.heading        ?? "Let's talk about your project",
    subtext:       h.subtext        ?? "Book a discovery call for a scoped conversation, or fill out the brief and we'll respond within 24–48 hours.",
    calendlyLabel: h.calendlyLabel  ?? 'Book a Discovery Call',
    image:         (h.image as { url?: string; alt?: string } | null) ?? null,
  }

  return <ContactForm contactInfo={contactInfo} pageCopy={pageCopy} />
}
