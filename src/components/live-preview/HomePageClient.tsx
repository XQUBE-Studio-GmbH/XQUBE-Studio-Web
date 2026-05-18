'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLivePreview } from '@payloadcms/live-preview-react'
import StatCounter from '@/components/StatCounter'
import ScrollReveal from '@/components/ScrollReveal'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSlide {
  id?: string
  eyebrow?:           string
  title?:             string
  subtitle?:          string
  primaryCtaLabel?:   string
  primaryCtaUrl?:     string
  secondaryCtaLabel?: string
  secondaryCtaUrl?:   string
  image?: { url?: string; alt?: string } | null
}

interface Stat { id?: string; value: string; label: string }
interface ServiceItem {
  id: string | number; title: string; shortDescription?: string
  icon?: string; order?: number; image?: { url?: string; alt?: string } | null
}
interface ClientItem  { id: string | number; name: string; logo?: { url?: string; alt?: string } | null }
interface PortfolioItem {
  id: string; title: string; slug: string; category?: string
  shortDescription?: string; heroImage?: { url?: string; alt?: string }
}

interface HomepageGlobal {
  hero?: {
    mode?:     'slideshow' | 'video'
    videoUrl?: string
    slides?:   HeroSlide[]
  }
  stats?: Stat[]
  cta?:  { headline?: string; subtitle?: string; buttonLabel?: string; buttonUrl?: string }
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FB_SLIDES: HeroSlide[] = [
  {
    eyebrow:           'Vienna · Dubai · Dhaka',
    title:             'Where Art Meets Precision',
    subtitle:          'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
    primaryCtaLabel:   'Book a Discovery Call',
    primaryCtaUrl:     'https://calendly.com/tanvirkhandlxqsmgs',
    secondaryCtaLabel: 'View Portfolio',
    secondaryCtaUrl:   '/portfolio',
  },
]

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

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialData: HomepageGlobal
  services:    ServiceItem[]
  clients:     ClientItem[]
  featured:    PortfolioItem[]
  serverURL:   string
}

// ─── Slide text helper ────────────────────────────────────────────────────────

function splitHeadline(title?: string) {
  if (!title) return { rest: '', accent: '' }
  const words = title.trim().split(' ')
  const accent = words.pop() ?? ''
  return { rest: words.join(' '), accent }
}

// ─── Cinematic Hero ───────────────────────────────────────────────────────────

function CinematicHero({ mode, videoUrl, slides }: {
  mode: 'slideshow' | 'video'
  videoUrl: string
  slides: HeroSlide[]
}) {
  const [activeIdx,  setActiveIdx]  = useState(0)
  const [animSeed,   setAnimSeed]   = useState(0)   // increments to restart ken-burns
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const count = slides.length

  const goTo = useCallback((next: number) => {
    setActiveIdx(next)
    setAnimSeed((s) => s + 1)
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % count
        setAnimSeed((s) => s + 1)
        return next
      })
    }, 6000)
  }, [count])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  const prev = () => { goTo((activeIdx - 1 + count) % count); startTimer() }
  const next = () => { goTo((activeIdx + 1) % count);         startTimer() }
  const dot  = (i: number) => { goTo(i); startTimer() }

  const current = slides[activeIdx] ?? slides[0]
  const { rest, accent } = splitHeadline(current?.title)

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Backgrounds ─────────────────────────────────────────────────────── */}
      {/* Base dark fallback (always visible) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#060e08] to-[#0a1f13]" />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* VIDEO MODE: single looping video */}
      {mode === 'video' && videoUrl && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* SLIDESHOW MODE: stacked slides with Ken Burns */}
      {mode === 'slideshow' && slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === activeIdx ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.image?.url && (
            // key changes on each activation → React remounts this div → animation restarts
            <div
              key={i === activeIdx ? `kb-${animSeed}` : `static-${i}`}
              className={i === activeIdx ? 'absolute inset-0 animate-ken-burns' : 'absolute inset-0'}
            >
              <Image
                src={slide.image.url}
                alt={slide.image.alt || slide.title || 'XQube Studio'}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          )}
        </div>
      ))}

      {/* Dark gradient overlay — always on top of background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
      {/* Left-side fade for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* ── Slide text ──────────────────────────────────────────────────────── */}
      <div className="xq-container relative z-10 w-full">
        <div className="max-w-3xl">
          {current?.eyebrow && (
            <div className="xq-label mb-6 animate-[fadeIn_0.5s_ease]" key={`eyebrow-${activeIdx}`}>
              {current.eyebrow}
            </div>
          )}
          <h1
            key={`title-${activeIdx}`}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.05] animate-[fadeUp_0.5s_ease] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
          >
            {rest} <span className="text-xq-accent">{accent}</span>
          </h1>
          {current?.subtitle && (
            <p
              key={`sub-${activeIdx}`}
              className="text-base sm:text-lg md:text-xl text-white/75 max-w-2xl mb-10 leading-relaxed animate-[fadeUp_0.6s_ease] drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
            >
              {current.subtitle}
            </p>
          )}
          <div
            key={`cta-${activeIdx}`}
            className="flex flex-wrap gap-4 animate-[fadeUp_0.7s_ease]"
          >
            {current?.primaryCtaLabel && current?.primaryCtaUrl && (
              <Link
                href={current.primaryCtaUrl}
                target={current.primaryCtaUrl.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="xq-btn-primary text-base px-8 py-4"
              >
                {current.primaryCtaLabel}
              </Link>
            )}
            {current?.secondaryCtaLabel && current?.secondaryCtaUrl && (
              <Link
                href={current.secondaryCtaUrl}
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white font-semibold text-base rounded transition-all hover:border-xq-accent hover:text-xq-accent backdrop-blur-sm"
              >
                {current.secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation — only if more than 1 slide ──────────────────────────── */}
      {count > 1 && (
        <>
          {/* Arrow buttons */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/20 text-white hover:bg-black/70 hover:border-xq-accent/60 transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/20 text-white hover:bg-black/70 hover:border-xq-accent/60 transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => dot(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIdx
                    ? 'w-8 h-2 bg-xq-accent'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Single-slide dot (just a visual indicator, not interactive) */}
      {count === 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
          <div className="w-8 h-2 rounded-full bg-xq-accent" />
        </div>
      )}
    </section>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePageClient({ initialData, services, clients, featured, serverURL }: Props) {
  const { data: hp } = useLivePreview<HomepageGlobal>({
    initialData,
    serverURL: typeof window !== 'undefined'
      ? (window !== window.parent && document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin)
      : serverURL,
    depth: 2,
  })

  const heroMode  = (hp.hero?.mode ?? 'slideshow') as 'slideshow' | 'video'
  const videoUrl  = hp.hero?.videoUrl ?? ''
  const rawSlides = (hp.hero?.slides ?? []) as HeroSlide[]
  // Filter out placeholder slides that have no heading (e.g. auto-created empty rows)
  const validSlides = rawSlides.filter((s) => s.title && s.title.trim() !== '')
  const slides      = validSlides.length > 0 ? validSlides : FB_SLIDES

  const stats  = hp.stats && hp.stats.length > 0 ? hp.stats : FB_STATS
  const cta    = hp.cta ?? {}

  const ctaHeadline = cta.headline    ?? 'Looking for a long-term art partner?'
  const ctaSubtitle = cta.subtitle    ?? 'We might be the right fit.'
  const ctaBtnLabel = cta.buttonLabel ?? 'Start a Conversation'
  const ctaBtnUrl   = cta.buttonUrl   ?? '/contact'

  const clientList: ClientItem[] = clients.length > 0
    ? clients
    : [
        { id: 'bmw',       name: 'BMW' },
        { id: 'indg',      name: 'INDG' },
        { id: 'flightsim', name: 'FlightSim Studio' },
        { id: 'fresh-tv',  name: 'Fresh TV' },
        { id: 'cyberfox',  name: 'Cyberfox' },
        { id: 'c3d',       name: 'C3D' },
        { id: 'barney',    name: 'Barney Studio' },
      ]

  return (
    <>
      {/* ── Cinematic Hero ───────────────────────────────────── */}
      <CinematicHero mode={heroMode} videoUrl={videoUrl} slides={slides} />

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="border-y border-xq-border bg-xq-surface">
        <div className="xq-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 100}>
                <StatCounter value={stat.value} label={stat.label} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client strip ─────────────────────────────────────── */}
      <section className="border-b border-xq-border bg-xq-bg">
        <div className="xq-container py-10">
          <ScrollReveal>
            <p className="text-center text-xs text-xq-muted tracking-widest uppercase mb-8">
              Trusted by studios worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {clientList.map((client) => (
                <div key={String(client.id)} className="opacity-50 hover:opacity-90 transition-opacity duration-200 grayscale hover:grayscale-0">
                  {client.logo?.url ? (
                    <Image
                      src={client.logo.url}
                      alt={client.logo.alt || client.name}
                      width={120}
                      height={48}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-xq-muted font-semibold text-sm tracking-wide">{client.name}</span>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Featured Work ─────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="xq-section border-b border-xq-border">
          <div className="xq-container">
            <ScrollReveal className="flex items-end justify-between mb-12">
              <div>
                <div className="xq-label mb-4">Featured Work</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
                  Built for production pipelines
                </h2>
              </div>
              <Link href="/portfolio" className="xq-btn-ghost text-sm hidden md:flex shrink-0 ml-8">
                View All Work →
              </Link>
            </ScrollReveal>
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
            <ScrollReveal className="mb-16">
              <div className="xq-label mb-4">What We Do</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
                Production-grade art at scale
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, i) => (
                <ScrollReveal key={String(service.id)} delay={i * 100}>
                <div className={`xq-card ${service.image?.url ? 'p-0 overflow-hidden' : ''}`}>
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
                </ScrollReveal>
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
          <ScrollReveal className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">
              {ctaHeadline}
            </h2>
            <p className="text-xq-muted text-lg mb-10">{ctaSubtitle}</p>
            <Link href={ctaBtnUrl} className="xq-btn-primary text-base px-8 py-4">
              {ctaBtnLabel}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
