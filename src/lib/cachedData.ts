/**
 * cachedData.ts — Centralised unstable_cache wrappers for all Payload CMS data fetchers.
 *
 * All pages remain `force-dynamic` (Vercel build runners can't reach Supabase), but
 * wrapping each fetcher with `unstable_cache` means Next.js caches the DB query result
 * in its data cache. Pages still render dynamically but skip the DB on cache hits.
 *
 * Revalidation schedule:
 *   layout / home    → 300 s
 *   services         → 600 s
 *   about            → 600 s
 *   contact          → 600 s
 *   portfolio        → 300 s
 *   blog             → 300 s
 *
 * Cache tags — revalidated automatically by afterChange/afterDelete hooks in payload.config.ts:
 *   layout, home, services, about, contact, portfolio, blog
 */

import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '../../payload/payload.config'
import type { NavLink, CtaButton } from '@/components/Navbar'
import type { SiteSettingsGlobal } from '@/components/Footer'
import type {
  HomepageGlobal,
  ServiceItem,
  ClientItem,
  PortfolioItem,
  BlogPost,
  PortfolioPageGlobal,
  PortfolioOrderRow,
  AboutGlobal,
  TeamMember,
  ServicesPageGlobal,
  BlogPageGlobal,
  ContactPageGlobal,
  FAQItem,
} from '@/types/cms'

// ─── Local type: NavigationGlobal (mirrors layout.tsx local interface) ─────────

export interface NavigationGlobal {
  mainNav?:   NavLink[]
  ctaButton?: CtaButton
}

// ─── Re-export SiteSettingsGlobal so layout.tsx can import from here ──────────

export type { SiteSettingsGlobal }

// ─── Layout ───────────────────────────────────────────────────────────────────

export interface LayoutData {
  nav:      NavigationGlobal
  settings: SiteSettingsGlobal
}

async function _fetchLayoutData(): Promise<LayoutData> {
  try {
    const payload = await getPayload({ config })
    const [nav, settings] = await Promise.all([
      payload.findGlobal({ slug: 'navigation' })               as Promise<NavigationGlobal>,
      payload.findGlobal({ slug: 'site-settings', depth: 1 }) as Promise<SiteSettingsGlobal>,
    ])
    return { nav, settings }
  } catch {
    return { nav: {}, settings: {} }
  }
}

export const getLayoutData = unstable_cache(
  _fetchLayoutData,
  ['layout'],
  { revalidate: 300, tags: ['layout'] },
)

// ─── Home page ────────────────────────────────────────────────────────────────

export interface HomeData {
  hp:        HomepageGlobal
  services:  ServiceItem[]
  clients:   ClientItem[]
  featured:  PortfolioItem[]
  blogPosts: BlogPost[]
}

async function _fetchHomeData(): Promise<HomeData> {
  try {
    const payload = await getPayload({ config })
    const [hp, servicesRes, clientsRes, featuredRes, blogRes, ppGlobal] = await Promise.all([
      payload.findGlobal({ slug: 'home-page', depth: 2 }) as Promise<HomepageGlobal>,
      payload.find({ collection: 'services',   where: { featured: { equals: true } }, sort: 'order', limit: 4,   depth: 1 }),
      payload.find({ collection: 'clients',    where: { featured: { equals: true } }, sort: 'order', limit: 20,  depth: 1 }),
      payload.find({ collection: 'portfolio',  where: { featured: { equals: true }, status: { equals: 'published' } }, limit: 6, depth: 1 }),
      payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-createdAt', limit: 3, depth: 1 }),
      payload.findGlobal({ slug: 'portfolio-page', depth: 1 }) as Promise<PortfolioPageGlobal>,
    ])

    const orderRows   = (ppGlobal.portfolioOrder ?? []) as PortfolioOrderRow[]
    const rawFeatured = featuredRes.docs as unknown as PortfolioItem[]
    let featured: PortfolioItem[]
    if (orderRows.length > 0) {
      const idToPos = new Map(orderRows.map((row, i) => [String(row.item?.id ?? ''), i]))
      featured = [...rawFeatured].sort((a, b) => {
        const ia = idToPos.get(String(a.id)) ?? Infinity
        const ib = idToPos.get(String(b.id)) ?? Infinity
        return ia - ib
      })
    } else {
      featured = rawFeatured
    }

    const clients: ClientItem[] =
      hp.featuredClients && hp.featuredClients.length > 0
        ? hp.featuredClients
            .filter((e) => e.client && typeof e.client === 'object')
            .map((e) => e.client as ClientItem)
        : (clientsRes.docs as unknown as ClientItem[])

    return {
      hp:        hp as HomepageGlobal,
      services:  servicesRes.docs as unknown as ServiceItem[],
      clients,
      featured,
      blogPosts: blogRes.docs as unknown as BlogPost[],
    }
  } catch {
    return { hp: {} as HomepageGlobal, services: [], clients: [], featured: [], blogPosts: [] }
  }
}

export const getHomeData = unstable_cache(
  _fetchHomeData,
  ['home'],
  { revalidate: 300, tags: ['home'] },
)

// ─── About page ───────────────────────────────────────────────────────────────

export interface AboutData {
  ap:          AboutGlobal
  teamMembers: TeamMember[]
}

async function _fetchAboutData(): Promise<AboutData> {
  try {
    const payload = await getPayload({ config })
    const [ap, teamRes] = await Promise.all([
      payload.findGlobal({ slug: 'about-page' }) as Promise<AboutGlobal>,
      payload.find({ collection: 'team-members', sort: 'order', limit: 50, depth: 1 }),
    ])
    return {
      ap:          ap as AboutGlobal,
      teamMembers: teamRes.docs as unknown as TeamMember[],
    }
  } catch {
    return { ap: {} as AboutGlobal, teamMembers: [] }
  }
}

export const getAboutData = unstable_cache(
  _fetchAboutData,
  ['about'],
  { revalidate: 600, tags: ['about'] },
)

// ─── Services list page ───────────────────────────────────────────────────────

export interface ServicesListData {
  services: ServiceItem[]
  sp:       ServicesPageGlobal
}

async function _fetchServicesListData(): Promise<ServicesListData> {
  try {
    const payload = await getPayload({ config })
    const [servicesRes, sp] = await Promise.all([
      payload.find({ collection: 'services', sort: 'order', limit: 20, depth: 1 }),
      payload.findGlobal({ slug: 'services-page' }) as Promise<ServicesPageGlobal>,
    ])
    return {
      services: servicesRes.docs as unknown as ServiceItem[],
      sp,
    }
  } catch {
    return { services: [], sp: {} as ServicesPageGlobal }
  }
}

export const getServicesListData = unstable_cache(
  _fetchServicesListData,
  ['services-list'],
  { revalidate: 600, tags: ['services'] },
)

// ─── Services [slug] page ─────────────────────────────────────────────────────

export interface ServiceItemData {
  service: ServiceItem | null
}

export interface RelatedPortfolioData {
  relatedWork: {
    id:         string
    title:      string
    slug:       string
    category?:  string
    heroImage?: { url?: string; alt?: string } | null
  }[]
}

async function _fetchServiceBySlug(slug: string): Promise<ServiceItem | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      where:      { slug: { equals: slug } },
      limit:      1,
      depth:      2,
    })
    console.log('[svc] slug:', slug, 'totalDocs:', res.totalDocs)
    return (res.docs[0] as unknown as ServiceItem) ?? null
  } catch (e) {
    console.error('[svc] error:', slug, String(e))
    return null
  }
}

// React cache() deduplicates within a single request (generateMetadata + page component)
// without persisting null across requests — avoids stale-null from unstable_cache.
export const getServiceBySlug = cache((slug: string) => _fetchServiceBySlug(slug))

async function _fetchRelatedPortfolio(categories: string[]): Promise<RelatedPortfolioData['relatedWork']> {
  if (categories.length === 0) return []
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'portfolio',
      where: { and: [{ status: { equals: 'published' } }, { category: { in: categories } }] },
      sort:  '-createdAt',
      limit: 6,
      depth: 1,
    })
    return res.docs as unknown as RelatedPortfolioData['relatedWork']
  } catch { return [] }
}

export const getRelatedPortfolioForService = (categories: string[]) =>
  unstable_cache(
    () => _fetchRelatedPortfolio(categories),
    ['service-related-portfolio', ...categories],
    { revalidate: 600, tags: ['services', 'portfolio'] },
  )()

async function _fetchOtherServices(currentSlug: string): Promise<ServiceItem[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({ collection: 'services', sort: 'order', limit: 10, depth: 0 })
    return (res.docs as unknown as ServiceItem[]).filter((s) => s.slug !== currentSlug)
  } catch { return [] }
}

export const getOtherServices = (currentSlug: string) =>
  unstable_cache(
    () => _fetchOtherServices(currentSlug),
    ['other-services', currentSlug],
    { revalidate: 600, tags: ['services'] },
  )()

// ─── Portfolio list page ──────────────────────────────────────────────────────

export interface PortfolioListData {
  items: PortfolioItem[]
  pp:    PortfolioPageGlobal
}

async function _fetchPortfolioListData(): Promise<PortfolioListData> {
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

    const orderRows = (pp.portfolioOrder ?? []) as PortfolioOrderRow[]
    const rawItems  = itemsRes.docs as unknown as PortfolioItem[]

    let items: PortfolioItem[]
    if (!orderRows || orderRows.length === 0) {
      items = rawItems
    } else {
      const idToPos = new Map(orderRows.map((row, i) => [String(row.item?.id ?? ''), i]))
      items = [...rawItems].sort((a, b) => {
        const ia = idToPos.get(String(a.id)) ?? Infinity
        const ib = idToPos.get(String(b.id)) ?? Infinity
        return ia - ib
      })
    }

    return { items, pp }
  } catch {
    return { items: [] as PortfolioItem[], pp: {} as PortfolioPageGlobal }
  }
}

export const getPortfolioListData = unstable_cache(
  _fetchPortfolioListData,
  ['portfolio-list'],
  { revalidate: 300, tags: ['portfolio'] },
)

// ─── Portfolio [slug] page ────────────────────────────────────────────────────

export interface PortfolioSlugItem {
  id:               string
  title:            string
  slug:             string
  category?:        string
  shortDescription?: string
  client?:          string
  year?:            number
  videoUrl?:        string
  heroImage?:       { url?: string; alt?: string; width?: number; height?: number }
  gallery?:         { id: string; image: { url?: string; alt?: string; width?: number; height?: number }; caption?: string }[]
  overview?:        unknown
  toolsUsed?:       { id: string | number; name: string; logo?: { url?: string; alt?: string } | null }[]
  software?:        { id: string; tool: string }[]
  polyCount?:       string
  textureRes?:      string
  deliveryTime?:    string
  status?:          string
  seo?: {
    title?:       string | null
    description?: string | null
    image?:       { url?: string } | null
    noIndex?:     boolean | null
  } | null
}

async function _fetchPortfolioItemBySlug(slug: string): Promise<PortfolioSlugItem | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'portfolio',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 2,
    })
    return (res.docs[0] as unknown as PortfolioSlugItem) ?? null
  } catch {
    return null
  }
}

export const getPortfolioItemBySlug = (slug: string) =>
  unstable_cache(
    () => _fetchPortfolioItemBySlug(slug),
    ['portfolio-item', slug],
    { revalidate: 300, tags: ['portfolio'] },
  )()

async function _fetchRelatedPortfolioItems(currentId: string, category?: string): Promise<PortfolioSlugItem[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'portfolio',
      where: {
        status: { equals: 'published' },
        ...(category ? { category: { equals: category } } : {}),
      },
      limit: 4,
      depth: 1,
    })
    return (res.docs as unknown as PortfolioSlugItem[]).filter((d) => d.id !== currentId).slice(0, 3)
  } catch {
    return []
  }
}

export const getRelatedPortfolioItems = (currentId: string, category?: string) =>
  unstable_cache(
    () => _fetchRelatedPortfolioItems(currentId, category),
    ['portfolio-related', currentId, category ?? 'none'],
    { revalidate: 300, tags: ['portfolio'] },
  )()

// ─── Blog list page ───────────────────────────────────────────────────────────

export interface BlogListData {
  posts: BlogPost[]
  bp:    BlogPageGlobal
}

async function _fetchBlogListData(): Promise<BlogListData> {
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

export const getBlogListData = unstable_cache(
  _fetchBlogListData,
  ['blog-list'],
  { revalidate: 300, tags: ['blog'] },
)

// ─── Blog [slug] page ─────────────────────────────────────────────────────────

export interface BlogSlugPost {
  id:           string
  title:        string
  slug:         string
  excerpt?:     string
  content?:     unknown
  createdAt?:   string
  updatedAt?:   string
  status?:      string
  coverImage?:  { url?: string; alt?: string } | null
  seo?: {
    title?:       string | null
    description?: string | null
    image?:       { url?: string } | null
    noIndex?:     boolean | null
  } | null
}

async function _fetchBlogPostBySlug(slug: string): Promise<BlogSlugPost | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 1,
    })
    return (res.docs[0] as unknown as BlogSlugPost) ?? null
  } catch {
    return null
  }
}

export const getBlogPostBySlug = (slug: string) =>
  unstable_cache(
    () => _fetchBlogPostBySlug(slug),
    ['blog-post', slug],
    { revalidate: 300, tags: ['blog'] },
  )()

// ─── Contact page ─────────────────────────────────────────────────────────────

export interface ContactRawData {
  settings: {
    contact?: {
      email?:      string
      phone?:      string
      address?:    string
      calendly?:   string
      linkedin?:   string
      artstation?: string
    }
  }
  cp: ContactPageGlobal
}

async function _fetchContactData(): Promise<ContactRawData> {
  try {
    const payload = await getPayload({ config })
    const [settings, cp] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }) as Promise<ContactRawData['settings']>,
      payload.findGlobal({ slug: 'contact-page' })  as Promise<ContactPageGlobal>,
    ])
    return { settings, cp }
  } catch {
    return { settings: {}, cp: {} as ContactPageGlobal }
  }
}

export const getContactData = unstable_cache(
  _fetchContactData,
  ['contact'],
  { revalidate: 600, tags: ['contact'] },
)

// ─── FAQs ─────────────────────────────────────────────────────────────────────

async function _fetchGeneralFAQs(): Promise<FAQItem[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'faqs',
      where: { category: { equals: 'general' } },
      sort: 'order',
      limit: 100,
      depth: 0,
    })
    return res.docs as unknown as FAQItem[]
  } catch { return [] }
}

export const getGeneralFAQs = () =>
  unstable_cache(
    () => _fetchGeneralFAQs(),
    ['faqs-general'],
    { revalidate: 600, tags: ['faqs', 'about'] },
  )()

async function _fetchServiceFAQs(serviceId: string): Promise<FAQItem[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'faqs',
      where: {
        and: [
          { category: { equals: 'service-specific' } },
          { service: { equals: serviceId } },
        ],
      },
      sort: 'order',
      limit: 50,
      depth: 0,
    })
    return res.docs as unknown as FAQItem[]
  } catch { return [] }
}

export const getServiceFAQs = (serviceId: string) =>
  unstable_cache(
    () => _fetchServiceFAQs(serviceId),
    ['faqs-service', serviceId],
    { revalidate: 600, tags: ['faqs', 'services'] },
  )()
