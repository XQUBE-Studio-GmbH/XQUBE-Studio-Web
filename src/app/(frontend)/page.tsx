import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../payload/payload.config'
import HomePageClient from '@/components/live-preview/HomePageClient'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { getHomeData } from '@/lib/cachedData'
import type { HomepageGlobal } from '@/types/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'home-page', depth: 1 }) as HomepageGlobal
    return buildPageMetadata({
      seo: page?.seo,
      defaultTitle: 'XQube Studio | AAA Game Art & XR Production',
      defaultDescription: 'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
      url: 'https://www.xqubestudio.com',
    })
  } catch {
    return {
      title: 'XQube Studio | AAA Game Art & XR Production',
      description: 'XQube Studio delivers AAA-quality game art and XR production for studios worldwide.',
    }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { hp, services, clients, featured, blogPosts } = await getHomeData()

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
