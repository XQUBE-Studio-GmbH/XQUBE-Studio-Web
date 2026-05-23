import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '../../../../../payload/payload.config'
import { serializeLexical } from '@/lib/serializeLexical'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { buildBreadcrumbList, BASE_URL, ORG_REF } from '@/lib/jsonLd'
import PageHero from '@/components/PageHero'
import type { ServiceItem, ServiceToolItem } from '@/types/cms'

export const dynamic = 'force-dynamic'

// ─── Category mapping ────────────────────────────────────────────────────────
// Maps service slug → portfolio categories to show relevant work on the detail page.

const SERVICE_CATEGORIES: Record<string, string[]> = {
  'game-art-production': ['characters', 'weapons', 'vehicles', 'environments', 'props'],
  'vr-assets':           ['vr-assets'],
  'interactive-dev':     ['characters', 'environments', 'vr-assets'],
  'staff-augmentation':  ['characters', 'weapons', 'vehicles', 'environments', 'props', 'vr-assets'],
}

const CATEGORY_LABELS: Record<string, string> = {
  characters:   'Characters',
  weapons:      'Weapons',
  vehicles:     'Vehicles',
  environments: 'Environments',
  props:        'Props',
  'vr-assets':  'VR Assets',
}

interface Props {
  params: Promise<{ slug: string }>
}

interface PortfolioPreview {
  id:          string
  title:       string
  slug:        string
  category?:   string
  heroImage?:  { url?: string; alt?: string } | null
}

async function getService(slug: string): Promise<ServiceItem | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      where:      { slug: { equals: slug } },
      limit:      1,
      depth:      2,   // depth 2 to resolve toolsUsed → tool → logo
    })
    return (res.docs[0] as unknown as ServiceItem) ?? null
  } catch {
    return null
  }
}

async function getRelatedPortfolio(categories: string[]): Promise<PortfolioPreview[]> {
  if (categories.length === 0) return []
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'portfolio',
      where: {
        and: [
          { status:   { equals: 'published' } },
          { category: { in: categories } },
        ],
      },
      sort:  '-createdAt',
      limit: 6,
      depth: 1,
    })
    return res.docs as unknown as PortfolioPreview[]
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return { title: 'Not Found' }
  return buildPageMetadata({
    seo:              service.seo,
    defaultTitle:     `${service.title} | XQUBE Studio`,
    defaultDescription: service.shortDescription || `${service.title} — AAA game art and production services by XQUBE Studio.`,
    url:              `https://www.xqubestudio.com/services/${slug}`,
    ogImage:          service.seo?.image?.url || service.image?.url,
  })
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  const categories      = SERVICE_CATEGORIES[slug] ?? []
  const [descriptionHtml, relatedWork] = await Promise.all([
    Promise.resolve(service.description ? serializeLexical(service.description) : ''),
    getRelatedPortfolio(categories),
  ])

  const serviceUrl = `${BASE_URL}/services/${slug}`
  const tools      = (service.toolsUsed ?? []) as ServiceToolItem[]

  return (
    <>
      {/* Service structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'Service',
            name:        service.title,
            description: service.seo?.description || service.shortDescription || undefined,
            url:         serviceUrl,
            provider:    ORG_REF,
            ...(service.platforms ? { serviceType: service.platforms } : {}),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbList([
            { name: 'Home',        url: BASE_URL },
            { name: 'Services',    url: `${BASE_URL}/services` },
            { name: service.title, url: serviceUrl },
          ])),
        }}
      />

      {/* ── Hero banner — matches Services / Portfolio / About page style ── */}
      <PageHero
        label="Services"
        heading={service.title}
        subtitle={service.shortDescription}
        image={service.image ?? undefined}
        minHeight="min-h-[45vh]"
      />

      {/* ── Main body ── */}
      <section className="xq-section">
        <div className="xq-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-10 xl:gap-16 items-start">

            {/* LEFT */}
            <div className="space-y-12">

              {/* Full richText description */}
              {descriptionHtml && (
                <div>
                  <h2 className="text-sm font-semibold text-xq-muted uppercase tracking-widest mb-5">Overview</h2>
                  <div className="prose-xq" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </div>
              )}

              {/* Feature bullets — two columns when 4+ items */}
              {service.features && service.features.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-xq-muted uppercase tracking-widest mb-5">What&apos;s Included</h2>
                  <div className={`grid gap-x-8 gap-y-3 ${service.features.length > 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {service.features.map((f) => (
                      <div key={f.id} className="flex items-start gap-3">
                        <span className="text-xq-accent mt-0.5 shrink-0">→</span>
                        <span className="text-white/80 text-sm leading-relaxed">{f.feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools used — logo pills */}
              {tools.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-xq-muted uppercase tracking-widest mb-5">Tools &amp; Software</h2>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((t) => (
                      <span
                        key={t.id}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-xq-surface border border-xq-border text-white rounded-full"
                      >
                        {t.logo?.url && (
                          <Image
                            src={t.logo.url}
                            alt={t.logo.alt || t.name}
                            width={16}
                            height={16}
                            className="object-contain shrink-0"
                          />
                        )}
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT — sticky CTA + other services */}
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="rounded-xl border border-xq-accent/30 bg-xq-accent/5 p-6 space-y-4">
                <h3 className="text-white font-bold text-base">Ready to start?</h3>
                <p className="text-xq-muted text-sm leading-relaxed">
                  Tell us about your project and we&apos;ll scope a tailored solution — no fluff, no middlemen.
                </p>
                <Link
                  href="https://calendly.com/tanvirkhandlxqsmgs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="xq-btn-primary w-full justify-center text-sm py-3"
                >
                  Book a 30-minute Call
                </Link>
                <Link href="/contact" className="xq-btn-ghost w-full justify-center text-sm py-3">
                  Send a Brief →
                </Link>
              </div>

              <div className="xq-card space-y-4">
                <h3 className="text-white font-bold text-sm border-b border-xq-border pb-3">Other Services</h3>
                <OtherServices currentSlug={slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related portfolio work ── */}
      {relatedWork.length > 0 && (
        <section className="xq-section border-t border-xq-border">
          <div className="xq-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="xq-label mb-2">Our Work</div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Related Projects</h2>
              </div>
              <Link href="/portfolio" className="xq-btn-ghost text-sm hidden sm:flex">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedWork.map((item) => (
                <Link key={item.id} href={`/portfolio/${item.slug}`} className="group block">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-xq-border bg-xq-surface mb-3">
                    {item.heroImage?.url ? (
                      <Image
                        src={item.heroImage.url}
                        alt={item.heroImage.alt || item.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xq-muted text-xs">No image</div>
                    )}
                  </div>
                  <div>
                    {item.category && (
                      <div className="text-xq-accent text-xs font-semibold uppercase tracking-wider mb-1">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </div>
                    )}
                    <h3 className="text-white font-bold text-sm group-hover:text-xq-accent transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

// ─── Other Services sidebar ───────────────────────────────────────────────────

async function OtherServices({ currentSlug }: { currentSlug: string }) {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      sort:  'order',
      limit: 10,
      depth: 0,
    })
    const others = (res.docs as unknown as ServiceItem[]).filter((s) => s.slug !== currentSlug)
    if (others.length === 0) return null
    return (
      <ul className="space-y-2">
        {others.map((s) => (
          <li key={s.id}>
            <Link
              href={`/services/${s.slug}`}
              className="flex items-center gap-2 text-sm text-xq-muted hover:text-xq-accent transition-colors group"
            >
              {s.icon && <span className="shrink-0">{s.icon}</span>}
              <span className="group-hover:underline">{s.title}</span>
              <span className="ml-auto text-xq-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0">→</span>
            </Link>
          </li>
        ))}
      </ul>
    )
  } catch {
    return null
  }
}
