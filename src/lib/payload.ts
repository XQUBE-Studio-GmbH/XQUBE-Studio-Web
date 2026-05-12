/**
 * lib/payload.ts
 * ─────────────────────────────────────────────────────────────
 * Server-side data fetching helpers for all Payload collections.
 * Used in Next.js Server Components (RSC) only.
 * All functions are cached with Next.js fetch cache for performance.
 */

const PAYLOAD_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// ─── Generic fetch helper ────────────────────────────────────
async function payloadFetch<T>(
  endpoint: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60, ...options?.next },
      ...options,
    })
    if (!res.ok) return null
    const data = await res.json()
    return data
  } catch (err) {
    console.error(`[payload] Fetch error for ${endpoint}:`, err)
    return null
  }
}

// ─── Site Settings ───────────────────────────────────────────
export async function getSiteSettings() {
  return payloadFetch('/globals/site-settings', {
    next: { revalidate: 300, tags: ['site-settings'] },
  })
}

// ─── Navigation ──────────────────────────────────────────────
export async function getNavigation() {
  return payloadFetch('/globals/navigation', {
    next: { revalidate: 300, tags: ['navigation'] },
  })
}

// ─── Portfolio ───────────────────────────────────────────────
export async function getPortfolioItems(params?: {
  category?: string
  featured?: boolean
  limit?: number
  page?: number
}) {
  const qs = new URLSearchParams()
  if (params?.category) qs.set('where[category][equals]', params.category)
  if (params?.featured) qs.set('where[featured][equals]', 'true')
  if (params?.limit)    qs.set('limit', String(params.limit))
  if (params?.page)     qs.set('page',  String(params.page))
  qs.set('where[status][equals]', 'published')
  qs.set('sort', '-updatedAt')

  return payloadFetch(`/portfolio?${qs}`, {
    next: { revalidate: 60, tags: ['portfolio'] },
  })
}

export async function getPortfolioItem(slug: string) {
  return payloadFetch(`/portfolio?where[slug][equals]=${slug}&limit=1`, {
    next: { revalidate: 60, tags: [`portfolio-${slug}`] },
  })
}

// ─── Services ────────────────────────────────────────────────
export async function getServices(featured?: boolean) {
  const qs = new URLSearchParams()
  if (featured) qs.set('where[featured][equals]', 'true')
  qs.set('sort', 'order')
  qs.set('limit', '20')

  return payloadFetch(`/services?${qs}`, {
    next: { revalidate: 300, tags: ['services'] },
  })
}

// ─── Team Members ────────────────────────────────────────────
export async function getTeamMembers() {
  return payloadFetch('/team-members?sort=order&limit=20', {
    next: { revalidate: 300, tags: ['team'] },
  })
}

// ─── Clients (Logo Strip) ────────────────────────────────────
export async function getClients(featured?: boolean) {
  const qs = new URLSearchParams()
  if (featured) qs.set('where[featured][equals]', 'true')
  qs.set('sort', 'order')
  qs.set('limit', '20')

  return payloadFetch(`/clients?${qs}`, {
    next: { revalidate: 300, tags: ['clients'] },
  })
}

// ─── Blog Posts ──────────────────────────────────────────────
export async function getBlogPosts(params?: {
  limit?: number
  page?: number
  tag?: string
}) {
  const qs = new URLSearchParams()
  qs.set('where[status][equals]', 'published')
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.page)  qs.set('page',  String(params.page))
  qs.set('sort', '-publishedAt')

  return payloadFetch(`/blog-posts?${qs}`, {
    next: { revalidate: 60, tags: ['blog'] },
  })
}

export async function getBlogPost(slug: string) {
  return payloadFetch(`/blog-posts?where[slug][equals]=${slug}&limit=1`, {
    next: { revalidate: 60, tags: [`blog-${slug}`] },
  })
}

// ─── Sitemap data ────────────────────────────────────────────
export async function getSitemapData() {
  const [portfolio, blog] = await Promise.all([
    payloadFetch<any>('/portfolio?where[status][equals]=published&limit=200&select[slug]=true'),
    payloadFetch<any>('/blog-posts?where[status][equals]=published&limit=200&select[slug]=true&select[updatedAt]=true'),
  ])
  return { portfolio: portfolio?.docs || [], blog: blog?.docs || [] }
}
