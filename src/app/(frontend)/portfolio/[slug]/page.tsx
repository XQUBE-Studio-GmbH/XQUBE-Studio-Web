import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { serializeLexical } from '@/lib/serializeLexical'
import PortfolioGallery from '@/components/PortfolioGallery'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { buildBreadcrumbList, BASE_URL, ORG_REF } from '@/lib/jsonLd'
import { getPortfolioItemBySlug, getRelatedPortfolioItems } from '@/lib/cachedData'

// force-dynamic: prevents build-time DB calls; rendered at request time instead.
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

interface GalleryItem {
  id: string
  image: { url?: string; alt?: string; width?: number; height?: number }
  caption?: string
}

interface SoftwareItem {
  id: string
  tool: string
}

interface ToolItem {
  id: string | number
  name: string
  logo?: { url?: string; alt?: string } | null
}

interface PortfolioItem {
  id: string
  title: string
  slug: string
  category?: string
  shortDescription?: string
  client?: string
  year?: number
  videoUrl?: string
  heroImage?: { url?: string; alt?: string; width?: number; height?: number }
  gallery?: GalleryItem[]
  overview?: unknown
  toolsUsed?: ToolItem[]
  software?: SoftwareItem[]
  polyCount?: string
  textureRes?: string
  deliveryTime?: string
  status?: string
  seo?: {
    title?: string | null
    description?: string | null
    image?: { url?: string } | null
    noIndex?: boolean | null
  } | null
}

const CATEGORY_LABELS: Record<string, string> = {
  characters:   'Characters',
  weapons:      'Weapons',
  vehicles:     'Vehicles',
  environments: 'Environments',
  props:        'Props',
  'vr-assets':  'VR Assets',
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

async function getItem(slug: string): Promise<PortfolioItem | null> {
  return getPortfolioItemBySlug(slug) as Promise<PortfolioItem | null>
}

async function getRelated(currentId: string, category?: string): Promise<PortfolioItem[]> {
  return getRelatedPortfolioItems(currentId, category) as Promise<PortfolioItem[]>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) return { title: 'Not Found' }
  return buildPageMetadata({
    seo: item.seo,
    defaultTitle: `${item.title} | XQUBE Studio Portfolio`,
    defaultDescription: item.shortDescription || `${item.title} — AAA game art by XQUBE Studio.`,
    url: `https://www.xqubestudio.com/portfolio/${slug}`,
    ogImage: item.heroImage?.url || item.gallery?.[0]?.image?.url,
  })
}

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params
  const item = await getItem(slug)
  if (!item) notFound()

  const related = await getRelated(item.id, item.category)
  const overviewHtml = item.overview ? serializeLexical(item.overview) : ''
  const embedUrl = item.videoUrl ? getEmbedUrl(item.videoUrl) : null

  const itemUrl      = `${BASE_URL}/portfolio/${item.slug}`
  const categoryLabel = item.category ? (CATEGORY_LABELS[item.category] ?? item.category) : undefined

  return (
    <>
      {/* CreativeWork structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':   'https://schema.org',
            '@type':      'CreativeWork',
            name:          item.title,
            description:   item.seo?.description || item.shortDescription || undefined,
            url:           itemUrl,
            image:         item.seo?.image?.url || item.heroImage?.url || undefined,
            creator:       ORG_REF,
            ...(categoryLabel ? { genre: categoryLabel } : {}),
            ...(item.toolsUsed?.length
              ? { keywords: item.toolsUsed.map((t) => t.name).join(', ') }
              : {}),
          }),
        }}
      />
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbList([
            { name: 'Home',      url: BASE_URL },
            { name: 'Portfolio', url: `${BASE_URL}/portfolio` },
            { name: item.title,  url: itemUrl },
          ])),
        }}
      />

      {/* Full-width hero */}
      {item.heroImage?.url && (
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-xq-surface">
          <Image
            src={item.heroImage.url}
            alt={item.heroImage.alt || item.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 xq-container pb-10">
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
              <Link href="/portfolio" className="hover:text-xq-accent transition-colors">Portfolio</Link>
              <span>/</span>
              {item.category && (
                <>
                  <Link href={`/portfolio?category=${item.category}`} className="hover:text-xq-accent transition-colors">
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-white/80 truncate max-w-[200px]">{item.title}</span>
            </nav>
            {item.category && (
              <div className="xq-label mb-3">{CATEGORY_LABELS[item.category] ?? item.category}</div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {item.title}
            </h1>
          </div>
        </div>
      )}

      {/* No hero fallback header */}
      {!item.heroImage?.url && (
        <section className="xq-section border-b border-xq-border">
          <div className="xq-container">
            <nav className="flex items-center gap-2 text-sm text-xq-muted mb-8">
              <Link href="/portfolio" className="hover:text-xq-accent transition-colors">Portfolio</Link>
              <span>/</span>
              <span className="text-white">{item.title}</span>
            </nav>
            {item.category && <div className="xq-label mb-4">{CATEGORY_LABELS[item.category] ?? item.category}</div>}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">{item.title}</h1>
          </div>
        </section>
      )}

      {/* Main body */}
      <section className="xq-section">
        <div className="xq-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-10 xl:gap-16 items-start">

            {/* LEFT — gallery + video + overview */}
            <div className="space-y-10">
              {/* Short description */}
              {item.shortDescription && (
                <p className="text-xq-muted text-lg leading-relaxed max-w-2xl">{item.shortDescription}</p>
              )}

              {/* Gallery grid with lightbox */}
              {item.gallery && item.gallery.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-xq-muted uppercase tracking-widest mb-5">Gallery</h2>
                  <PortfolioGallery items={item.gallery} title={item.title} />
                </div>
              )}

              {/* Video embed */}
              {embedUrl && (
                <div>
                  <h2 className="text-sm font-semibold text-xq-muted uppercase tracking-widest mb-5">Reel / Video</h2>
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-xq-border">
                    <iframe
                      src={embedUrl}
                      title={`${item.title} — video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Project overview */}
              {overviewHtml && (
                <div>
                  <h2 className="text-sm font-semibold text-xq-muted uppercase tracking-widest mb-5">Project Overview</h2>
                  <div
                    className="prose-xq"
                    dangerouslySetInnerHTML={{ __html: overviewHtml }}
                  />
                </div>
              )}
            </div>

            {/* RIGHT — sticky project details card */}
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="xq-card space-y-5">
                <h2 className="text-white font-bold text-base border-b border-xq-border pb-4">Project Details</h2>

                {item.client && (
                  <div>
                    <div className="text-xq-muted text-xs uppercase tracking-widest mb-1">Client</div>
                    <div className="text-white text-sm font-medium">{item.client}</div>
                  </div>
                )}
                {item.year && (
                  <div>
                    <div className="text-xq-muted text-xs uppercase tracking-widest mb-1">Year</div>
                    <div className="text-white text-sm font-medium">{item.year}</div>
                  </div>
                )}
                {item.category && (
                  <div>
                    <div className="text-xq-muted text-xs uppercase tracking-widest mb-1">Category</div>
                    <div className="text-white text-sm font-medium">{CATEGORY_LABELS[item.category] ?? item.category}</div>
                  </div>
                )}

                {(item.polyCount || item.textureRes || item.deliveryTime) && (
                  <div className="border-t border-xq-border pt-5 space-y-3">
                    <div className="text-xq-muted text-xs uppercase tracking-widest mb-3">Technical Specs</div>
                    {item.polyCount && (
                      <div className="flex justify-between items-center">
                        <span className="text-xq-muted text-xs">Poly Count</span>
                        <span className="text-white text-sm font-medium">{item.polyCount}</span>
                      </div>
                    )}
                    {item.textureRes && (
                      <div className="flex justify-between items-center">
                        <span className="text-xq-muted text-xs">Texture Res</span>
                        <span className="text-white text-sm font-medium">{item.textureRes}</span>
                      </div>
                    )}
                    {item.deliveryTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-xq-muted text-xs">Delivery</span>
                        <span className="text-white text-sm font-medium">{item.deliveryTime}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tools Used — logo-based pills */}
                {item.toolsUsed && item.toolsUsed.length > 0 && (
                  <div className="border-t border-xq-border pt-5">
                    <div className="text-xq-muted text-xs uppercase tracking-widest mb-3">Software Used</div>
                    <div className="flex flex-wrap gap-2">
                      {item.toolsUsed.map((t) => (
                        <span key={t.id} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-xq-surface border border-xq-border text-white rounded-full">
                          {t.logo?.url && (
                            <Image src={t.logo.url} alt={t.logo.alt || t.name} width={14} height={14} className="object-contain shrink-0" />
                          )}
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Legacy software fallback */}
                {(!item.toolsUsed || item.toolsUsed.length === 0) && item.software && item.software.length > 0 && (
                  <div className="border-t border-xq-border pt-5">
                    <div className="text-xq-muted text-xs uppercase tracking-widest mb-3">Software Used</div>
                    <div className="flex flex-wrap gap-2">
                      {item.software.map((s) => (
                        <span key={s.id} className="px-2.5 py-1 text-xs font-medium bg-xq-surface border border-xq-border text-white rounded-full">
                          {s.tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA card */}
              <div className="rounded-xl border border-xq-accent/30 bg-xq-accent/5 p-6 space-y-4">
                <h3 className="text-white font-bold text-base">Interested in similar work?</h3>
                <p className="text-xq-muted text-sm leading-relaxed">Tell us about your project — we'll scope a tailored solution.</p>
                <Link
                  href="https://calendly.com/tanvirkhandlxqsmgs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="xq-btn-primary w-full justify-center text-sm py-3"
                >
                  Book a Call
                </Link>
                <Link href="/contact" className="xq-btn-ghost w-full justify-center text-sm py-3">
                  Send a Brief →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Work */}
      {related.length > 0 && (
        <section className="xq-section border-t border-xq-border">
          <div className="xq-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="xq-label mb-2">More Work</div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Related Projects</h2>
              </div>
              <Link href="/portfolio" className="xq-btn-ghost text-sm hidden sm:flex">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} href={`/portfolio/${r.slug}`} className="group block">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-xq-border bg-xq-surface mb-3">
                    {r.heroImage?.url ? (
                      <Image
                        src={r.heroImage.url}
                        alt={r.heroImage.alt || r.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xq-muted text-xs">No image</div>
                    )}
                  </div>
                  <div>
                    {r.category && <div className="text-xq-accent text-xs font-semibold uppercase tracking-wider mb-1">{CATEGORY_LABELS[r.category] ?? r.category}</div>}
                    <h3 className="text-white font-bold text-sm group-hover:text-xq-accent transition-colors">{r.title}</h3>
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
