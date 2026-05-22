import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import PortfolioPageClient from '@/components/live-preview/PortfolioPageClient'
import type { PortfolioPageGlobal, PortfolioItem, PortfolioOrderRow } from '@/types/cms'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

// force-dynamic: Vercel build runners can't reliably reach Supabase pooler.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'portfolio-page', depth: 1 }) as any
    return buildPageMetadata({
      seo: page?.seo,
      defaultTitle: 'Portfolio',
      defaultDescription: "Browse XQube Studio's portfolio of AAA game art — characters, weapons, vehicles, environments, props, and VR assets.",
      url: 'https://www.xqubestudio.com/portfolio',
    })
  } catch {
    return { title: 'Portfolio', description: "Browse XQube Studio's portfolio of AAA game art." }
  }
}

// Sorts portfolio items by the explicit order array set in the admin.
// Items not listed in the order array are appended at the end (newest first).
function applyPortfolioOrder(
  docs: PortfolioItem[],
  orderRows: PortfolioOrderRow[],
): PortfolioItem[] {
  if (!orderRows || orderRows.length === 0) return docs
  const idToPos = new Map(
    orderRows.map((row, i) => [String(row.item?.id ?? ''), i])
  )
  return [...docs].sort((a, b) => {
    const ia = idToPos.get(String(a.id)) ?? Infinity
    const ib = idToPos.get(String(b.id)) ?? Infinity
    return ia - ib
  })
}

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [itemsRes, pp] = await Promise.all([
      payload.find({
        collection: 'portfolio',
        where: { status: { equals: 'published' } },
        sort: '-createdAt',   // default: newest first (overridden below if order array is set)
        limit: 200,
        depth: 1,
      }),
      payload.findGlobal({ slug: 'portfolio-page', depth: 1 }) as Promise<PortfolioPageGlobal>,
    ])

    const orderRows = (pp.portfolioOrder ?? []) as PortfolioOrderRow[]
    const rawItems  = itemsRes.docs as unknown as PortfolioItem[]
    const items     = applyPortfolioOrder(rawItems, orderRows)

    return { items, pp }
  } catch (err) {
    console.error('[portfolio/getData] DB error:', err)
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
