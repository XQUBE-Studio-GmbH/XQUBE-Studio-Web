import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

export const dynamic = 'force-dynamic'

const SERVICES = [
  {
    title: 'Game Art Production',
    slug: 'game-art-production',
    shortDescription: 'Full-spectrum 3D art production from a single hero asset to an entire game world. Delivered to your pipeline specifications, on time, at AAA quality.',
    features: [
      { feature: 'Characters & Creatures — heroes, NPCs, enemies, rig-ready' },
      { feature: 'Weapons — firearms, melee, sci-fi, PBR textured' },
      { feature: 'Vehicles — ground, air, sci-fi variants' },
      { feature: 'Environments — modular level art, biomes, interior sets' },
      { feature: 'Props & Items — environmental props, interactive objects' },
      { feature: 'UI/UX & 2D — HUDs, menus, key art, marketing assets' },
    ],
    platforms: 'Unreal Engine 5 · Unity · UEFN · Roblox · Meta Quest · PSVR2',
    featured: true,
    order: 1,
  },
  {
    title: 'VR Game Assets',
    slug: 'vr-game-assets',
    shortDescription: 'Production-ready VR assets and immersive game environments built for performance. We understand the constraints of real-time VR and design to them.',
    features: [
      { feature: 'High-fidelity VR character and prop assets' },
      { feature: 'Immersive VR environment design' },
      { feature: 'Optimized for Meta Quest, HTC Vive, PlayStation VR' },
      { feature: 'LOD chains and draw call budgets built in' },
      { feature: 'Interaction-ready asset preparation' },
      { feature: 'VR game environment lighting and post-processing' },
    ],
    platforms: 'Meta Quest · HTC Vive · PSVR2 · 6DoF ready · OpenXR',
    featured: true,
    order: 2,
  },
  {
    title: 'Interactive Development',
    slug: 'interactive-development',
    shortDescription: "End-to-end development for UEFN islands, Roblox experiences, and VR games. We've shipped on all three platforms — including a live Fortnite island with Fresh TV.",
    features: [
      { feature: 'UEFN island development — design, scripting, publish' },
      { feature: 'Roblox Studio — Lua scripting, game systems, publish' },
      { feature: 'VR game development — Unity (C#) and Unreal (Blueprint)' },
      { feature: 'Complex VR application development' },
      { feature: 'Performance optimization across all platforms' },
      { feature: 'Post-launch support and iteration' },
    ],
    platforms: 'UEFN · Roblox Studio · Unity · Unreal Engine · Blueprint · C#',
    featured: true,
    order: 3,
  },
  {
    title: 'Staff Augmentation',
    slug: 'staff-augmentation',
    shortDescription: 'Dedicated resources embedded directly in your team. Your tools, your pipeline, your standards — our people.',
    features: [
      { feature: 'Resources onboard to your stack from day one' },
      { feature: 'Sprint cycles, standups, review loops — your cadence' },
      { feature: 'Naming conventions, file structures, poly budgets followed exactly' },
      { feature: 'Direct access — no account managers, no middlemen' },
      { feature: 'Scale up or down per milestone' },
      { feature: 'EU-compliant IP ownership, GDPR-compliant data handling' },
    ],
    platforms: 'Any engine · Any platform · Any pipeline',
    featured: false,
    order: 4,
  },
]

export async function POST(req: NextRequest) {
  if (req.headers.get('x-seed-token') !== 'SEED_SERVICES') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const results: string[] = []

    for (const service of SERVICES) {
      const existing = await payload.find({
        collection: 'services',
        where: { slug: { equals: service.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        results.push(`SKIP  ${service.slug} (already exists)`)
        continue
      }

      await payload.create({ collection: 'services', data: service })
      results.push(`OK    ${service.slug}`)
    }

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    console.error('Seed services error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
