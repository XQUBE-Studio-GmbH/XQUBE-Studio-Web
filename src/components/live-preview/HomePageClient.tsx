'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLivePreview } from '@payloadcms/live-preview-react'
import StatCounter from '@/components/StatCounter'
import ScrollReveal from '@/components/ScrollReveal'
import { getLivePreviewServerURL } from '@/lib/livePreview'
import type {
  HeroSlide, Stat, ServiceItem, ClientItem, PortfolioItem, BlogPost,
  HomepageGlobal, EngineBadge, ProcessStep, Testimonial,
} from '@/types/cms'

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FB_SLIDES: HeroSlide[] = [
  {
    eyebrow:           'Vienna · Dubai · Dhaka',
    title:             'Where Art Meets Precision',
    subtitle:          'XQUBE Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
    primaryCtaLabel:   'Book a Call',
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

const FB_PROCESS_STEPS: ProcessStep[] = [
  { icon: '📋', title: 'Brief & Scope',     description: 'You share references, specs, and deadline. We ask the right questions and confirm scope in writing.' },
  { icon: '🎨', title: 'Concepting',         description: 'Our artists produce blockouts, style references, and approval sketches before committing to production.' },
  { icon: '⚙️', title: 'Production',         description: 'High-poly sculpt → retopo → UV → bake → texture → rig. Weekly progress updates throughout.' },
  { icon: '✅', title: 'Delivery & Handoff', description: 'Final assets in your target format, optimised for your engine. Full IP transfer on completion.' },
]

const FB_ENGINE_BADGES: EngineBadge[] = [
  { tool: { id: 'fb-1', name: 'Unreal Engine 5' } },
  { tool: { id: 'fb-2', name: 'Unity' } },
  { tool: { id: 'fb-3', name: 'UEFN' } },
  { tool: { id: 'fb-4', name: 'Roblox' } },
  { tool: { id: 'fb-5', name: 'Blender' } },
  { tool: { id: 'fb-6', name: 'Maya' } },
  { tool: { id: 'fb-7', name: 'ZBrush' } },
  { tool: { id: 'fb-8', name: 'Substance Painter' } },
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
  blogPosts:   BlogPost[]
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
  const [animSeed,   setAnimSeed]   = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Don't load the hero video on mobile — a 3–4 MB webm on a small screen
  // kills LCP and wastes mobile data. Only enable after mount so SSR output
  // is consistent (avoids hydration mismatch).
  const [showVideo, setShowVideo] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setShowVideo(true)
    }
  }, [])

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

  // On the very first paint (animSeed === 0) skip the fade-up animation so the
  // h1 is immediately visible. This is the LCP element — starting at opacity:0
  // and waiting for the CSS + 0.5s animation was causing a ~2.5s LCP delay.
  // Subsequent slide changes (animSeed > 0) still animate in normally.
  const isFirstPaint = animSeed === 0

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Backgrounds ─────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#060e08] to-[#0a1f13]" />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {mode === 'video' && videoUrl && showVideo && (
        // Only rendered on desktop (≥768px) — see showVideo state above.
        // autoPlay would cause mobile browsers to buffer the full file
        // despite preload="none", wasting ~3.6 MB on small screens.
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay loop muted playsInline preload="none"
        />
      )}

      {mode === 'slideshow' && slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === activeIdx ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.image?.url && (
            <div
              key={i === activeIdx ? `kb-${animSeed}` : `static-${i}`}
              className={i === activeIdx ? 'absolute inset-0 animate-ken-burns' : 'absolute inset-0'}
            >
              <Image
                src={slide.image.url}
                alt={slide.image.alt || slide.title || 'XQUBE Studio'}
                fill sizes="100vw" className="object-cover"
                priority={i === 0}
              />
            </div>
          )}
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* ── Slide text ──────────────────────────────────────────────────────── */}
      <div className="xq-container relative z-10 w-full">
        <div className="max-w-3xl">
          {current?.eyebrow && (
            <div className={`xq-label mb-6 ${isFirstPaint ? '' : 'animate-[fadeIn_0.5s_ease]'}`} key={`eyebrow-${activeIdx}`}>
              {current.eyebrow}
            </div>
          )}
          <h1
            key={`title-${activeIdx}`}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] ${isFirstPaint ? '' : 'animate-[fadeUp_0.5s_ease]'}`}
          >
            {rest} <span className="text-xq-accent">{accent}</span>
          </h1>
          {current?.subtitle && (
            <p
              key={`sub-${activeIdx}`}
              className={`text-base sm:text-lg md:text-xl text-white/75 max-w-2xl mb-10 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] ${isFirstPaint ? '' : 'animate-[fadeUp_0.6s_ease]'}`}
            >
              {current.subtitle}
            </p>
          )}
          <div key={`cta-${activeIdx}`} className={`flex flex-wrap gap-4 ${isFirstPaint ? '' : 'animate-[fadeUp_0.7s_ease]'}`}>
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
          <button onClick={prev} aria-label="Previous slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/20 text-white hover:bg-black/70 hover:border-xq-accent/60 transition-all backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next} aria-label="Next slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/20 text-white hover:bg-black/70 hover:border-xq-accent/60 transition-all backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => dot(i)} aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === activeIdx ? 'w-8 h-2 bg-xq-accent' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>
        </>
      )}
      {count === 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
          <div className="w-8 h-2 rounded-full bg-xq-accent" />
        </div>
      )}
    </section>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePageClient({ initialData, services, clients, featured, blogPosts, serverURL }: Props) {
  // Detect whether we are inside the Payload admin live-preview iframe.
  // When viewing the public page directly, we always use the server-fetched
  // initialData (fully-populated relationships including image URLs).
  // When inside the admin iframe, we switch to livePreviewData so content
  // updates appear instantly as the editor types.
  //
  // Why: useLivePreview sends a ready postMessage on mount. If the admin is
  // open in another tab it responds with draft data where relationships are
  // bare IDs (not populated objects). That would set slide.image.url to
  // undefined, causing the hero image to disappear on the public page.
  const [isInIframe, setIsInIframe] = useState(false)
  useEffect(() => {
    setIsInIframe(window !== window.parent)
  }, [])

  const { data: livePreviewData } = useLivePreview<HomepageGlobal>({
    initialData,
    serverURL: getLivePreviewServerURL(serverURL),
    depth: 2,
  })

  const hp = isInIframe ? livePreviewData : initialData

  // ── Showreel mute state ────────────────────────────────────────────────────
  const showreelRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  const toggleMute = () => {
    const video = showreelRef.current
    if (!video) return
    if (isMuted) {
      video.currentTime = 0
      video.muted = false
      video.play().catch(() => { video.muted = true; setIsMuted(true) })
    } else {
      video.muted = true
    }
    setIsMuted((m) => !m)
  }

  // ── Data ──────────────────────────────────────────────────────────────────
  const heroMode   = (hp.hero?.mode ?? 'slideshow') as 'slideshow' | 'video'
  const videoUrl   = hp.hero?.videoUrl ?? ''
  const rawSlides  = (hp.hero?.slides ?? []) as HeroSlide[]
  const validSlides = rawSlides.filter((s) => s.title && s.title.trim() !== '')
  const slides      = validSlides.length > 0 ? validSlides : FB_SLIDES

  const stats = hp.stats && hp.stats.length > 0 ? hp.stats : FB_STATS
  const cta   = hp.cta ?? {}

  const ctaHeadline = cta.headline    ?? 'Looking for a long-term art partner?'
  const ctaSubtitle = cta.subtitle    ?? 'We might be the right fit.'
  const ctaBtnLabel = cta.buttonLabel ?? 'Start a Conversation'
  const ctaBtnUrl   = cta.buttonUrl   ?? '/contact'

  // Section visibility — default all content sections to true so they show
  // before the admin has explicitly configured the global.
  const show = {
    studioIntro:  hp.sections?.showStudioIntro  ?? true,
    engineBadges: hp.sections?.showEngineBadges ?? true,
    featuredWork: hp.sections?.showFeaturedWork ?? true,
    services:     hp.sections?.showServices     ?? true,
    process:      hp.sections?.showProcess      ?? true,
    showreel:          hp.sections?.showShowreel          ?? false,
    engagementModels:  hp.sections?.showEngagementModels  ?? true,
    testimonials:      hp.sections?.showTestimonials      ?? false,
    blogPreview:       hp.sections?.showBlogPreview       ?? false,
  }

  // Studio intro
  const si = hp.studioIntro ?? {}

  // Engine badges
  const engineBadgeList: EngineBadge[] =
    hp.engineBadges && hp.engineBadges.length > 0
      ? hp.engineBadges as EngineBadge[]
      : FB_ENGINE_BADGES

  // Process
  const processLabel   = hp.process?.label   ?? 'How We Work'
  const processHeading = hp.process?.heading ?? 'From brief to delivery — every time.'
  const processSteps: ProcessStep[] =
    hp.process?.steps && hp.process.steps.length > 0
      ? hp.process.steps as ProcessStep[]
      : FB_PROCESS_STEPS

  // Showreel
  const showreel = hp.showreel ?? {}

  // Testimonials
  const testimonialLabel   = hp.testimonials?.label   ?? 'Client Voices'
  const testimonialHeading = hp.testimonials?.heading ?? 'Trusted by studios that ship.'
  const testimonialItems: Testimonial[] = (hp.testimonials?.items ?? []) as Testimonial[]

  // Blog preview
  const blogLabel   = hp.blogPreview?.label   ?? 'From the Studio'
  const blogHeading = hp.blogPreview?.heading ?? 'Latest insights.'

  // Clients
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
      {/* ── 1. Cinematic Hero (always visible) ───────────────────────────────── */}
      <CinematicHero mode={heroMode} videoUrl={videoUrl} slides={slides} />

      {/* ── 2. Stats Bar (always visible) ────────────────────────────────────── */}
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

      {/* ── 3. Client Logo Strip (always visible) ────────────────────────────── */}
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
                      src={client.logo.url} alt={client.logo.alt || client.name}
                      width={180} height={72} className="h-14 w-auto object-contain"
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

      {/* ── 4. Studio Intro ──────────────────────────────────────────────────── */}
      {show.studioIntro && (
        <section className="xq-section border-b border-xq-border">
          <div className="xq-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal>
                <div className="xq-label mb-4">{si.label || 'Who We Are'}</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6 leading-tight">
                  {si.heading || 'Built for precision. Scaled for production.'}
                </h2>
                {si.body1 && <p className="text-xq-muted leading-relaxed mb-4">{si.body1}</p>}
                {si.body2 && <p className="text-xq-muted leading-relaxed mb-8">{si.body2}</p>}
                <Link href={si.linkUrl || '/about'} className="xq-btn-ghost inline-flex">
                  {si.linkLabel || 'Learn more about us'} →
                </Link>
              </ScrollReveal>
              {si.image?.url && (
                <ScrollReveal delay={200}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-xq-border">
                    <Image
                      src={si.image.url} alt={si.image.alt || 'XQUBE Studio'}
                      fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Engine / Tech Badges ──────────────────────────────────────────── */}
      {show.engineBadges && engineBadgeList.length > 0 && (
        <section className="border-b border-xq-border bg-xq-surface">
          <div className="xq-container py-14">
            <ScrollReveal className="text-center mb-8">
              <p className="xq-label">Our Tech Stack</p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="flex flex-wrap justify-center gap-3">
                {engineBadgeList.map((badge, i) => badge.tool ? (
                  <div
                    key={String(badge.id || badge.tool.id || i)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-xq-border bg-xq-bg text-xq-muted hover:border-xq-accent hover:text-white transition-all duration-200 text-sm font-medium cursor-default"
                  >
                    {badge.tool.logo?.url && (
                      <Image
                        src={badge.tool.logo.url} alt={badge.tool.name}
                        width={20} height={20}
                        className="w-5 h-5 object-contain opacity-70"
                      />
                    )}
                    {badge.tool.name}
                  </div>
                ) : null)}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── 6. Featured Work ─────────────────────────────────────────────────── */}
      {show.featuredWork && featured.length > 0 && (
        <section className="xq-section border-b border-xq-border">
          <div className="xq-container">
            <ScrollReveal className="flex items-end justify-between mb-12">
              <div>
                <div className="xq-label mb-4">
                  {hp.featuredWork?.label ?? 'Featured Work'}
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
                  {hp.featuredWork?.heading ?? 'Built for production pipelines'}
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
                        sizes={i === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
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

      {/* ── 7. Services ──────────────────────────────────────────────────────── */}
      {show.services && services.length > 0 && (
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
                      <div className="relative h-44">
                        <Image src={service.image.url} alt={service.image.alt || service.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
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

      {/* ── 8. Process / How We Work ─────────────────────────────────────────── */}
      {show.process && processSteps.length > 0 && (
        <section className="xq-section border-b border-xq-border bg-xq-surface">
          <div className="xq-container">
            <ScrollReveal className="mb-16">
              <div className="xq-label mb-4">{processLabel}</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
                {processHeading}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <ScrollReveal key={step.id || i} delay={i * 100}>
                  <div className="xq-card h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">{step.icon || ''}</span>
                      <span className="text-xq-accent text-xs font-bold uppercase tracking-widest">
                        Step {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-xq-muted text-sm leading-relaxed flex-1">{step.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. Engagement Models ─────────────────────────────────────────────── */}
      {show.engagementModels && (
      <section className="xq-section border-b border-xq-border bg-xq-bg">
        <div className="xq-container">
          <ScrollReveal className="mb-16">
            <div className="xq-label mb-4">How We Engage</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
              One studio, three ways to work together.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon:        '📋',
                title:       'Project-Based',
                description: 'Fixed scope, fixed delivery. You brief us, we produce and deliver. Ideal for defined asset lists and milestone-based productions.',
                bestFor:     'Defined pipelines & one-off productions',
              },
              {
                icon:        '🔄',
                title:       'Monthly Retainer',
                description: 'Dedicated monthly capacity. Flexible scope, consistent output, and priority access to the team.',
                bestFor:     'Ongoing studios with regular output needs',
              },
              {
                icon:        '🤝',
                title:       'Embedded Team',
                description: 'Our artists in your pipeline. Your tools, your standups, your naming conventions. Scale up or down per sprint.',
                bestFor:     'Studios that need long-term scale',
              },
            ].map((model, i) => (
              <ScrollReveal key={model.title} delay={i * 100}>
                <div className="xq-card h-full flex flex-col">
                  <div className="text-3xl mb-5">{model.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{model.title}</h3>
                  <p className="text-xq-muted text-sm leading-relaxed flex-1">{model.description}</p>
                  <div className="mt-6 pt-5 border-t border-xq-border">
                    <p className="text-xs text-xq-muted uppercase tracking-widest">Best for</p>
                    <p className="text-xq-accent text-sm font-medium mt-1">{model.bestFor}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/contact" className="xq-btn-ghost">Discuss Your Project →</Link>
          </div>
        </div>
      </section>
      )}

      {/* ── 10. Showreel ─────────────────────────────────────────────────────── */}
      {show.showreel && showreel.video?.url && (
        <section className="border-b border-xq-border bg-black">
          <div className="xq-container py-20">
            <ScrollReveal className="text-center mb-10">
              {showreel.label && (
                <div className="xq-label mb-4">{showreel.label}</div>
              )}
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white">
                {showreel.heading || 'See the work in motion.'}
              </h2>
              {showreel.tagline && (
                <p className="text-xq-muted mt-3 text-lg max-w-xl mx-auto">{showreel.tagline}</p>
              )}
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="relative rounded-xl overflow-hidden aspect-video max-w-5xl mx-auto border border-xq-border/40">
                <video
                  ref={showreelRef}
                  src={showreel.video.url}
                  autoPlay loop muted={isMuted} playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={toggleMute}
                  className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/20 text-white text-sm font-medium backdrop-blur-sm hover:bg-black/80 hover:border-xq-accent/60 transition-all duration-200"
                >
                  {isMuted
                    ? <><span>🔇</span> Unmute</>
                    : <><span>🔊</span> Mute</>
                  }
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── 11. Testimonials ─────────────────────────────────────────────────── */}
      {show.testimonials && testimonialItems.length > 0 && (
        <section className="xq-section border-b border-xq-border">
          <div className="xq-container">
            <ScrollReveal className="mb-12">
              <div className="xq-label mb-4">{testimonialLabel}</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
                {testimonialHeading}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonialItems.map((t, i) => (
                <ScrollReveal key={t.id || i} delay={i * 100}>
                  <div className="xq-card h-full flex flex-col">
                    <div className="text-xq-accent text-4xl leading-none mb-4 font-serif">&ldquo;</div>
                    <p className="text-xq-muted leading-relaxed flex-1 mb-6 italic text-sm">{t.quote}</p>
                    <div className="flex items-center gap-3 pt-5 border-t border-xq-border">
                      {t.avatar?.url && (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-xq-border">
                          <Image src={t.avatar.url} alt={t.name} fill sizes="40px" className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        {t.role && <p className="text-xq-muted text-xs mt-0.5">{t.role}</p>}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 12. Blog Preview ─────────────────────────────────────────────────── */}
      {show.blogPreview && blogPosts.length > 0 && (
        <section className="xq-section border-b border-xq-border bg-xq-surface">
          <div className="xq-container">
            <ScrollReveal className="flex items-end justify-between mb-12">
              <div>
                <div className="xq-label mb-4">{blogLabel}</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white max-w-xl">
                  {blogHeading}
                </h2>
              </div>
              <Link href="/blog" className="xq-btn-ghost text-sm hidden md:flex shrink-0 ml-8">
                All Articles →
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 100}>
                  <Link href={`/blog/${post.slug}`} className="group block xq-card p-0 overflow-hidden h-full flex flex-col">
                    {post.coverImage?.url && (
                      <div className="relative aspect-video overflow-hidden shrink-0">
                        <Image
                          src={post.coverImage.url} alt={post.coverImage.alt || post.title} fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {post.createdAt && (
                        <p className="text-xq-muted text-xs mb-2">
                          {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                      <h3 className="text-white font-bold mb-2 group-hover:text-xq-accent transition-colors leading-snug flex-1">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xq-muted text-sm leading-relaxed line-clamp-3 mt-2">{post.excerpt}</p>
                      )}
                      <p className="text-xq-accent text-xs font-semibold mt-4 group-hover:underline">Read article →</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/blog" className="xq-btn-ghost">All Articles →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 13. Bottom CTA (always visible) ──────────────────────────────────── */}
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
