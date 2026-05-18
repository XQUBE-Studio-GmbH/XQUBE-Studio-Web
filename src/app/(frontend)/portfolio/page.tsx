import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import PortfolioPageClient from '@/components/live-preview/PortfolioPageClient'
import type { PortfolioPageGlobal, PortfolioItem } from '@/types/cms'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: "Browse XQube Studio's portfolio of AAA game art — characters, weapons, vehicles, environments, props, and VR assets.",
  openGraph: {
    title: 'Portfolio | XQube Studio',
    description: 'AAA game art for studios worldwide — characters, weapons, environments, VR assets.',
    url: 'https://www.xqubestudio.com/portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | XQube Studio',
    description: 'AAA game art — characters, weapons, environments, VR assets.',
  },
}

// force-dynamic: Vercel build runners can't reliably reach Supabase pooler.
export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [itemsRes, pp] = await Promise.all([
      payload.find({
        collection: 'portfolio',
        where: { status: { equals: 'published' } },
        sort: '-createdAt',
        limit: 200,
        depth: 1,
      }),
      payload.findGlobal({ slug: 'portfolio-page', depth: 1 }) as Promise<PortfolioPageGlobal>,
    ])
    return {
      items: itemsRes.docs as unknown as PortfolioItem[],
      pp,
    }
  } catch {
    return { items: [] as PortfolioItem[], pp: {} as PortfolioPageGlobal }
  }
}

export default async function PortfolioPage() {
  const { items, pp } = await getData()
  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return (
    <PortfolioPageClient
      initialData={pp}
      items={items}
      serverURL={serverURL}
    />
  )
}
