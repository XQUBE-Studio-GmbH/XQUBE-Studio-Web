import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import AboutPageClient from '@/components/live-preview/AboutPageClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
  description: 'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria, with production hubs in Dubai and Dhaka. 15+ years experience, 80+ clients worldwide.',
  openGraph: {
    title: 'About XQube Studio | A Studio Built for Precision',
    description: 'GmbH registered in Vienna. 15+ years. 80+ clients. Three global hubs.',
    url: 'https://www.xqubestudio.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About XQube Studio',
    description: 'GmbH registered in Vienna. 15+ years. 80+ clients. Three global hubs.',
  },
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClientItem { id: string | number; name: string; sector?: string; note?: string }
interface AboutGlobal {
  intro?: { body1?: string; body2?: string; image?: { url?: string; alt?: string } | null }
  credentials?: { id?: string; value: string; label: string; detail?: string }[]
  hubs?: { id?: string; flag?: string; city: string; country: string; role?: string; detail?: string; image?: { url?: string; alt?: string } | null }[]
  whyXqube?: { id?: string; title: string; body: string }[]
}

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [ap, clientsRes] = await Promise.all([
      payload.findGlobal({ slug: 'about-page' }) as Promise<AboutGlobal>,
      payload.find({ collection: 'clients', sort: 'order', limit: 20, depth: 0 }),
    ])
    return {
      ap:      ap as AboutGlobal,
      clients: clientsRes.docs as unknown as ClientItem[],
    }
  } catch {
    return { ap: {} as AboutGlobal, clients: [] }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const { ap, clients } = await getData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <AboutPageClient
      initialData={ap}
      clients={clients}
      serverURL={serverURL}
    />
  )
}
