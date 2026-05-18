'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { useParallaxOffset } from '@/lib/useParallaxOffset'
import ScrollReveal from '@/components/ScrollReveal'

// ─── Types (mirrors services/page.tsx) ───────────────────────────────────────

interface MediaRef { url?: string; alt?: string }

interface ServiceItem {
  id: string | number; title: string; shortDescription?: string
  icon?: string; features?: { id: string; feature: string }[]
  platforms?: string; image?: MediaRef | null
}

interface PipelineStep { id?: string; step: string }
interface Pipeline {
  id?: string; title: string; subtitle?: string; description?: string
  steps?: (PipelineStep | string)[]; toolsUsed?: string
  image?: MediaRef | null; imageLabel?: string
}

interface ServicesPageGlobal {
  hero?: { label?: string; heading?: string; subtitle?: string; image?: MediaRef | null }
  cta?:  { heading?: string; subtitle?: string; buttonLabel?: string; buttonUrl?: string }
  pipelines?: Pipeline[]
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FB_PAGE = {
  heroLabel:    'What We Offer',
  heroHeading:  'Production-grade services for serious studios',
  heroSubtitle: 'From a single asset to a fully embedded team — we scale to your needs.',
  ctaHeading:   'Looking for a long-term art partner?',
  ctaSubtitle:  'We might be the right fit.',
  ctaBtnLabel:  'Start a Conversation',
  ctaBtnUrl:    '/contact',
}

const FB_PIPELINES: Pipeline[] = [
  { title: 'Hero Asset Production', subtitle: 'High → Low Poly', description: 'Ideal for hero characters, weapons, and realistic production assets.', steps: ['Concepting and blocking base forms','Refine structure with detail blocking','Create high poly (sculpt / hard surface)','Convert to optimized low poly','UV unwrap','Bake high → low maps (Normal, AO etc.)','Feedback resolution'], toolsUsed: 'Blender · ZBrush · Maya · 3ds Max · Marmoset · Substance 3D Painter', image: null, imageLabel: 'Hero asset render — upload via Services Page in admin panel' },
  { title: 'Texturing & Baking', subtitle: 'PBR Workflow', description: 'Three texturing approaches depending on asset type and production requirements.', steps: ['Gather reference and plan surface detail','Apply base PBR material details','Add large / medium / small surface details','Add weathering, usage, and damage details','Refine roughness and surface properties','Final color calibration','Export optimized PBR texture set'], toolsUsed: 'Substance 3D Painter · Marmoset Toolbag · RizomUV', image: null, imageLabel: 'Texturing showcase — upload via Services Page in admin panel' },
  { title: 'Retopology & Optimization', subtitle: 'Clean Topology Pipeline', description: 'Ensures clean, engine-ready topology for high-quality and performance-optimized assets.', steps: ['Perform auto / procedural remesh','Manual retopology for critical assets','Fix topology flow and shading issues','UV unwrap','Bake maps — Normal, AO etc.','Feedback resolution'], toolsUsed: 'Blender · ZBrush · Maya · Topogun · Marmoset · Substance 3D Painter', image: null, imageLabel: 'Retopology showcase — upload via Services Page in admin panel' },
  { title: 'Environment Design', subtitle: 'Game Engine Workflow', description: 'Full environment pipeline from blockout to optimized, lit, and polished game-ready scene.', steps: ['Define goals, constraints and gather references','Environment blocking and gameplay validation','Import final assets and textures','Set dressing and staging','Materials, lighting, probes and post-processing','Performance profiling and optimization','Iterate, polish, build and test'], toolsUsed: 'Unreal Engine 5 · Unity · Megascans · Marmoset', image: null, imageLabel: 'Environment render — upload via Services Page in admin panel' },
]

const tools = [
  { category: '3D Modelling',        items: '3ds Max · Blender · Maya' },
  { category: 'Sculpting',           items: 'ZBrush' },
  { category: 'Retopology',          items: 'Blender · ZBrush · Topogun' },
  { category: 'UV & Unwrapping',     items: 'RizomUV · Maya · Blender' },
  { category: 'Texturing',           items: 'Substance 3D Painter · Marmoset Toolbag' },
  { category: 'Photogrammetry',      items: 'RealityCapture · Agisoft Metashape' },
  { category: 'Rigging & Animation', items: 'Blender · Mixamo · Character Creator' },
  { category: 'Game Engines',        items: 'Unreal Engine 5 · Unity · UEFN · Roblox Studio' },
  { category: 'Rendering',           items: 'Marmoset Toolbag · Megascans' },
  { category: 'Concepting',          items: 'PureRef · Midjourney · Gemini' },
  { category: 'Generative 3D',       items: 'Meshy AI · Tripo 3D · ComfyUI' },
  { category: 'Version Control',     items: 'Perforce · Git LFS' },
  { category: 'Project Management',  items: 'Jira · Asana · Trello · Slack' },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialData: ServicesPageGlobal
  services:    ServiceItem[]
  serverURL:   string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ServicesPageClient({ initialData, services, serverURL }: Props) {
  const heroRef        = useRef<HTMLElement>(null)
  const parallaxOffset = useParallaxOffset(heroRef)

  const { data: sp } = useLivePreview<ServicesPageGlobal>({
    initialData,
    serverURL: typeof window !== 'undefined'
      ? (window !== window.parent && document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin)
      : serverURL,
    depth: 2,
  })

  const heroLabel    = sp.hero?.label    ?? FB_PAGE.heroLabel
  const heroHeading  = sp.hero?.heading  ?? FB_PAGE.heroHeading
  const heroSubtitle = sp.hero?.subtitle ?? FB_PAGE.heroSubtitle
  const heroImage    = sp.hero?.image as MediaRef | null | undefined
  const ctaHeading   = sp.cta?.heading     ?? FB_PAGE.ctaHeading
  const ctaSubtitle  = sp.cta?.subtitle    ?? FB_PAGE.ctaSubtitle
  const ctaBtnLabel  = sp.cta?.buttonLabel ?? FB_PAGE.ctaBtnLabel
  const ctaBtnUrl    = sp.cta?.buttonUrl   ?? FB_PAGE.ctaBtnUrl
  const activePipelines = (sp.pipelines && sp.pipelines.length > 0) ? sp.pipelines as Pipeline[] : FB_PIPELINES

  return (
    <>
      {/* Hero Banner */}
      <section ref={heroRef} className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#060e08] to-[#0a1f13]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {heroImage?.url && (
          <div className="absolute inset-0" style={{ transform: `scale(1.12) translateY(${parallaxOffset}px)`, willChange: 'transform' }}>
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
              <p className="text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">{heroSubtitle}</p>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-xq-border pb-24">
        <div className="xq-container space-y-8 mt-12">
          {services.map((service, i) => (
            <ScrollReveal key={String(service.id)} delay={i * 80}>
            <div className={`xq-card ${service.image?.url ? 'p-0 overflow-hidden' : 'p-5 sm:p-6 md:p-8'}`}>
              {service.image?.url && (
                <div className="relative aspect-video">
                  <Image src={service.image.url} alt={service.image.alt || service.title} fill className="object-cover" />
                </div>
              )}
              <div className={service.image?.url ? 'p-5 sm:p-6 md:p-8' : ''}>
                <div className="flex items-start gap-3 mb-3">
                  {service.icon && <span className="text-2xl shrink-0">{service.icon}</span>}
                  <h2 className="text-2xl font-black text-white">{service.title}</h2>
                </div>
                {service.shortDescription && (
                  <p className="text-xq-muted leading-relaxed mb-6 max-w-2xl">{service.shortDescription}</p>
                )}
                {service.features && service.features.length > 0 && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {service.features.map((f) => (
                      <li key={f.id} className="flex items-start gap-2 text-sm text-xq-muted">
                        <span className="text-xq-accent mt-0.5 shrink-0">→</span> {f.feature}
                      </li>
                    ))}
                  </ul>
                )}
                {service.platforms && (
                  <div className="text-xs text-xq-muted border-t border-xq-border pt-4">
                    <span className="text-xq-accent font-semibold">Platforms & Engines: </span>
                    {service.platforms}
                  </div>
                )}
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <ScrollReveal className="mb-12">
            <div className="xq-label mb-4">Our Stack</div>
            <h2 className="text-3xl font-black text-white">Tools & Technology</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map((tool, i) => (
              <ScrollReveal key={tool.category} delay={i * 40}>
              <div className="flex gap-4 p-4 border border-xq-border rounded-lg bg-xq-card">
                <div className="w-1 bg-xq-accent rounded-full shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{tool.category}</div>
                  <div className="text-xq-muted text-xs leading-relaxed">{tool.items}</div>
                </div>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Production Pipeline */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container">
          <ScrollReveal className="mb-12">
            <div className="xq-label mb-4">How We Work</div>
            <h2 className="text-3xl font-black text-white mb-4">Production Pipeline</h2>
            <p className="text-xq-muted max-w-2xl leading-relaxed">
              Standardized workflows built for quality and consistency across every project.
              Full pipeline documentation available on request.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activePipelines.map((pipeline, pi) => (
              <ScrollReveal key={pipeline.id ?? pi} delay={pi * 100}>
              <div className="xq-card p-0 overflow-hidden">
                <div className="aspect-video bg-xq-surface border-b border-xq-border flex items-center justify-center relative">
                  {pipeline.image?.url ? (
                    <Image src={pipeline.image.url} alt={pipeline.image.alt || pipeline.title} fill className="object-cover" />
                  ) : (
                    <div className="text-center px-6">
                      <div className="text-xq-accent text-xs font-semibold mb-1 tracking-widest uppercase">Portfolio Asset</div>
                      <div className="text-xq-muted text-xs">{pipeline.imageLabel ?? 'Upload an image via the Services Page in the admin panel'}</div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-white font-black text-lg">{pipeline.title}</h3>
                    {pipeline.subtitle && <div className="text-xq-accent text-xs font-semibold tracking-wide mt-0.5">{pipeline.subtitle}</div>}
                  </div>
                  {pipeline.description && <p className="text-xq-muted text-sm mb-4 leading-relaxed">{pipeline.description}</p>}
                  {pipeline.steps && pipeline.steps.length > 0 && (
                    <ol className="space-y-1.5 mb-5">
                      {pipeline.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-xq-muted">
                          <span className="text-xq-accent font-bold shrink-0 w-4">{i + 1}.</span>
                          {typeof step === 'string' ? step : step.step}
                        </li>
                      ))}
                    </ol>
                  )}
                  {pipeline.toolsUsed && (
                    <div className="text-xs text-xq-muted border-t border-xq-border pt-4">
                      <span className="text-xq-accent font-semibold">Tools: </span>
                      {pipeline.toolsUsed}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement CTA */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <ScrollReveal className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{ctaHeading}</h2>
            <p className="text-xq-muted text-lg mb-10">{ctaSubtitle}</p>
            <Link href={ctaBtnUrl} className="xq-btn-primary text-base px-8 py-4">{ctaBtnLabel}</Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
