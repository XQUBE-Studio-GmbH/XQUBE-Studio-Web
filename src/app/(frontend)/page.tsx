import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../payload/payload.config'
import HomePageClient from '@/components/live-preview/HomePageClient'
import type { HomepageGlobal, ServiceItem, ClientItem, PortfolioItem, BlogPost, PortfolioPageGlobal, PortfolioOrderRow } from '@/types/cms'

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

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [hp, servicesRes, clientsRes, featuredRes, blogRes, ppGlobal] = await Promise.all([
      payload.findGlobal({ slug: 'home-page', depth: 2 }) as Promise<HomepageGlobal>,
      payload.find({ collection: 'services',  where: { featured: { equals: true } }, sort: 'order', limit: 4, depth: 1 }),
      payload.find({ collection: 'clients',   where: { featured: { equals: true } }, sort: 'order', limit: 20, depth: 1 }),
      payload.find({ collection: 'portfolio', where: { featured: { equals: true }, status: { equals: 'published' } }, limit: 6, depth: 1 }),
      payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-createdAt', limit: 3, depth: 1 }),
      payload.findGlobal({ slug: 'portfolio-page', depth: 1 }) as Promise<PortfolioPageGlobal>,
    ])

    // Apply manual display order to the homepage featured items.
    // The order array is shared with the portfolio page — featured items appear
    // in the same sequence the editor has dragged them in the admin.
    const orderRows  = (ppGlobal.portfolioOrder ?? []) as PortfolioOrderRow[]
    const rawFeatured = featuredRes.docs as unknown as PortfolioItem[]
    let featured: PortfolioItem[]
    if (orderRows.length > 0) {
      const idToPos = new Map(orderRows.map((row, i) => [String(row.item?.id ?? ''), i]))
      featured = [...rawFeatured].sort((a, b) => {
        const ia = idToPos.get(String(a.id)) ?? Infinity
        const ib = idToPos.get(String(b.id)) ?? Infinity
        return ia - ib
      })
    } else {
      featured = rawFeatured
    }

    return {
      hp:        hp as HomepageGlobal,
      services:  servicesRes.docs  as unknown as ServiceItem[],
      clients:   clientsRes.docs   as unknown as ClientItem[],
      featured,
      blogPosts: blogRes.docs      as unknown as BlogPost[],
    }
  } catch {
    return { hp: {} as HomepageGlobal, services: [], clients: [], featured: [], blogPosts: [] }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { hp, services, clients, featured, blogPosts } = await getData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return (
    <HomePageClient
      initialData={hp}
      services={services}
      clients={clients}
      featured={featured}
      blogPosts={blogPosts}
      serverURL={serverURL}
    />
  )
}
