import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../payload/payload.config'
import HomePageClient from '@/components/live-preview/HomePageClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'XQube Studio | AAA Game Art & XR Production',
  description: 'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
  openGraph: {
    title: 'XQube Studio | AAA Game Art & XR Production',
    description: 'AAA-quality game art and XR production. Vienna · Dubai · Dhaka.',
    url: 'https://www.xqubestudio.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XQube Studio | AAA Game Art & XR Production',
    description: 'AAA-quality game art and XR production. Vienna · Dubai · Dhaka.',
  },
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stat      { id?: string; value: string; label: string }
interface ServiceItem {
  id: string | number
  title: string
  shortDescription?: string
  icon?: string
  order?: number
  image?: { url?: string; alt?: string } | null
}
interface ClientItem  { id: string | number; name: string }
interface PortfolioItem {
  id: string; title: string; slug: string; category?: string
  shortDescription?: string; heroImage?: { url?: string; alt?: string }
}
interface HomepageGlobal {
  hero?: {
    label?: string; headline?: string; subtitle?: string
    primaryLabel?: string; primaryUrl?: string
    secondaryLabel?: string; secondaryUrl?: string
    showcaseImage?: { url?: string; alt?: string } | null
  }
  stats?: Stat[]
  cta?: { headline?: string; subtitle?: string; buttonLabel?: string; buttonUrl?: string }
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [hp, servicesRes, clientsRes, featuredRes] = await Promise.all([
      payload.findGlobal({ slug: 'home-page' }) as Promise<HomepageGlobal>,
      payload.find({ collection: 'services', where: { featured: { equals: true } }, sort: 'order', limit: 4, depth: 1 }),
      payload.find({ collection: 'clients',  where: { featured: { equals: true } }, sort: 'order', limit: 20, depth: 0 }),
      payload.find({ collection: 'portfolio', where: { featured: { equals: true }, status: { equals: 'published' } }, limit: 6, depth: 1 }),
    ])
    return {
      hp:       hp as HomepageGlobal,
      services: servicesRes.docs  as unknown as ServiceItem[],
      clients:  clientsRes.docs   as unknown as ClientItem[],
      featured: featuredRes.docs  as unknown as PortfolioItem[],
    }
  } catch {
    return { hp: {} as HomepageGlobal, services: [], clients: [], featured: [] }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { hp, services, clients, featured } = await getData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return (
    <HomePageClient
      initialData={hp}
      services={services}
      clients={clients}
      featured={featured}
      serverURL={serverURL}
    />
  )
}
