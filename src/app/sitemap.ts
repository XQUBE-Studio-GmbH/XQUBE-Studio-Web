import { MetadataRoute } from 'next'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { getPayload } from 'payload'
import config from '../../payload/payload.config'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'

// ─── Static pages ─────────────────────────────────────────────────────────────
// One entry per filesystem route. Add a line here when a new static page is created.
// No lastModified — static pages don't have a meaningful "updated" timestamp.
// /scope/confirmed and /dev/* are intentionally excluded (not indexable).

const STATIC_PAGES: Array<{
  path:     string
  priority: number
  freq:     MetadataRoute.Sitemap[number]['changeFrequency']
}> = [
  { path: '/',          priority: 1.0, freq: 'weekly'  },
  { path: '/about',     priority: 0.8, freq: 'monthly' },
  { path: '/services',  priority: 0.9, freq: 'monthly' },
  { path: '/portfolio', priority: 0.9, freq: 'weekly'  },
  { path: '/scope',     priority: 0.8, freq: 'monthly' },
  { path: '/blog',      priority: 0.7, freq: 'weekly'  },
  { path: '/contact',   priority: 0.6, freq: 'yearly'  },
  { path: '/privacy',   priority: 0.3, freq: 'yearly'  },
  { path: '/cookies',   priority: 0.3, freq: 'yearly'  },
]

const staticRoutes: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, priority, freq }) => ({
  url:             `${BASE_URL}${path}`,
  changeFrequency: freq,
  priority,
}))

// ─── CMS-driven collections ───────────────────────────────────────────────────
// Each entry auto-includes ALL published documents from that Payload collection.
// To add a new collection (e.g. case studies): add one line here — done.

const CMS_COLLECTIONS: Array<{
  collection:  string
  pathPrefix:  string
  filter?:     Record<string, unknown>
  priority:    number
  freq:        MetadataRoute.Sitemap[number]['changeFrequency']
}> = [
  {
    collection: 'portfolio',
    pathPrefix: '/portfolio/',
    filter:     { status: { equals: 'published' } },
    priority:   0.7,
    freq:       'monthly',
  },
  {
    collection: 'blog-posts',
    pathPrefix: '/blog/',
    filter:     { status: { equals: 'published' } },
    priority:   0.6,
    freq:       'weekly',
  },
  {
    collection: 'services',
    pathPrefix: '/services/',
    filter:     { slug: { exists: true } },
    priority:   0.8,
    freq:       'monthly',
  },
  // ↓ Add new CMS collections here as the site grows:
  // { collection: 'case-studies', pathPrefix: '/case-studies/', filter: { status: { equals: 'published' } }, priority: 0.7, freq: 'monthly' },
]

// ─── Sitemap generator ────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Skip DB during next build — build runners can't reach the Supabase pooler.
  // At runtime the sitemap is regenerated with live DB data on every request.
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return staticRoutes
  }

  try {
    const payload = await getPayload({ config })

    const dynamicRoutes = (
      await Promise.all(
        CMS_COLLECTIONS.map(async ({ collection, pathPrefix, filter, priority, freq }) => {
          const res = await payload.find({
            collection:     collection as Parameters<typeof payload.find>[0]['collection'],
            where:          filter,
            limit:          1000,
            select:         { slug: true, updatedAt: true },
          })
          return res.docs
            .filter((doc) => doc.slug)
            .map((doc) => ({
              url:             `${BASE_URL}${pathPrefix}${doc.slug}`,
              lastModified:    doc.updatedAt ? new Date(doc.updatedAt as string) : undefined,
              changeFrequency: freq,
              priority,
            }))
        }),
      )
    ).flat()

    return [...staticRoutes, ...dynamicRoutes]
  } catch {
    // DB unreachable — serve static routes only
    return staticRoutes
  }
}
