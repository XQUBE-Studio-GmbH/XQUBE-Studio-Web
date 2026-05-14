import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import ContactForm from './ContactForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch with XQube Studio. Book a discovery call or send us a message — we respond within 24–48 hours.",
  openGraph: {
    title: 'Contact XQube Studio',
    description: "Let's talk about your project. Book a call or send a message.",
    url: 'https://www.xqubestudio.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact XQube Studio',
    description: "Let's talk about your project. Book a call or send a message.",
  },
}

interface SiteSettings {
  contact?: {
    email?: string
    phone?: string
    address?: string
    calendly?: string
    linkedin?: string
    artstation?: string
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

const FALLBACK: ContactInfo = {
  email:      'info@xqubestudio.com',
  phone:      '+43 650 5207329',
  address:    'Rathausstrasse 21/12, 1010 Vienna, Austria',
  calendly:   'https://calendly.com/tanvirkhandlxqsmgs',
  linkedin:   'https://www.linkedin.com/company/xqubestudio',
  artstation: 'https://www.artstation.com/xqubestudio',
}

async function getContactInfo(): Promise<ContactInfo> {
  try {
    const payload  = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' }) as SiteSettings
    const c        = settings.contact ?? {}
    return {
      email:      c.email      ?? FALLBACK.email,
      phone:      c.phone      ?? FALLBACK.phone,
      address:    c.address    ?? FALLBACK.address,
      calendly:   c.calendly   ?? FALLBACK.calendly,
      linkedin:   c.linkedin   ?? FALLBACK.linkedin,
      artstation: c.artstation ?? FALLBACK.artstation,
    }
  } catch {
    return FALLBACK
  }
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()
  return <ContactForm contactInfo={contactInfo} />
}
