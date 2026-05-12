import { MetadataRoute } from 'next'
import { getSitemapData } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'
  const { portfolio, blog } = await getSitemapData()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`,lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/blog`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${baseUrl}/contact`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]

  const portfolioPages: MetadataRoute.Sitemap = portfolio.map((item: any) => ({
    url:             `${baseUrl}/portfolio/${item.slug}`,
    lastModified:    new Date(item.updatedAt),
    changeFrequency: 'monthly' as const,
    priority:        0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = blog.map((post: any) => ({
    url:             `${baseUrl}/blog/${post.slug}`,
    lastModified:    new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority:        0.6,
  }))

  return [...staticPages, ...portfolioPages, ...blogPages]
}
