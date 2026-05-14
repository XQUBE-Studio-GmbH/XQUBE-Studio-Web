import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Game art production, VR game assets, interactive development for UEFN and Roblox, and staff augmentation for game studios worldwide.',
  openGraph: {
    title: 'Services | XQube Studio',
    description: 'Game Art · VR Assets · Interactive Dev · Staff Augmentation. Delivered to your pipeline.',
    url: 'https://www.xqubestudio.com/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | XQube Studio',
    description: 'Game Art · VR Assets · Interactive Dev · Staff Augmentation.',
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceItem {
  id: string | number
  title: string
  shortDescription?: string
  icon?: string
  features?: { id: string; feature: string }[]
  platforms?: string
}

// ─── Services fallback ───────────────────────────────────────────────────────

const FB_SERVICES: ServiceItem[] = [
  {
    id: 'game-art',
    title: 'Game Art Production',
    shortDescription: 'Full-spectrum 3D art production from a single hero asset to an entire game world. Delivered to your pipeline specifications, on time, at AAA quality.',
    features: [
      { id: '1', feature: 'Characters & Creatures — heroes, NPCs, enemies, rig-ready' },
      { id: '2', feature: 'Weapons — firearms, melee, sci-fi, PBR textured' },
      { id: '3', feature: 'Vehicles — ground, air, sci-fi variants' },
      { id: '4', feature: 'Environments — modular level art, biomes, interior sets' },
      { id: '5', feature: 'Props & Items — environmental props, interactive objects' },
      { id: '6', feature: 'UI/UX & 2D — HUDs, menus, key art, marketing assets' },
    ],
    platforms: 'Unreal Engine 5 · Unity · UEFN · Roblox · Meta Quest · PSVR2',
  },
  {
    id: 'vr-assets',
    title: 'VR Game Assets',
    shortDescription: 'Production-ready VR assets and immersive game environments built for performance. We understand the constraints of real-time VR and design to them.',
    features: [
      { id: '1', feature: 'High-fidelity VR character and prop assets' },
      { id: '2', feature: 'Immersive VR environment design' },
      { id: '3', feature: 'Optimized for Meta Quest, HTC Vive, PlayStation VR' },
      { id: '4', feature: 'LOD chains and draw call budgets built in' },
      { id: '5', feature: 'Interaction-ready asset preparation' },
      { id: '6', feature: 'VR game environment lighting and post-processing' },
    ],
    platforms: 'Meta Quest · HTC Vive · PSVR2 · 6DoF ready · OpenXR',
  },
  {
    id: 'interactive-dev',
    title: 'Interactive Development',
    shortDescription: "End-to-end development for UEFN islands, Roblox experiences, and VR games. We've shipped on all three platforms — including a live Fortnite island with Fresh TV.",
    features: [
      { id: '1', feature: 'UEFN island development — design, scripting, publish' },
      { id: '2', feature: 'Roblox Studio — Lua scripting, game systems, publish' },
      { id: '3', feature: 'VR game development — Unity (C#) and Unreal (Blueprint)' },
      { id: '4', feature: 'Complex VR application development' },
      { id: '5', feature: 'Performance optimization across all platforms' },
      { id: '6', feature: 'Post-launch support and iteration' },
    ],
    platforms: 'UEFN · Roblox Studio · Unity · Unreal Engine · Blueprint · C#',
  },
  {
    id: 'staff-aug',
    title: 'Staff Augmentation',
    shortDescription: 'Dedicated resources embedded directly in your team. Your tools, your pipeline, your standards — our people.',
    features: [
      { id: '1', feature: 'Resources onboard to your stack from day one' },
      { id: '2', feature: 'Sprint cycles, standups, review loops — your cadence' },
      { id: '3', feature: 'Naming conventions, file structures, poly budgets followed exactly' },
      { id: '4', feature: 'Direct access — no account managers, no middlemen' },
      { id: '5', feature: 'Scale up or down per milestone' },
      { id: '6', feature: 'EU-compliant IP ownership, GDPR-compliant data handling' },
    ],
    platforms: 'Any engine · Any platform · Any pipeline',
  },
]

// ─── Page copy types & fallbacks ─────────────────────────────────────────────

interface ServicesPageGlobal {
  hero?: { label?: string; heading?: string; subtitle?: string }
  cta?:  { heading?: string; subtitle?: string; buttonLabel?: string; buttonUrl?: string }
}

const FB_PAGE = {
  heroLabel:   'What We Offer',
  heroHeading: 'Production-grade services for serious studios',
  heroSubtitle: 'From a single asset to a fully embedded team — we scale to your needs.',
  ctaHeading:   'Looking for a long-term art partner?',
  ctaSubtitle:  'We might be the right fit.',
  ctaBtnLabel:  'Start a Conversation',
  ctaBtnUrl:    '/contact',
}

// ─── Data fetcher ────────────────────────────────────────────────────────────

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [servicesRes, sp] = await Promise.all([
      payload.find({ collection: 'services', sort: 'order', limit: 20, depth: 1 }),
      payload.findGlobal({ slug: 'services-page' }) as Promise<ServicesPageGlobal>,
    ])
    const docs = servicesRes.docs as unknown as ServiceItem[]
    return {
      services: docs.length > 0 ? docs : FB_SERVICES,
      sp,
    }
  } catch {
    return { services: FB_SERVICES, sp: {} as ServicesPageGlobal }
  }
}

// ─── Tools ───────────────────────────────────────────────────────────────────
const tools = [
  { category: '3D Modelling',         items: '3ds Max · Blender · Maya' },
  { category: 'Sculpting',            items: 'ZBrush' },
  { category: 'Retopology',           items: 'Blender · ZBrush · Topogun' },
  { category: 'UV & Unwrapping',      items: 'RizomUV · Maya · Blender' },
  { category: 'Texturing',            items: 'Substance 3D Painter · Marmoset Toolbag' },
  { category: 'Photogrammetry',       items: 'RealityCapture · Agisoft Metashape' },
  { category: 'Rigging & Animation',  items: 'Blender · Mixamo · Character Creator' },
  { category: 'Game Engines',         items: 'Unreal Engine 5 · Unity · UEFN · Roblox Studio' },
  { category: 'Rendering',            items: 'Marmoset Toolbag · Megascans' },
  { category: 'Concepting',           items: 'PureRef · Midjourney · Gemini' },
  { category: 'Generative 3D',        items: 'Meshy AI · Tripo 3D · ComfyUI' },
  { category: 'Version Control',      items: 'Perforce · Git LFS' },
  { category: 'Project Management',   items: 'Jira · Asana · Trello · Slack' },
]

// ─── Pipelines ───────────────────────────────────────────────────────────────
const pipelines = [
  {
    title: 'Hero Asset Production',
    subtitle: 'High → Low Poly',
    description: 'Ideal for hero characters, weapons, and realistic production assets.',
    steps: [
      'Concepting and blocking base forms',
      'Refine structure with detail blocking',
      'Create high poly (sculpt / hard surface)',
      'Convert to optimized low poly',
      'UV unwrap',
      'Bake high → low maps (Normal, AO etc.)',
      'Feedback resolution',
    ],
    toolsUsed: 'Blender · ZBrush · Maya · 3ds Max · Marmoset · Substance 3D Painter',
    // Replace with real image URL after uploading via admin panel
    // Suggested asset: Realtime 3D Sniper
    image: null,
    imageLabel: 'Realtime 3D Sniper — upload via admin panel',
  },
  {
    title: 'Texturing & Baking',
    subtitle: 'PBR Workflow',
    description: 'Three texturing approaches depending on asset type and production requirements.',
    steps: [
      'Gather reference and plan surface detail',
      'Apply base PBR material details',
      'Add large / medium / small surface details',
      'Add weathering, usage, and damage details',
      'Refine roughness and surface properties',
      'Final color calibration',
      'Export optimized PBR texture set',
    ],
    toolsUsed: 'Substance 3D Painter · Marmoset Toolbag · RizomUV',
    image: null,
    imageLabel: 'Upload a texturing showcase via admin panel',
  },
  {
    title: 'Retopology & Optimization',
    subtitle: 'Clean Topology Pipeline',
    description: 'Ensures clean, engine-ready topology for high-quality and performance-optimized assets.',
    steps: [
      'Perform auto / procedural remesh',
      'Manual retopology for critical assets',
      'Fix topology flow and shading issues',
      'UV unwrap',
      'Bake maps — Normal, AO etc.',
      'Feedback resolution',
    ],
    toolsUsed: 'Blender · ZBrush · Maya · Topogun · Marmoset · Substance 3D Painter',
    image: null,
    imageLabel: 'Upload a retopology showcase via admin panel',
  },
  {
    title: 'Environment Design',
    subtitle: 'Game Engine Workflow',
    description: 'Full environment pipeline from blockout to optimized, lit, and polished game-ready scene.',
    steps: [
      'Define goals, constraints and gather references',
      'Environment blocking and gameplay validation',
      'Import final assets and textures',
      'Set dressing and staging',
      'Materials, lighting, probes and post-processing',
      'Performance profiling and optimization',
      'Iterate, polish, build and test',
    ],
    toolsUsed: 'Unreal Engine 5 · Unity · Megascans · Marmoset',
    // Replace with real image URL after uploading via admin panel
    // Suggested asset: T-72 Interior / Unreal Engine Lighting Showcase
    image: null,
    imageLabel: 'T-72 / UE Lighting Showcase — upload via admin panel',
  },
]

export default async function ServicesPage() {
  const { services, sp } = await getData()

  const heroLabel   = sp.hero?.label    ?? FB_PAGE.heroLabel
  const heroHeading = sp.hero?.heading  ?? FB_PAGE.heroHeading
  const heroSubtitle = sp.hero?.subtitle ?? FB_PAGE.heroSubtitle
  const ctaHeading  = sp.cta?.heading   ?? FB_PAGE.ctaHeading
  const ctaSubtitle = sp.cta?.subtitle  ?? FB_PAGE.ctaSubtitle
  const ctaBtnLabel = sp.cta?.buttonLabel ?? FB_PAGE.ctaBtnLabel
  const ctaBtnUrl   = sp.cta?.buttonUrl   ?? FB_PAGE.ctaBtnUrl

  return (
    <>
      {/* Hero */}
      <section className="xq-section">
        <div className="xq-container">
          <div className="xq-label mb-4">{heroLabel}</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6 max-w-2xl">
            {heroHeading}
          </h1>
          <p className="text-xq-muted text-lg max-w-2xl leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-xq-border pb-24">
        <div className="xq-container space-y-8 mt-12">
          {services.map((service) => (
            <div key={String(service.id)} className="xq-card p-5 sm:p-6 md:p-8">
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
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <div className="xq-label mb-4">Our Stack</div>
          <h2 className="text-3xl font-black text-white mb-12">Tools & Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map((tool) => (
              <div key={tool.category} className="flex gap-4 p-4 border border-xq-border rounded-lg bg-xq-card">
                <div className="w-1 bg-xq-accent rounded-full shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{tool.category}</div>
                  <div className="text-xq-muted text-xs leading-relaxed">{tool.items}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Pipeline */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container">
          <div className="xq-label mb-4">How We Work</div>
          <h2 className="text-3xl font-black text-white mb-4">Production Pipeline</h2>
          <p className="text-xq-muted max-w-2xl mb-12 leading-relaxed">
            Standardized workflows built for quality and consistency across every project.
            Full pipeline documentation available on request.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pipelines.map((pipeline) => (
              <div key={pipeline.title} className="xq-card p-0 overflow-hidden">
                {/* Image placeholder */}
                <div className="aspect-video bg-xq-surface border-b border-xq-border flex items-center justify-center relative">
                  {pipeline.image ? (
                    <Image
                      src={pipeline.image}
                      alt={pipeline.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-center px-6">
                      <div className="text-xq-accent text-xs font-semibold mb-1 tracking-widest uppercase">Portfolio Asset</div>
                      <div className="text-xq-muted text-xs">{pipeline.imageLabel}</div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-black text-lg">{pipeline.title}</h3>
                      <div className="text-xq-accent text-xs font-semibold tracking-wide mt-0.5">{pipeline.subtitle}</div>
                    </div>
                  </div>
                  <p className="text-xq-muted text-sm mb-4 leading-relaxed">{pipeline.description}</p>

                  <ol className="space-y-1.5 mb-5">
                    {pipeline.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-xq-muted">
                        <span className="text-xq-accent font-bold shrink-0 w-4">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  <div className="text-xs text-xq-muted border-t border-xq-border pt-4">
                    <span className="text-xq-accent font-semibold">Tools: </span>
                    {pipeline.toolsUsed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement CTA */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{ctaHeading}</h2>
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
