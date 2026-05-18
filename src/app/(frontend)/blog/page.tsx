import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import BlogPageClient from '@/components/live-preview/BlogPageClient'
import type { BlogPageGlobal, BlogPost } from '@/types/cms'

export const metadata: Metadata = {
  title: 'Blog & Insights',
  description: 'Insights on game art production, XR development, and studio operations from XQube Studio.',
  openGraph: {
    title: 'Blog & Insights | XQube Studio',
    description: 'Insights on game art production, XR development, and studio operations.',
    url: 'https://www.xqubestudio.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | XQube Studio',
    description: 'Insights on game art production, XR development, and studio operations.',
  },
}

// force-dynamic: Vercel build runners can't reliably reach Supabase pooler.
export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [postsRes, bp] = await Promise.all([
      payload.find({
        collection: 'blog-posts',
        where: { status: { equals: 'published' } },
        sort: '-createdAt',
        limit: 100,
        depth: 1,
      }),
      payload.findGlobal({ slug: 'blog-page', depth: 1 }) as Promise<BlogPageGlobal>,
    ])
    return {
      posts: postsRes.docs as unknown as BlogPost[],
      bp,
    }
  } catch {
    return { posts: [] as BlogPost[], bp: {} as BlogPageGlobal }
  }
}

export default async function BlogPage() {
  const { posts, bp } = await getData()
  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return (
    <BlogPageClient
      initialData={bp}
      posts={posts}
      serverURL={serverURL}
    />
  )
}
