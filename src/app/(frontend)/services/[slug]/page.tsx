import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '../../../../../payload/payload.config'
import { serializeLexical } from '@/lib/serializeLexical'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { buildBreadcrumbList, BASE_URL, ORG_REF } from '@/lib/jsonLd'
import type { ServiceItem } from '@/types/cms'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getService(slug: string): Promise<ServiceItem | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    return (res.docs[0] as unknown as ServiceItem) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return { title: 'Not Found' }
  return buildPageMetadata({
    seo: service.seo,
    defaultTitle: `${service.title} | XQUBE Studio`,
    defaultDescription: service.shortDescription || `${service.title} — AAA game art and production services by XQUBE Studio.`,
    url: `https://www.xqubestudio.com/services/${slug}`,
    ogImage: service.seo?.image?.url || service.image?.url,
  })
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  const descriptionHtml = service.description ? serializeLexical(service.description) : ''
  const serviceUrl      = `${BASE_URL}/services/${slug}`

  const columns = service.features && service.features.length > 3
    ? [service.features.slice(0, Math.ceil(service.features.length / 2)), service.features.slice(Math.ceil(service.features.length / 2))]
    : [service.features ?? [], []]

  return (
    <>
      {/* Service structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':   'https://schema.org',
            '@type':      'Service',
            name:          service.title,
            description:   service.seo?.description || service.shortDescription || undefined,
            url:           serviceUrl,
            provider:      ORG_REF,
            ...(service.platforms ? { serviceType: service.platforms } : {}),
          }),
        }}
      />
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbList([
            { name: 'Home',     url: BASE_URL },
            { name: 'Services', url: `${BASE_URL}/services` },
            { name: service.title, url: serviceUrl },
          ])),
        }}
      />

      {/* Hero */}
      {service.image?.url ? (
        <div className="relative w-full h-[45vh] md:h-[60vh] overflow-hidden bg-xq-surface">
          <Image
            src={service.image.url}
            alt={service.image.alt || service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 xq-container pb-10">
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
              <Link href="/services" className="hover:text-xq-accent transition-colors">Services</Link>
              <span>/</span>
              <span className="text-white/80">{service.title}</span>
            </nav>
            {service.icon && <div className="text-3xl mb-3">{service.icon}</div>}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {service.title}
            </h1>
          </div>
        </div>
      ) : (
        <section className="xq-section border-b border-xq-border">
          <div className="xq-container">
            <nav className="flex items-center gap-2 text-sm text-xq-muted mb-8">
              <Link href="/services" className="hover:text-xq-accent transition-colors">Services</Link>
              <span>/</span>
              <span className="text-white">{service.title}</span>
            </nav>
            {service.icon && <div className="text-3xl mb-4">{service.icon}</div>}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">{service.title}</h1>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="xq-section">
        <div className="xq-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-10 xl:gap-16 items-start">

            {/* LEFT — description + features */}
            <div className="space-y-10">

              {/* Short summary */}
              {service.shortDescription && (
                <p className="text-xq-muted text-lg leading-relaxed max-w-2xl">
                  {service.shortDescription}
                </p>
              )}

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
                  <div className={`grid gap-x-8 gap-y-3 ${columns[1].length > 0 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {service.features.map((f) => (
                      <div key={f.id} className="flex items-start gap-3">
                        <span className="text-xq-accent mt-0.5 shrink-0">→</span>
                        <span className="text-white/80 text-sm leading-relaxed">{f.feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              {service.platforms && (
                <div>
                  <h2 className="text-sm font-semibold text-xq-muted uppercase tracking-widest mb-3">Platforms &amp; Engines</h2>
                  <p className="text-xq-accent text-sm font-medium">{service.platforms}</p>
                </div>
              )}
            </div>

            {/* RIGHT — sticky CTA card */}
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
    </>
  )
}

// ─── Other Services sidebar list ─────────────────────────────────────────────

async function OtherServices({ currentSlug }: { currentSlug: string }) {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      sort: 'order',
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
              {s.icon && <span>{s.icon}</span>}
              <span className="group-hover:underline">{s.title}</span>
              <span className="ml-auto text-xq-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          </li>
        ))}
      </ul>
    )
  } catch {
    return null
  }
}
