'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLivePreview } from '@payloadcms/live-preview-react'
import PageHero from '@/components/PageHero'
import { getLivePreviewServerURL } from '@/lib/livePreview'
import type { PortfolioPageGlobal, PortfolioItem, PortfolioOrderRow, MediaRef } from '@/types/cms'

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
  // Same iframe guard as HomePageClient — prevents live-preview postMessages
  // from the admin (which carry unpopulated relationship IDs) from breaking
  // the public page. Inside the admin iframe we switch to livePreviewData
  // so text fields AND the ordering update in real time as the editor drags.
  const [isInIframe, setIsInIframe] = useState(false)
  useEffect(() => { setIsInIframe(window !== window.parent) }, [])

  const { data: livePreviewData } = useLivePreview<PortfolioPageGlobal>({
    initialData,
    serverURL: getLivePreviewServerURL(serverURL),
    depth: 2,
  })

  const pp = isInIframe ? livePreviewData : initialData

  const heroLabel    = pp.hero?.label    ?? FB.label
  const heroHeading  = pp.hero?.heading  ?? FB.heading
  const heroSubtitle = pp.hero?.subtitle ?? FB.subtitle
  const heroImage    = pp.hero?.image as MediaRef | null | undefined
  const ctaLabel     = pp.hero?.ctaLabel ?? FB.ctaLabel
  const ctaUrl       = pp.hero?.ctaUrl   ?? FB.ctaUrl

  // Re-sort items whenever the live-preview order changes (iframe only).
  // On the public page, items arrive pre-sorted from the server so this
  // useMemo is a no-op (pp.portfolioOrder never changes after mount).
  const displayItems = useMemo(() => {
    const orderRows = (pp.portfolioOrder ?? []) as PortfolioOrderRow[]
    if (orderRows.length === 0) return items
    const idToPos = new Map(
      orderRows.map((row, i) => {
        // row.item may be a populated object or a bare ID number in live preview
        const id = typeof row.item === 'object' ? row.item?.id : row.item
        return [String(id ?? ''), i]
      })
    )
    return [...items].sort((a, b) => {
      const ia = idToPos.get(String(a.id)) ?? Infinity
      const ib = idToPos.get(String(b.id)) ?? Infinity
      return ia - ib
    })
  }, [items, pp.portfolioOrder])

  const hasItems = displayItems.length > 0

  return (
    <>
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <PageHero
        label={heroLabel}
        heading={heroHeading}
        subtitle={heroSubtitle}
        image={heroImage}
      >
        <Link href={ctaUrl} className="xq-btn-primary text-base px-8 py-4">
          {ctaLabel}
        </Link>
      </PageHero>

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
                    ? displayItems.length
                    : displayItems.filter((i) => i.category === cat).length
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
                {displayItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.slug}`}
                    className="group xq-card p-0 overflow-hidden block hover:border-xq-accent/60 transition-colors"
                  >
                    {/* Image with hover overlay */}
                    <div className="relative aspect-[4/3] bg-xq-surface overflow-hidden">
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
                      {/* Slide-up overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {item.category && (
                          <div className="text-xq-accent text-xs font-semibold tracking-widest uppercase mb-1">
                            {CATEGORY_LABELS[item.category] ?? item.category}
                          </div>
                        )}
                        <div className="text-white text-xs font-semibold">View Project →</div>
                      </div>
                    </div>
                    {/* Card text below image */}
                    <div className="p-4">
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
