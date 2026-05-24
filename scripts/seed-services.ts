/**
 * Seed script — deletes all existing service records and creates 6 new ones.
 * Uses the Payload REST API over HTTPS — no raw DB connection required.
 *
 * Run with:
 *   npx tsx --env-file=.env.local scripts/seed-services.ts
 *
 * Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD env vars, or pass them inline:
 *   PAYLOAD_ADMIN_EMAIL=info@xqubestudio.com PAYLOAD_ADMIN_PASSWORD=yourpassword \
 *     npx tsx --env-file=.env.local scripts/seed-services.ts
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'
const EMAIL    = process.env.PAYLOAD_ADMIN_EMAIL    || ''
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD || ''

if (!EMAIL || !PASSWORD) {
  console.error('Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD before running.')
  console.error('Example:')
  console.error('  PAYLOAD_ADMIN_EMAIL=info@xqubestudio.com PAYLOAD_ADMIN_PASSWORD=xxx npx tsx --env-file=.env.local scripts/seed-services.ts')
  process.exit(1)
}

// ─── Lexical richText helper ──────────────────────────────────────────────────

function toRichText(paragraphs: string[]) {
  return {
    root: {
      children: paragraphs.map(text => ({
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
        direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1,
      })),
      direction: 'ltr', format: '', indent: 0, type: 'root', version: 1,
    },
  }
}

// ─── Service definitions ──────────────────────────────────────────────────────

const SERVICES = [
  {
    title:            'Environments',
    slug:             'environments',
    icon:             '🏔️',
    order:            1,
    shortDescription: 'Modular level art, biomes, and interior sets built to your engine\'s constraints. From a single interior to a full game world — delivered to spec, on time.',
    description:      toRichText([
      'XQUBE builds game-ready environments for PC, console, mobile, and VR. We design modular kits that maximise reuse across your level, then layer in hero pieces and unique detail elements that break repetition.',
      'Every asset is named, UV\'d, and delivered to your pipeline specification. We work in Unreal Engine 5, Unity, UEFN, and Roblox Studio natively — no conversion surprises at the end of production.',
    ]),
    process: [
      { step: 'Brief & Reference Lock',  description: 'Style direction, poly budget, texel density, naming convention, and engine spec agreed in writing before production begins.' },
      { step: 'Blockout',                description: 'Rough spatial blockout confirms scale, flow, and composition. You walk through and approve before a single production asset is built.' },
      { step: 'Modular Kit Production',  description: 'Core tileable and modular pieces built first — walls, floors, trim, structural elements — designed for maximum scene reuse.' },
      { step: 'Hero Elements',           description: 'Unique hero assets, statement props, and detail pieces layered in to add visual interest and break repetition.' },
      { step: 'Lighting & Post',         description: 'In-engine lighting pass and post-process setup. Scene reviewed together before final delivery.' },
      { step: 'Delivery',                description: 'All source files, textures, and engine-ready assets delivered to your naming convention. LOD chains included.' },
    ],
    features: [
      { feature: 'Modular kits for full-scene reuse' },
      { feature: 'Exterior biomes and open-world environments' },
      { feature: 'Interior architectural sets' },
      { feature: 'Tileables and trim sheets' },
      { feature: 'Hero asset and statement prop production' },
      { feature: 'In-engine lighting and post-process setup' },
      { feature: 'LOD chain delivery' },
      { feature: 'Naming convention and pipeline compliance' },
    ],
    platforms: 'Unreal Engine 5 · Unity · UEFN · Roblox',
    featured: true,
  },
  {
    title:            'Props',
    slug:             'props',
    icon:             '📦',
    order:            2,
    shortDescription: 'From hero interactive objects to full background dressing libraries — produced at scale without sacrificing quality on any individual asset.',
    description:      toRichText([
      'Props are the detail layer that makes a world feel lived-in. XQUBE produces props at any scale — single hero pieces or batched libraries of hundreds.',
      'We maintain consistent quality and style across the full set, whether it\'s a hand-crafted interactive object or a background dressing asset produced in volume.',
    ]),
    process: [
      { step: 'Brief & Style Reference', description: 'Mood boards, reference packs, and written briefs locked before production. Style guide agreed before any model starts.' },
      { step: 'High Poly Modelling',     description: 'Sculpted or hard-surface high poly capturing all surface detail for baking. Reviewed and approved before low poly begins.' },
      { step: 'Low Poly & UVs',          description: 'Topology optimised for your target poly budget. UVs unwrapped to your texel density specification.' },
      { step: 'Baking',                  description: 'Normal, AO, curvature, and custom maps baked in Marmoset Toolbag or Substance.' },
      { step: 'Texturing',               description: 'PBR texture sets built in Substance 3D Painter. Delivered in your engine\'s required format.' },
      { step: 'QA & Delivery',           description: 'In-engine review, naming convention check, and final delivery with all source files and working files.' },
    ],
    features: [
      { feature: 'Hero interactive and pickable props' },
      { feature: 'Background dressing and scatter libraries' },
      { feature: 'Large-scale prop batch production' },
      { feature: 'Full PBR texture pipeline' },
      { feature: 'Physics and collision mesh setup' },
      { feature: 'LOD chain delivery' },
      { feature: 'Interactive and destructible prop variants' },
    ],
    platforms: 'Unreal Engine 5 · Unity · Blender · Substance 3D Painter · Marmoset Toolbag',
    featured: true,
  },
  {
    title:            'Weapons',
    slug:             'weapons',
    icon:             '⚔️',
    order:            3,
    shortDescription: 'Firearms, melee, sci-fi, and fantasy weapons built to AAA spec. Full pipeline from high poly to in-engine integration — first and third person LODs included.',
    description:      toRichText([
      'XQUBE produces weapons to the standard your players will scrutinise in first-person, every second they play. From mechanically accurate firearms to sculpted fantasy melee and sci-fi weapons — we handle the full pipeline.',
      'First-person and third-person LOD sets, modular component systems, and wear and material variation — all handled to brief and delivered scene-ready.',
    ]),
    process: [
      { step: 'Reference & Spec Lock',  description: 'Mechanical reference, concept sheets, poly budget, and naming conventions agreed before a single poly is placed. First-person vs. third-person spec confirmed.' },
      { step: 'High Poly',              description: 'Mechanically accurate high poly, hard surface modelled or sculpted depending on weapon type. Reviewed before low poly begins.' },
      { step: 'Low Poly & UVs',         description: 'Game-ready topology with UVs laid out to your texel density. First-person and third-person LODs where required.' },
      { step: 'Baking',                 description: 'Full bake pass in Marmoset Toolbag — normal, AO, curvature, thickness, and position maps.' },
      { step: 'Texturing',              description: 'PBR texture sets per your engine\'s pipeline. Wear, scratches, and material variation handled to brief.' },
      { step: 'In-Engine Integration',  description: 'Asset placed in engine, materials set up, LODs assigned. Delivered scene-ready and animation-socket ready.' },
    ],
    features: [
      { feature: 'Firearms — semi-auto, automatic, sniper, shotgun, launcher' },
      { feature: 'Melee — swords, axes, hammers, knives, fantasy weapons' },
      { feature: 'Sci-fi and energy weapons' },
      { feature: 'First and third person LOD sets' },
      { feature: 'Modular weapon attachment and component systems' },
      { feature: 'Full PBR texture pipeline with wear and variation' },
      { feature: 'Animation socket and attachment point setup' },
    ],
    platforms: 'Unreal Engine 5 · Unity · ZBrush · Maya · Substance 3D Painter · Marmoset Toolbag',
    featured: true,
  },
  {
    title:            'Hard Surfaces',
    slug:             'hard-surfaces',
    icon:             '⚙️',
    order:            4,
    shortDescription: 'Vehicles, aircraft, spacecraft, and heavy machinery built with the structural accuracy and material quality AAA productions demand.',
    description:      toRichText([
      'Complex mechanical assets require a different level of structural discipline. XQUBE builds vehicles, aircraft, spacecraft, and industrial machinery with panel-level accuracy, realistic material breakdown, and full LOD chains.',
      'We handle both single hero vehicles and full vehicle libraries at scale — ready for hero placement or background dressing.',
    ]),
    process: [
      { step: 'Blueprint & Reference',  description: 'Technical drawings, photo reference, and style sheets agreed before modelling begins. Silhouette and proportion confirmed at blockout.' },
      { step: 'High Poly Construction', description: 'Mechanically accurate high poly built panel by panel. Hard surface workflow in ZBrush, Maya, or 3ds Max depending on asset type.' },
      { step: 'Low Poly & LODs',        description: 'Game-ready topology built for your poly budget. Full LOD chain from hero to distant.' },
      { step: 'UV Layout',              description: 'UVs laid out for maximum texel density across hero surfaces. Tiling materials used for repeated mechanical panels.' },
      { step: 'Baking & Texturing',     description: 'Full bake pass. PBR textures with realistic material breakdown — paint, bare metal, rubber, glass, emissives.' },
      { step: 'In-Engine Setup',        description: 'Physics body, collision mesh, material slots, and LOD setup configured. Delivered ready to integrate.' },
    ],
    features: [
      { feature: 'Ground vehicles — civilian, military, sci-fi' },
      { feature: 'Aerial assets — aircraft, helicopters, dropships' },
      { feature: 'Spacecraft and futuristic vehicles' },
      { feature: 'Heavy machinery and industrial equipment' },
      { feature: 'Hero and background vehicle libraries' },
      { feature: 'Damage and destruction state variants' },
      { feature: 'Full LOD chains and collision mesh setup' },
    ],
    platforms: 'Unreal Engine 5 · Unity · ZBrush · Maya · 3ds Max · Substance 3D Painter',
    featured: true,
  },
  {
    title:            'VR Assets',
    slug:             'vr-assets',
    icon:             '🥽',
    order:            5,
    shortDescription: 'VR-native asset production with optimisation built into every stage — not bolted on at the end. LOD chains, draw call budgets, and interaction readiness from day one.',
    description:      toRichText([
      'VR demands a different approach from day one. XQUBE builds VR assets with the platform\'s performance constraints baked into the pipeline — not resolved in a final optimisation pass that compromises quality.',
      'We align on draw call budgets, texture compression targets, and interaction requirements before modelling begins. Assets arrive in-engine ready: LODs assigned, collision set, grab points defined, performance profiled on target hardware.',
    ]),
    process: [
      { step: 'Platform Spec Alignment',     description: 'Draw call budgets, poly limits, texture resolution, and performance targets locked per device (Meta Quest, PSVR2, PC VR) before production begins.' },
      { step: 'Interaction-Ready Modelling', description: 'Assets modelled with grab points, physics pivots, socket locations, and interaction volumes defined from the start — not retrofitted.' },
      { step: 'Optimisation-First Low Poly', description: 'Topology built for VR frame rates. No retopology surprises at the end of production.' },
      { step: 'LOD Chain Production',        description: 'Full LOD chain from hero to billboard. Each LOD tested on target hardware at production stage.' },
      { step: 'Texture Compression & Baking', description: 'Textures baked and compressed to platform spec (ASTC for Quest, BC for PC). Atlasing and draw call budgets maintained.' },
      { step: 'In-Engine VR Integration',    description: 'Asset integrated into your VR scene. Interaction tested, performance profiled, and delivered with a performance report.' },
    ],
    features: [
      { feature: 'Meta Quest 2, 3, and Pro optimised assets' },
      { feature: 'PSVR2 and PC VR (SteamVR, OpenXR) assets' },
      { feature: 'Interaction-ready props with grab and physics points' },
      { feature: 'Full LOD chains to impostor and billboard' },
      { feature: 'Draw call and texture budget compliance' },
      { feature: 'Physics, collision, and grab-point setup' },
      { feature: 'Performance profiling report on delivery' },
    ],
    platforms: 'Meta Quest · PSVR2 · SteamVR · OpenXR · Unreal Engine 5 · Unity',
    featured: true,
  },
  {
    title:            'UEFN & Roblox',
    slug:             'uefn-roblox',
    icon:             '🎮',
    order:            6,
    shortDescription: 'End-to-end island and experience production on UEFN and Roblox. We\'ve shipped on both platforms — including a live Fortnite island broadcast globally with Fresh TV.',
    description:      toRichText([
      'XQUBE has shipped live experiences on both UEFN and Roblox, including a Fortnite island produced for Fresh TV and broadcast globally. We handle the full production — environment design, scripting, game systems, QA, and publish.',
      'Not just the art — the whole thing. We know the platform constraints, the creator economy mechanics, and the publish pipeline inside out.',
    ]),
    process: [
      { step: 'Brief & Game Design',           description: 'We scope the experience together: objectives, core loop, player flow, and monetisation approach. A written game design document is agreed before production begins.' },
      { step: 'Environment Design & Blockout', description: 'Spatial layout blocked in-engine. You walk through the experience before full art production begins.' },
      { step: 'Art Production',                description: 'Full environment, prop, and asset production to platform spec. UEFN or Roblox Studio native — no conversion pipeline.' },
      { step: 'Scripting & Systems',           description: 'Verse (UEFN) or Lua (Roblox) scripting for game mechanics, UI systems, leaderboards, and monetisation integration.' },
      { step: 'QA & Playtesting',              description: 'Internal QA pass, multiplayer testing at scale, and performance profiling. Issues resolved before publish.' },
      { step: 'Publish & Post-Launch',         description: 'We handle the publish. Post-launch support, live ops, and iteration available on retainer.' },
    ],
    features: [
      { feature: 'UEFN island design and full art production' },
      { feature: 'Roblox experience development' },
      { feature: 'Verse scripting — game mechanics, UI, devices' },
      { feature: 'Lua scripting — game systems, monetisation, leaderboards' },
      { feature: 'Multiplayer and live event systems' },
      { feature: 'Monetisation integration (game passes, developer products)' },
      { feature: 'Post-launch support and live operations' },
      { feature: 'Full platform publish handled' },
    ],
    platforms: 'UEFN · Roblox Studio · Verse · Lua · Unreal Engine 5',
    featured: true,
  },
]

// ─── API helpers ──────────────────────────────────────────────────────────────

async function api(path: string, token: string, method = 'GET', body?: unknown) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const json = await res.json() as Record<string, unknown>
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(json)}`)
  return json
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Login
  console.log(`Logging in as ${EMAIL}...`)
  const loginRes = await api('/users/login', '', 'POST', { email: EMAIL, password: PASSWORD })
  const token = (loginRes as { token: string }).token
  if (!token) throw new Error('Login failed — check email/password')
  console.log('Logged in.')

  // 2. Delete existing services
  console.log('\nFetching existing services...')
  const listRes = await api('/services?limit=100&depth=0', token) as { docs: { id: string; title: string }[] }
  for (const svc of listRes.docs) {
    await api(`/services/${svc.id}`, token, 'DELETE')
    console.log(`  Deleted: ${svc.title}`)
  }
  console.log(`Deleted ${listRes.docs.length} existing service(s).`)

  // 3. Create new services
  console.log('\nCreating services...')
  for (const svc of SERVICES) {
    const created = await api('/services', token, 'POST', svc) as { doc: { id: string } }
    console.log(`  Created [${created.doc.id}]: ${svc.title}`)
  }

  console.log('\nDone. All 6 services seeded successfully.')
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
