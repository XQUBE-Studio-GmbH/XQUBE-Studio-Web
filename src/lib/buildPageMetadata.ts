import type { Metadata } from 'next'

export interface SeoGroup {
  title?: string | null
  description?: string | null
  image?: { url?: string } | null
  noIndex?: boolean | null
}

interface Options {
  seo?: SeoGroup | null
  defaultTitle: string
  defaultDescription: string
  url: string
  ogTitle?: string
  ogImage?: string   // fallback image (e.g. heroImage for portfolio items)
  ogType?: 'website' | 'article'
}

export function buildPageMetadata({
  seo,
  defaultTitle,
  defaultDescription,
  url,
  ogTitle,
  ogImage,
  ogType = 'website',
}: Options): Metadata {
  const title = seo?.title?.trim() || defaultTitle
  const description = seo?.description?.trim() || defaultDescription
  const imageUrl = seo?.image?.url || ogImage
  const resolvedOgTitle = ogTitle || title

  return {
    title,
    description,
    openGraph: {
      title: resolvedOgTitle,
      description,
      url,
      type: ogType,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  }
}
