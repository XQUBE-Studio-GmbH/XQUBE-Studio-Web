import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: "Browse XQube Studio's portfolio of AAA game art — characters, weapons, vehicles, environments, props, and VR assets.",
  openGraph: {
    title: 'Portfolio | XQube Studio',
    description: 'AAA game art for studios worldwide — characters, weapons, environments, VR assets.',
    url: 'https://www.xqubestudio.com/portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | XQube Studio',
    description: 'AAA game art — characters, weapons, environments, VR assets.',
  },
}

// Revalidate every 60s so new items appear without a redeploy
export const revalidate = 60

const CATEGORY_LABELS: Record<string, string> = {
  characters:   'Characters',
  weapons:      'Weapons',
  vehicles:     'Vehicles',
  environments: 'Environments',
  props:        'Props',
  'vr-assets':  'VR Assets',
}

const ALL_CATEGORIES = ['All', ...Object.keys(CATEGORY_LABELS)]

interface PortfolioItem {
  id: string
  title: string
  slug: string
  category?: string
  shortDescription?: string
  heroImage?: {
    url?: string
    alt?: string
    width?: number
    height?: number
  }
}

async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'portfolio',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 200,
    })
    return res.docs as unknown as PortfolioItem[]
  } catch {
    return []
  }
}

export default async function PortfolioPage() {
  const items = await getPortfolioItems()
  const hasItems = items.length > 0

  return (
    <>
      <section className="xq-section">
        <div className="xq-container">
          <div className="xq-label mb-4">Our Work</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">Portfolio</h1>
          <p className="text-xq-muted text-lg max-w-xl">
            AAA-quality game art delivered for studios worldwide. Browse by category below.
          </p>
        </div>
      </section>

      <section className="border-t border-xq-border pb-32">
        <div className="xq-container mt-12">

          {hasItems ? (
            <>
              {/* Category filter chips — static for now, JS filtering can be layered on later */}
              <div className="flex flex-wrap gap-3 mb-12">
                {ALL_CATEGORIES.map((cat) => {
                  const value = cat === 'All' ? 'all' : cat
                  const count = cat === 'All'
                    ? items.length
                    : items.filter((i) => i.category === cat).length
                  if (cat !== 'All' && count === 0) return null
                  return (
                    <div key={cat}
                      className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${
                        cat === 'All'
                          ? 'bg-xq-accent text-black border-xq-accent'
                          : 'border-xq-border text-xq-muted hover:border-xq-accent hover:text-xq-accent'
                      }`}>
                      {cat === 'All' ? cat : CATEGORY_LABELS[value] ?? cat}
                      <span className="ml-1.5 opacity-60 text-xs">({count})</span>
                    </div>
                  )
                })}
              </div>

              {/* Portfolio grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.slug}`}
                    className="group xq-card p-0 overflow-hidden block hover:border-xq-accent/60 transition-colors"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] bg-xq-surface overflow-hidden">
                      {item.heroImage?.url ? (
                        <Image
                          src={item.heroImage.url}
                          alt={item.heroImage.alt || item.title}
                          width={item.heroImage.width || 800}
                          height={item.heroImage.height || 600}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xq-muted text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      {item.category && (
                        <div className="text-xq-accent text-xs font-semibold tracking-wide uppercase mb-1">
                          {CATEGORY_LABELS[item.category] ?? item.category}
                        </div>
                      )}
                      <h2 className="text-white font-bold text-sm leading-snug group-hover:text-xq-accent transition-colors">
                        {item.title}
                      </h2>
                      {item.shortDescription && (
                        <p className="text-xq-muted text-xs mt-1 line-clamp-2">{item.shortDescription}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="xq-card py-20 text-center">
              <div className="text-xq-accent text-xs font-semibold tracking-widest uppercase mb-3">Coming Soon</div>
              <h2 className="text-white font-black text-2xl mb-3">Portfolio items loading</h2>
              <p className="text-xq-muted text-sm max-w-sm mx-auto">
                Add and publish portfolio items via the admin panel and they'll appear here automatically.
              </p>
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-xq-muted mb-6">Want to see work relevant to your project?</p>
            <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
              className="xq-btn-primary text-base px-8 py-4">
              Book a Call to See More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
