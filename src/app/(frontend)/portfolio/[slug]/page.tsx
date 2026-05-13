import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '../../../../../payload/payload.config'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

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
  status?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  characters:   'Characters',
  weapons:      'Weapons',
  vehicles:     'Vehicles',
  environments: 'Environments',
  props:        'Props',
  'vr-assets':  'VR Assets',
}

async function getItem(slug: string): Promise<PortfolioItem | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'portfolio',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
    })
    return (res.docs[0] as unknown as PortfolioItem) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) return { title: 'Not Found' }

  return {
    title: item.title,
    description: item.shortDescription || `${item.title} — AAA game art by XQube Studio.`,
    openGraph: {
      title: `${item.title} | XQube Studio Portfolio`,
      description: item.shortDescription || `${item.title} — AAA game art by XQube Studio.`,
      images: item.heroImage?.url ? [{ url: item.heroImage.url }] : [],
      url: `https://www.xqubestudio.com/portfolio/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} | XQube Studio`,
      description: item.shortDescription || `${item.title} — AAA game art by XQube Studio.`,
    },
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'portfolio',
      where: { status: { equals: 'published' } },
      limit: 500,
      select: { slug: true },
    })
    return res.docs.map((item: any) => ({ slug: item.slug }))
  } catch {
    return []
  }
}

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) notFound()

  return (
    <>
      <section className="xq-section">
        <div className="xq-container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-xq-muted mb-8">
            <Link href="/portfolio" className="hover:text-xq-accent transition-colors">Portfolio</Link>
            <span>/</span>
            {item.category && (
              <>
                <span className="capitalize">{CATEGORY_LABELS[item.category] ?? item.category}</span>
                <span>/</span>
              </>
            )}
            <span className="text-white truncate max-w-[200px]">{item.title}</span>
          </nav>

          <div className="max-w-4xl">
            {item.category && (
              <div className="xq-label mb-4">{CATEGORY_LABELS[item.category] ?? item.category}</div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              {item.title}
            </h1>
            {item.shortDescription && (
              <p className="text-xq-muted text-lg leading-relaxed max-w-2xl">{item.shortDescription}</p>
            )}
          </div>
        </div>
      </section>

      {/* Hero image */}
      {item.heroImage?.url && (
        <section className="border-t border-xq-border">
          <div className="xq-container py-8">
            <div className="rounded-xl overflow-hidden border border-xq-border">
              <Image
                src={item.heroImage.url}
                alt={item.heroImage.alt || item.title}
                width={item.heroImage.width || 1200}
                height={item.heroImage.height || 800}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Like what you see?</h2>
              <p className="text-xq-muted text-sm">Let's talk about your project.</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <Link href="/portfolio" className="xq-btn-ghost text-sm px-6 py-3">
                ← Back to Portfolio
              </Link>
              <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
                className="xq-btn-primary text-sm px-6 py-3">
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
