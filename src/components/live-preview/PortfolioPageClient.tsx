'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLivePreview } from '@payloadcms/live-preview-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaRef { url?: string; alt?: string }

interface PortfolioPageGlobal {
  hero?: {
    label?:    string
    heading?:  string
    subtitle?: string
    image?:    MediaRef | null
    ctaLabel?: string
    ctaUrl?:   string
  }
}

interface PortfolioItem {
  id:               string
  title:            string
  slug:             string
  category?:        string
  shortDescription?: string
  heroImage?:       { url?: string; alt?: string; width?: number; height?: number }
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FB = {
  label:    'Our Work',
  heading:  'AAA Game Art. Delivered.',
  subtitle: 'Browse our portfolio of AAA-quality game art produced for studios worldwide — characters, weapons, environments, and XR assets.',
  ctaLabel: 'Start a Project',
  ctaUrl:   '/contact',
}

const CATEGORY_LABELS: Record<string, string> = {
  characters:   'Characters',
  weapons:      'Weapons',
  vehicles:     'Vehicles',
  environments: 'Environments',
  props:        'Props',
  'vr-assets':  'VR Assets',
}

const ALL_CATEGORIES = ['All', ...Object.keys(CATEGORY_LABELS)]

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialData: PortfolioPageGlobal
  items:       PortfolioItem[]
  serverURL:   string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PortfolioPageClient({ initialData, items, serverURL }: Props) {
  const { data: pp } = useLivePreview<PortfolioPageGlobal>({
    initialData,
    serverURL: typeof window !== 'undefined'
      ? (window !== window.parent && document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin)
      : serverURL,
    depth: 2,
  })

  const heroLabel    = pp.hero?.label    ?? FB.label
  const heroHeading  = pp.hero?.heading  ?? FB.heading
  const heroSubtitle = pp.hero?.subtitle ?? FB.subtitle
  const heroImage    = pp.hero?.image as MediaRef | null | undefined
  const ctaLabel     = pp.hero?.ctaLabel ?? FB.ctaLabel
  const ctaUrl       = pp.hero?.ctaUrl   ?? FB.ctaUrl

  const hasItems = items.length > 0

  return (
    <>
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#060e08] to-[#0a1f13]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {heroImage?.url && (
          <div className="absolute inset-0">
            <Image src={heroImage.url} alt={heroImage.alt || heroHeading} fill className="object-cover" priority />
          </div>
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        {/* Text */}
        <div className="xq-container relative z-10">
          <div className="max-w-3xl">
            <div className="xq-label mb-6">{heroLabel}</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6 leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">{heroHeading}</h1>
            {heroSubtitle && (
              <p className="text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed mb-8 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">{heroSubtitle}</p>
            )}
            <Link href={ctaUrl} className="xq-btn-primary text-base px-8 py-4">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Portfolio grid ─────────────────────────────────────────────────── */}
      <section className="border-t border-xq-border pb-32">
        <div className="xq-container mt-12">
          {hasItems ? (
            <>
              {/* Category filter chips */}
              <div className="flex flex-wrap gap-3 mb-12">
                {ALL_CATEGORIES.map((cat) => {
                  const value = cat === 'All' ? 'all' : cat
                  const count = cat === 'All'
                    ? items.length
                    : items.filter((i) => i.category === cat).length
                  if (cat !== 'All' && count === 0) return null
                  return (
                    <div
                      key={cat}
                      className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${
                        cat === 'All'
                          ? 'bg-xq-accent text-black border-xq-accent'
                          : 'border-xq-border text-xq-muted hover:border-xq-accent hover:text-xq-accent'
                      }`}
                    >
                      {cat === 'All' ? cat : CATEGORY_LABELS[value] ?? cat}
                      <span className="ml-1.5 opacity-60 text-xs">({count})</span>
                    </div>
                  )
                })}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.slug}`}
                    className="group xq-card p-0 overflow-hidden block hover:border-xq-accent/60 transition-colors"
                  >
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
            <div className="xq-card py-20 text-center">
              <div className="text-xq-accent text-xs font-semibold tracking-widest uppercase mb-3">Coming Soon</div>
              <h2 className="text-white font-black text-2xl mb-3">Portfolio items loading</h2>
              <p className="text-xq-muted text-sm max-w-sm mx-auto">
                Add and publish portfolio items via the admin panel and they&apos;ll appear here automatically.
              </p>
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-xq-muted mb-6">Want to see work relevant to your project?</p>
            <Link
              href="https://calendly.com/tanvirkhandlxqsmgs"
              target="_blank"
              rel="noopener noreferrer"
              className="xq-btn-primary text-base px-8 py-4"
            >
              Book a Call to See More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
