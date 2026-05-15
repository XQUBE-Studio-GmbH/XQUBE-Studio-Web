import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '../../../payload/payload.config'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'XQube Studio | AAA Game Art & XR Production',
  description: 'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
  openGraph: {
    title: 'XQube Studio | AAA Game Art & XR Production',
    description: 'AAA-quality game art and XR production. Vienna · Dubai · Dhaka.',
    url: 'https://www.xqubestudio.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XQube Studio | AAA Game Art & XR Production',
    description: 'AAA-quality game art and XR production. Vienna · Dubai · Dhaka.',
  },
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stat      { id?: string; value: string; label: string }
interface ServiceItem {
  id: string | number
  title: string
  shortDescription?: string
  icon?: string
  order?: number
  image?: { url?: string; alt?: string } | null
}
interface ClientItem  { id: string | number; name: string }
interface PortfolioItem {
  id: string; title: string; slug: string; category?: string
  shortDescription?: string; heroImage?: { url?: string; alt?: string }
}
interface HomepageGlobal {
  hero?: {
    label?: string; headline?: string; subtitle?: string
    primaryLabel?: string; primaryUrl?: string
    secondaryLabel?: string; secondaryUrl?: string
    showcaseImage?: { url?: string; alt?: string } | null
  }
  stats?: Stat[]
  cta?: { headline?: string; subtitle?: string; buttonLabel?: string; buttonUrl?: string }
}

// ─── Fallbacks (used until admin populates Payload) ───────────────────────────

const FB_STATS: Stat[] = [
  { value: '15+', label: 'Years Experience' },
  { value: '80+', label: 'Clients Worldwide' },
  { value: '20+', label: 'Core Team Members' },
  { value: '3',   label: 'Global Hubs' },
]

const CATEGORY_LABELS: Record<string, string> = {
  characters: 'Characters', weapons: 'Weapons', vehicles: 'Vehicles',
  environments: 'Environments', props: 'Props', 'vr-assets': 'VR Assets',
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [hp, servicesRes, clientsRes, featuredRes] = await Promise.all([
      payload.findGlobal({ slug: 'home-page' }) as Promise<HomepageGlobal>,
      payload.find({ collection: 'services', where: { featured: { equals: true } }, sort: 'order', limit: 4, depth: 1 }),
      payload.find({ collection: 'clients',  where: { featured: { equals: true } }, sort: 'order', limit: 20, depth: 0 }),
      payload.find({ collection: 'portfolio', where: { featured: { equals: true }, status: { equals: 'published' } }, limit: 6, depth: 1 }),
    ])
    return {
      hp:       hp as HomepageGlobal,
      services: servicesRes.docs  as unknown as ServiceItem[],
      clients:  clientsRes.docs   as unknown as ClientItem[],
      featured: featuredRes.docs  as unknown as PortfolioItem[],
    }
  } catch {
    return { hp: {} as HomepageGlobal, services: [], clients: [], featured: [] }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { hp, services, clients, featured } = await getData()

  const hero         = hp.hero ?? {}
  const stats        = hp.stats && hp.stats.length > 0 ? hp.stats : FB_STATS
  const cta          = hp.cta  ?? {}

  const heroLabel    = hero.label          ?? 'Vienna · Dubai · Dhaka'
  const heroHeadline = hero.headline       ?? 'Where Art Meets Precision'
  const heroSubtitle = hero.subtitle       ?? 'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.'
  const primaryLabel = hero.primaryLabel   ?? 'Book a Discovery Call'
  const primaryUrl   = hero.primaryUrl     ?? 'https://calendly.com/tanvirkhandlxqsmgs'
  const secondaryLabel = hero.secondaryLabel ?? 'View Portfolio'
  const secondaryUrl   = hero.secondaryUrl   ?? '/portfolio'

  const ctaHeadline = cta.headline    ?? 'Looking for a long-term art partner?'
  const ctaSubtitle = cta.subtitle    ?? 'We might be the right fit.'
  const ctaBtnLabel = cta.buttonLabel ?? 'Start a Conversation'
  const ctaBtnUrl   = cta.buttonUrl   ?? '/contact'

  const showcaseImage = hero.showcaseImage as { url?: string; alt?: string } | null | undefined

  // Split headline — last word gets green accent
  const words       = heroHeadline.trim().split(' ')
  const accentWord  = words.pop() ?? ''
  const headlineRest = words.join(' ')

  // Client names fallback
  const clientNames = clients.length > 0
    ? clients.map((c) => c.name)
    : ['BMW', 'INDG', 'FlightSim Studio', 'Fresh TV', 'Cyberfox', 'C3D', 'Barney Studio']

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0a1f13]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-xq-accent/5 rounded-full blur-3xl" />
        <div className="xq-container relative z-10">
          <div className={showcaseImage?.url ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' : 'max-w-4xl'}>
            <div>
              <div className="xq-label mb-6">{heroLabel}</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.05]">
                {headlineRest} <span className="text-xq-accent">{accentWord}</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-xq-muted max-w-2xl mb-10 leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={primaryUrl} target={primaryUrl.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="xq-btn-primary text-base px-8 py-4">
                  {primaryLabel}
                </Link>
                <Link href={secondaryUrl} className="xq-btn-ghost text-base px-8 py-4">
                  {secondaryLabel}
                </Link>
              </div>
            </div>
            {showcaseImage?.url && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-xq-border hidden lg:block">
                <Image
                  src={showcaseImage.url}
                  alt={showcaseImage.alt || 'XQube Studio'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="border-y border-xq-border bg-xq-surface">
        <div className="xq-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-black text-xq-accent mb-1">{stat.value}</div>
                <div className="text-sm text-xq-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client strip ─────────────────────────────────────── */}
      <section className="border-b border-xq-border bg-xq-bg">
        <div className="xq-container py-10">
          <p className="text-center text-xs text-xq-muted tracking-widest uppercase mb-8">
            Trusted by studios worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clientNames.map((name) => (
              <div key={name} className="text-xq-muted font-semibold text-sm tracking-wide opacity-60 hover:opacity-100 transition-opacity">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Work ─────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="xq-section border-b border-xq-border">
          <div className="xq-container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="xq-label mb-4">Featured Work</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
                  Built for production pipelines
                </h2>
              </div>
              <Link href="/portfolio" className="xq-btn-ghost text-sm hidden md:flex shrink-0 ml-8">
                View All Work →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((item, i) => (
                <Link key={item.id} href={`/portfolio/${item.slug}`}
                  className={`group relative overflow-hidden rounded-xl border border-xq-border bg-xq-surface block ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                  <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[4/3] md:aspect-auto md:h-full min-h-[300px]' : 'aspect-video'}`}>
                    {item.heroImage?.url ? (
                      <Image src={item.heroImage.url} alt={item.heroImage.alt || item.title} fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-xq-surface flex items-center justify-center">
                        <span className="text-xq-muted text-xs">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {item.category && (
                      <div className="text-xq-accent text-xs font-semibold uppercase tracking-wider mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </div>
                    )}
                    <h3 className={`font-black text-white drop-shadow-md ${i === 0 ? 'text-xl md:text-2xl' : 'text-base'}`}>
                      {item.title}
                    </h3>
                    {i === 0 && item.shortDescription && (
                      <p className="text-white/70 text-sm mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.shortDescription}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/portfolio" className="xq-btn-ghost">View All Work →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Services ──────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="xq-section border-b border-xq-border">
          <div className="xq-container">
            <div className="mb-16">
              <div className="xq-label mb-4">What We Do</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
                Production-grade art at scale
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div key={String(service.id)} className={`xq-card ${service.image?.url ? 'p-0 overflow-hidden' : ''}`}>
                  {service.image?.url && (
                    <div className="relative aspect-video">
                      <Image src={service.image.url} alt={service.image.alt || service.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className={service.image?.url ? 'p-6' : ''}>
                    {service.icon && <div className="text-3xl mb-4">{service.icon}</div>}
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    {service.shortDescription && (
                      <p className="text-xq-muted text-sm leading-relaxed">{service.shortDescription}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/services" className="xq-btn-ghost">View All Services →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">
              {ctaHeadline}
            </h2>
            <p className="text-xq-muted text-lg mb-10">{ctaSubtitle}</p>
            <Link href={ctaBtnUrl} className="xq-btn-primary text-base px-8 py-4">
              {ctaBtnLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
