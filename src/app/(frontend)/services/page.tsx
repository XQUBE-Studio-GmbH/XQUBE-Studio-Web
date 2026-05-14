import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

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

// ─── Services ────────────────────────────────────────────────────────────────
const services = [
  {
    title: 'Game Art Production',
    description: 'Full-spectrum 3D art production from a single hero asset to an entire game world. Delivered to your pipeline specifications, on time, at AAA quality.',
    features: [
      'Characters & Creatures — heroes, NPCs, enemies, rig-ready',
      'Weapons — firearms, melee, sci-fi, PBR textured',
      'Vehicles — ground, air, sci-fi variants',
      'Environments — modular level art, biomes, interior sets',
      'Props & Items — environmental props, interactive objects',
      'UI/UX & 2D — HUDs, menus, key art, marketing assets',
    ],
    platforms: 'Unreal Engine 5 · Unity · UEFN · Roblox · Meta Quest · PSVR2',
  },
  {
    title: 'VR Game Assets',
    description: 'Production-ready VR assets and immersive game environments built for performance. We understand the constraints of real-time VR and design to them.',
    features: [
      'High-fidelity VR character and prop assets',
      'Immersive VR environment design',
      'Optimized for Meta Quest, HTC Vive, PlayStation VR',
      'LOD chains and draw call budgets built in',
      'Interaction-ready asset preparation',
      'VR game environment lighting and post-processing',
    ],
    platforms: 'Meta Quest · HTC Vive · PSVR2 · 6DoF ready · OpenXR',
  },
  {
    title: 'Interactive Development',
    description: 'End-to-end development for UEFN islands, Roblox experiences, and VR games. We\'ve shipped on all three platforms — including a live Fortnite island with Fresh TV.',
    features: [
      'UEFN island development — design, scripting, publish',
      'Roblox Studio — Lua scripting, game systems, publish',
      'VR game development — Unity (C#) and Unreal (Blueprint)',
      'Complex VR application development',
      'Performance optimization across all platforms',
      'Post-launch support and iteration',
    ],
    platforms: 'UEFN · Roblox Studio · Unity · Unreal Engine · Blueprint · C#',
  },
  {
    title: 'Staff Augmentation',
    description: 'Dedicated resources embedded directly in your team. Your tools, your pipeline, your standards — our people.',
    features: [
      'Resources onboard to your stack from day one',
      'Sprint cycles, standups, review loops — your cadence',
      'Naming conventions, file structures, poly budgets followed exactly',
      'Direct access — no account managers, no middlemen',
      'Scale up or down per milestone',
      'EU-compliant IP ownership, GDPR-compliant data handling',
    ],
    platforms: 'Any engine · Any platform · Any pipeline',
  },
]

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

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="xq-section">
        <div className="xq-container">
          <div className="xq-label mb-4">What We Offer</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6 max-w-2xl">
            Production-grade services for serious studios
          </h1>
          <p className="text-xq-muted text-lg max-w-2xl leading-relaxed">
            From a single asset to a fully embedded team — we scale to your needs.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-xq-border pb-24">
        <div className="xq-container space-y-8 mt-12">
          {services.map((service) => (
            <div key={service.title} className="xq-card p-5 sm:p-6 md:p-8">
              <h2 className="text-2xl font-black text-white mb-3">{service.title}</h2>
              <p className="text-xq-muted leading-relaxed mb-6 max-w-2xl">{service.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-xq-muted">
                    <span className="text-xq-accent mt-0.5 shrink-0">→</span> {f}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-xq-muted border-t border-xq-border pt-4">
                <span className="text-xq-accent font-semibold">Platforms & Engines: </span>
                {service.platforms}
              </div>
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
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Looking for a long-term art partner?
            </h2>
            <p className="text-xq-muted text-lg mb-10">We might be the right fit.</p>
            <Link href="/contact" className="xq-btn-primary text-base px-8 py-4">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
