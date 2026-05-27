import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import ContactPageClient from '@/components/live-preview/ContactPageClient'
import type { ContactPageGlobal } from '@/types/cms'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { BASE_URL, LOGO_URL } from '@/lib/jsonLd'
import { getContactData } from '@/lib/cachedData'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'contact-page', depth: 1 }) as ContactPageGlobal
    return buildPageMetadata({
      seo: page?.seo,
      defaultTitle: 'Contact',
      defaultDescription: "Get in touch with XQube Studio. Book a discovery call or send us a message — we respond within 24–48 hours.",
      url: 'https://www.xqubestudio.com/contact',
    })
  } catch {
    return { title: 'Contact', description: "Get in touch with XQube Studio. Book a discovery call or send us a message — we respond within 24–48 hours." }
  }
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
  calendly: string
  linkedin: string
  artstation: string
}

export interface ContactPageCopy {
  label: string
  heading: string
  subtext: string
  calendlyLabel: string
  image?: { url?: string; alt?: string } | null
}

const FALLBACK_INFO: ContactInfo = {
  email:      'info@xqubestudio.com',
  phone:      '+43 650 5207329',
  address:    'Rathausstrasse 21/12, 1010 Vienna, Austria',
  calendly:   'https://calendly.com/tanvirkhandlxqsmgs',
  linkedin:   'https://www.linkedin.com/company/xqubestudio',
  artstation: 'https://www.artstation.com/xqubestudio',
}

const FALLBACK_COPY: ContactPageCopy = {
  label:        'Get in Touch',
  heading:      "Let's talk about your project",
  subtext:      "Book a discovery call for a scoped conversation, or fill out the brief and we'll respond within 24–48 hours.",
  calendlyLabel: 'Book a Call',
  image:        null,
}

async function getData(): Promise<{ contactInfo: ContactInfo; pageCopy: ContactPageCopy }> {
  try {
    const { settings, cp } = await getContactData()
    const c = settings.contact ?? {}
    const h = cp.hero ?? {}
    return {
      contactInfo: {
        email:      c.email      ?? FALLBACK_INFO.email,
        phone:      c.phone      ?? FALLBACK_INFO.phone,
        address:    c.address    ?? FALLBACK_INFO.address,
        calendly:   c.calendly   ?? FALLBACK_INFO.calendly,
        linkedin:   c.linkedin   ?? FALLBACK_INFO.linkedin,
        artstation: c.artstation ?? FALLBACK_INFO.artstation,
      },
      pageCopy: {
        label:         h.label         ?? FALLBACK_COPY.label,
        heading:       h.heading        ?? FALLBACK_COPY.heading,
        subtext:       h.subtext        ?? FALLBACK_COPY.subtext,
        calendlyLabel: h.calendlyLabel  ?? FALLBACK_COPY.calendlyLabel,
        image:         (h.image as { url?: string; alt?: string } | null) ?? null,
      },
    }
  } catch {
    return { contactInfo: FALLBACK_INFO, pageCopy: FALLBACK_COPY }
  }
}

export default async function ContactPage() {
  const { contactInfo, pageCopy } = await getData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  // Pass the raw contact-page global as initialData for useLivePreview.
  // contactInfo (from site-settings) stays static — only the hero copy updates live.
  const initialData: ContactPageGlobal = {
    hero: {
      label:         pageCopy.label,
      heading:       pageCopy.heading,
      subtext:       pageCopy.subtext,
      calendlyLabel: pageCopy.calendlyLabel,
      image:         pageCopy.image ?? null,
    },
  }

  return (
    <>
      {/* LocalBusiness structured data — puts XQUBE in Google's Knowledge Panel */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':    'https://schema.org',
            '@type':       'LocalBusiness',
            name:           'XQUBE Studio GmbH',
            url:            BASE_URL,
            logo:           LOGO_URL,
            email:          contactInfo.email,
            telephone:      contactInfo.phone,
            address: {
              '@type':           'PostalAddress',
              streetAddress:     'Rathausstrasse 21/12',
              addressLocality:   'Vienna',
              postalCode:        '1010',
              addressCountry:    'AT',
            },
            sameAs: [contactInfo.linkedin, contactInfo.artstation].filter(Boolean),
          }),
        }}
      />
      <ContactPageClient
        initialData={initialData}
        contactInfo={contactInfo}
        serverURL={serverURL}
      />
    </>
  )
}
