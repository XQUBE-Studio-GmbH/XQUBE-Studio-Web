import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '../../payload/payload.config'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'

// Static routes — always present
const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE_URL}/about`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/services`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${BASE_URL}/portfolio`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE_URL}/blog`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE_URL}/contact`,       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  { url: `${BASE_URL}/privacy`,       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE_URL}/cookies`,       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const payload = await getPayload({ config })

    // Fetch published portfolio items
    const portfolioRes = await payload.find({
      collection: 'portfolio',
      where: { status: { equals: 'published' } },
      limit: 500,
      select: { slug: true, updatedAt: true },
    })

    const portfolioRoutes: MetadataRoute.Sitemap = portfolioRes.docs.map((item) => ({
      url: `${BASE_URL}/portfolio/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt as string) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    // Fetch published blog posts
    const blogRes = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      limit: 500,
      select: { slug: true, updatedAt: true },
    })

    const blogRoutes: MetadataRoute.Sitemap = blogRes.docs.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt as string) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [...staticRoutes, ...portfolioRoutes, ...blogRoutes]
  } catch {
    // If DB is unreachable (e.g. during static build), fall back to static routes only
    return staticRoutes
  }
}
