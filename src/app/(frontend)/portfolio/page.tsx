import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import PortfolioPageClient from '@/components/live-preview/PortfolioPageClient'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { getPortfolioListData } from '@/lib/cachedData'
import type { PortfolioPageGlobal } from '@/types/cms'

// force-dynamic: Vercel build runners can't reliably reach Supabase pooler.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'portfolio-page', depth: 1 }) as PortfolioPageGlobal
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

export default async function PortfolioPage() {
  const { items, pp } = await getPortfolioListData()
  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return (
    <PortfolioPageClient
      initialData={pp}
      items={items}
      serverURL={serverURL}
    />
  )
}
