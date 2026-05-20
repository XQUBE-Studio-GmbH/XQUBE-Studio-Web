'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import ScrollReveal from '@/components/ScrollReveal'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'
import { getLivePreviewServerURL } from '@/lib/livePreview'
import type { ServicesPageGlobal, ServiceItem, Pipeline, MediaRef } from '@/types/cms'

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

// ─── Pipeline grouping ────────────────────────────────────────────────────────

interface PipelineGroup { label: string; order: number; items: Pipeline[] }

function buildGroups(pipelines: Pipeline[]): PipelineGroup[] {
  // Sort by categoryOrder first (nulls last), then by original array position
  const ordered = pipelines
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      const oa = a.p.categoryOrder ?? 9999
      const ob = b.p.categoryOrder ?? 9999
      return oa !== ob ? oa - ob : a.i - b.i
    })
    .map(({ p }) => p)

  const groups: PipelineGroup[] = []
  const index = new Map<string, number>()

  for (const p of ordered) {
    const label = p.categoryLabel?.trim() || ''
    const key   = label || '__uncategorized__'
    const display = label || 'Uncategorized'
    if (!index.has(key)) {
      index.set(key, groups.length)
      groups.push({ label: display, order: p.categoryOrder ?? 9999, items: [] })
    }
    groups[index.get(key)!].items.push(p)
  }

  return groups
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialData: ServicesPageGlobal
  services:    ServiceItem[]
  serverURL:   string
}

// ─── Pipeline Card ────────────────────────────────────────────────────────────

function PipelineCard({ pipeline, index }: { pipeline: Pipeline; index: number }) {
  return (
    <ScrollReveal delay={index * 80}>
      <div className="xq-card h-full flex flex-col">
        {/* Optional image — only shown if one is uploaded */}
        {pipeline.image?.url && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-5 border border-xq-border">
            <Image src={pipeline.image.url} alt={pipeline.image.alt || pipeline.title} fill className="object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="mb-3">
          <h3 className="text-white font-black text-base leading-snug">{pipeline.title}</h3>
          {pipeline.subtitle && (
            <div className="text-xq-accent text-xs font-semibold tracking-wide mt-1">{pipeline.subtitle}</div>
          )}
        </div>

        {/* Description */}
        {pipeline.description && (
          <p className="text-xq-muted text-sm leading-relaxed mb-4">{pipeline.description}</p>
        )}

        {/* Steps */}
        {pipeline.steps && pipeline.steps.length > 0 && (
          <ol className="space-y-1.5 mb-5 flex-1">
            {pipeline.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-xq-muted">
                <span className="text-xq-accent font-bold shrink-0 w-4 text-xs mt-0.5">{i + 1}.</span>
                <span>{typeof step === 'string' ? step : step.step}</span>
              </li>
            ))}
          </ol>
        )}

        {/* Tools */}
        {pipeline.toolsUsed && (
          <div className="text-xs text-xq-muted border-t border-xq-border pt-3 mt-auto">
            <span className="text-xq-accent font-semibold">Tools: </span>
            {pipeline.toolsUsed}
          </div>
        )}
      </div>
    </ScrollReveal>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ServicesPageClient({ initialData, services, serverURL }: Props) {
  const [activeTab, setActiveTab] = useState(0)

  const { data: sp } = useLivePreview<ServicesPageGlobal>({
    initialData,
    serverURL: getLivePreviewServerURL(serverURL),
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
      <PageHero
        label={heroLabel}
        heading={heroHeading}
        subtitle={heroSubtitle}
        image={heroImage}
      />

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
          <SectionHeader label="Our Stack" heading="Tools & Technology" />
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
          <SectionHeader
            label="How We Work"
            heading="Production Pipeline"
            description="Standardized workflows built for quality and consistency across every project. Full pipeline documentation available on request."
          />

          {(() => {
            const groups = buildGroups(activePipelines)
            const useTabs = groups.length > 1

            return useTabs ? (
              <>
                {/* Tab bar */}
                <div className="flex gap-1 mb-10 overflow-x-auto pb-px border-b border-xq-border">
                  {groups.map((group, gi) => (
                    <button
                      key={group.label}
                      type="button"
                      onClick={() => setActiveTab(gi)}
                      className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors shrink-0 border-b-2 -mb-px ${
                        activeTab === gi
                          ? 'border-xq-accent text-xq-accent'
                          : 'border-transparent text-xq-muted hover:text-white'
                      }`}
                    >
                      {group.label}
                      <span className="ml-1.5 text-xs opacity-50">({group.items.length})</span>
                    </button>
                  ))}
                </div>

                {/* Cards for active tab */}
                {groups[activeTab] && (
                  <div className={`grid gap-6 ${
                    groups[activeTab].items.length === 1
                      ? 'grid-cols-1 max-w-xl'
                      : groups[activeTab].items.length === 2
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {groups[activeTab].items.map((pipeline, pi) => (
                      <PipelineCard key={pipeline.id ?? pi} pipeline={pipeline} index={pi} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* No categories yet — flat 2-column grid (original layout) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activePipelines.map((pipeline, pi) => (
                  <PipelineCard key={pipeline.id ?? pi} pipeline={pipeline} index={pi} />
                ))}
              </div>
            )
          })()}
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
