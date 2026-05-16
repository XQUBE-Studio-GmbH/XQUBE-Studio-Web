import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import ServicesPageClient from '@/components/live-preview/ServicesPageClient'

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

interface MediaRef { url?: string; alt?: string }

interface ServiceItem {
  id: string | number
  title: string
  shortDescription?: string
  icon?: string
  features?: { id: string; feature: string }[]
  platforms?: string
  image?: MediaRef | null
}

interface PipelineStep { id?: string; step: string }

interface Pipeline {
  id?: string
  title: string
  subtitle?: string
  description?: string
  steps?: (PipelineStep | string)[]
  toolsUsed?: string
  image?: MediaRef | null
  imageLabel?: string
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
  hero?: { label?: string; heading?: string; subtitle?: string; image?: MediaRef | null }
  cta?:  { heading?: string; subtitle?: string; buttonLabel?: string; buttonUrl?: string }
  pipelines?: Pipeline[]
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
      services:  docs.length > 0 ? docs : FB_SERVICES,
      pipelines: (sp.pipelines && sp.pipelines.length > 0) ? sp.pipelines as Pipeline[] : null,
      sp,
    }
  } catch {
    return { services: FB_SERVICES, pipelines: null, sp: {} as ServicesPageGlobal }
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

// ─── Pipelines fallback (used until admin populates via CMS) ─────────────────
const FB_PIPELINES: Pipeline[] = [
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
    image: null,
    imageLabel: 'Hero asset render — upload via Services Page in admin panel',
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
    imageLabel: 'Texturing showcase — upload via Services Page in admin panel',
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
    imageLabel: 'Retopology showcase — upload via Services Page in admin panel',
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
    image: null,
    imageLabel: 'Environment render — upload via Services Page in admin panel',
  },
]

export default async function ServicesPage() {
  const { services, sp } = await getData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <ServicesPageClient
      initialData={sp}
      services={services}
      serverURL={serverURL}
    />
  )
}
