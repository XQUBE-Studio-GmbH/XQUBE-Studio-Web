import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import BlogPageClient from '@/components/live-preview/BlogPageClient'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { getBlogListData } from '@/lib/cachedData'
import type { BlogPageGlobal } from '@/types/cms'

// force-dynamic: Vercel build runners can't reliably reach Supabase pooler.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'blog-page', depth: 1 }) as BlogPageGlobal
    return buildPageMetadata({
      seo: page?.seo,
      defaultTitle: 'Blog & Insights',
      defaultDescription: 'Insights on game art production, XR development, and studio operations from XQube Studio.',
      url: 'https://www.xqubestudio.com/blog',
    })
  } catch {
    return { title: 'Blog & Insights', description: 'Insights on game art production, XR development, and studio operations from XQube Studio.' }
  }
}

export default async function BlogPage() {
  const { posts, bp } = await getBlogListData()
  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return (
    <BlogPageClient
      initialData={bp}
      posts={posts}
      serverURL={serverURL}
    />
  )
}
