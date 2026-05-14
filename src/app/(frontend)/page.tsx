import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '../../../payload/payload.config'

// force-dynamic required: page fetches featured portfolio items from DB at request time.
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

interface PortfolioItem {
  id: string
  title: string
  slug: string
  category?: string
  shortDescription?: string
  heroImage?: { url?: string; alt?: string }
}

const CATEGORY_LABELS: Record<string, string> = {
  characters:   'Characters',
  weapons:      'Weapons',
  vehicles:     'Vehicles',
  environments: 'Environments',
  props:        'Props',
  'vr-assets':  'VR Assets',
}

async function getFeaturedWork(): Promise<PortfolioItem[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'portfolio',
      where: { featured: { equals: true }, status: { equals: 'published' } },
      limit: 6,
      depth: 1,
    })
    return res.docs as unknown as PortfolioItem[]
  } catch {
    return []
  }
}

const services = [
  {
    title: 'Game Art Production',
    description: 'Characters, environments, weapons, vehicles, props, and modular kits — delivered to your pipeline specifications. UE5, Unity, UEFN, Roblox.',
    icon: '🎮',
  },
  {
    title: 'VR Game Assets',
    description: 'Production-ready VR assets and immersive game environments optimized for Meta Quest, HTC Vive, and PlayStation VR.',
    icon: '🥽',
  },
  {
    title: 'Interactive Development',
    description: 'End-to-end development for UEFN, Roblox, and VR games using Unreal Engine and Unity. Shipped titles across all three platforms.',
    icon: '⚡',
  },
  {
    title: 'Staff Augmentation',
    description: 'Dedicated resources embedded directly in your pipeline. Your tools, your process, your standards — from day one.',
    icon: '👥',
  },
]

const clients = ['BMW', 'INDG', 'FlightSim Studio', 'Fresh TV', 'Cyberfox', 'C3D', 'Barney Studio']

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '80+', label: 'Clients Worldwide' },
  { value: '20+', label: 'Core Team Members' },
  { value: '3',   label: 'Global Hubs' },
]

export default async function HomePage() {
  const featured = await getFeaturedWork()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0a1f13]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-xq-accent/5 rounded-full blur-3xl" />
        <div className="xq-container relative z-10">
          <div className="max-w-4xl">
            <div className="xq-label mb-6">Vienna · Dubai · Dhaka</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.05]">
              Where Art Meets <span className="text-xq-accent">Precision</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-xq-muted max-w-2xl mb-10 leading-relaxed">
              XQube Studio delivers AAA-quality game art and XR production for studios worldwide.
              GmbH registered in Vienna. GDPR compliant. IP ownership clear.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
                className="xq-btn-primary text-base px-8 py-4">
                Book a Discovery Call
              </Link>
              <Link href="/portfolio" className="xq-btn-ghost text-base px-8 py-4">
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Client Logos */}
      <section className="border-b border-xq-border bg-xq-bg">
        <div className="xq-container py-10">
          <p className="text-center text-xs text-xq-muted tracking-widest uppercase mb-8">
            Trusted by studios worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clients.map((client) => (
              <div key={client} className="text-xq-muted font-semibold text-sm tracking-wide opacity-60 hover:opacity-100 transition-opacity">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
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

            {/* Asymmetric grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className={`group relative overflow-hidden rounded-xl border border-xq-border bg-xq-surface block ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[4/3] md:aspect-auto md:h-full min-h-[300px]' : 'aspect-video'}`}>
                    {item.heroImage?.url ? (
                      <Image
                        src={item.heroImage.url}
                        alt={item.heroImage.alt || item.title}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      />
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

      {/* Services */}
      <section className="xq-section">
        <div className="xq-container">
          <div className="mb-16">
            <div className="xq-label mb-4">What We Do</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
              Production-grade art at scale
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.title} className="xq-card">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-xq-muted text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="xq-btn-ghost">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">
              Looking for a long-term art partner?
            </h2>
            <p className="text-xq-muted text-lg mb-10">
              We might be the right fit.
            </p>
            <Link href="/contact" className="xq-btn-primary text-base px-8 py-4">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
