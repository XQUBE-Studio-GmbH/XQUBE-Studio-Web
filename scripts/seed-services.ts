/**
 * Seed script — deletes all existing service records and creates 6 new ones.
 *
 * Run with:
 *   npx tsx --env-file=.env.local scripts/seed-services.ts
 */

import { getPayload } from 'payload'
import config from '../payload/payload.config'
import { randomUUID } from 'node:crypto'

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
    description: toRichText([
      'XQUBE builds game-ready environments for PC, console, mobile, and VR. We design modular kits that maximise reuse across your level, then layer in hero pieces and unique detail elements that break repetition.',
      'Every asset is named, UV\'d, and delivered to your pipeline specification. We work in Unreal Engine 5, Unity, UEFN, and Roblox Studio natively — no conversion surprises at the end of production.',
    ]),
    process: [
      { id: randomUUID(), step: 'Brief & Reference Lock', description: 'Style direction, poly budget, texel density, naming convention, and engine spec agreed in writing before production begins.' },
      { id: randomUUID(), step: 'Blockout', description: 'Rough spatial blockout confirms scale, flow, and composition. You walk through and approve before a single production asset is built.' },
      { id: randomUUID(), step: 'Modular Kit Production', description: 'Core tileable and modular pieces built first — walls, floors, trim, structural elements — designed for maximum scene reuse.' },
      { id: randomUUID(), step: 'Hero Elements', description: 'Unique hero assets, statement props, and detail pieces layered in to add visual interest and break repetition.' },
      { id: randomUUID(), step: 'Lighting & Post', description: 'In-engine lighting pass and post-process setup. Scene reviewed together before final delivery.' },
      { id: randomUUID(), step: 'Delivery', description: 'All source files, textures, and engine-ready assets delivered to your naming convention. LOD chains included.' },
    ],
    features: [
      { id: randomUUID(), feature: 'Modular kits for full-scene reuse' },
      { id: randomUUID(), feature: 'Exterior biomes and open-world environments' },
      { id: randomUUID(), feature: 'Interior architectural sets' },
      { id: randomUUID(), feature: 'Tileables and trim sheets' },
      { id: randomUUID(), feature: 'Hero asset and statement prop production' },
      { id: randomUUID(), feature: 'In-engine lighting and post-process setup' },
      { id: randomUUID(), feature: 'LOD chain delivery' },
      { id: randomUUID(), feature: 'Naming convention and pipeline compliance' },
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
    description: toRichText([
      'Props are the detail layer that makes a world feel lived-in. XQUBE produces props at any scale — single hero pieces or batched libraries of hundreds.',
      'We maintain consistent quality and style across the full set, whether it\'s a hand-crafted interactive object or a background dressing asset produced in volume.',
    ]),
    process: [
      { id: randomUUID(), step: 'Brief & Style Reference', description: 'Mood boards, reference packs, and written briefs locked before production. Style guide agreed before any model starts.' },
      { id: randomUUID(), step: 'High Poly Modelling', description: 'Sculpted or hard-surface high poly capturing all surface detail for baking. Reviewed and approved before low poly begins.' },
      { id: randomUUID(), step: 'Low Poly & UVs', description: 'Topology optimised for your target poly budget. UVs unwrapped to your texel density specification.' },
      { id: randomUUID(), step: 'Baking', description: 'Normal, AO, curvature, and custom maps baked in Marmoset Toolbag or Substance.' },
      { id: randomUUID(), step: 'Texturing', description: 'PBR texture sets built in Substance 3D Painter. Delivered in your engine\'s required format.' },
      { id: randomUUID(), step: 'QA & Delivery', description: 'In-engine review, naming convention check, and final delivery with all source files and working files.' },
    ],
    features: [
      { id: randomUUID(), feature: 'Hero interactive and pickable props' },
      { id: randomUUID(), feature: 'Background dressing and scatter libraries' },
      { id: randomUUID(), feature: 'Large-scale prop batch production' },
      { id: randomUUID(), feature: 'Full PBR texture pipeline' },
      { id: randomUUID(), feature: 'Physics and collision mesh setup' },
      { id: randomUUID(), feature: 'LOD chain delivery' },
      { id: randomUUID(), feature: 'Interactive and destructible prop variants' },
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
    description: toRichText([
      'XQUBE produces weapons to the standard your players will scrutinise in first-person, every second they play. From mechanically accurate firearms to sculpted fantasy melee and sci-fi weapons — we handle the full pipeline.',
      'First-person and third-person LOD sets, modular component systems, and wear and material variation — all handled to brief and delivered scene-ready.',
    ]),
    process: [
      { id: randomUUID(), step: 'Reference & Spec Lock', description: 'Mechanical reference, concept sheets, poly budget, and naming conventions agreed before a single poly is placed. First-person vs. third-person spec confirmed.' },
      { id: randomUUID(), step: 'High Poly', description: 'Mechanically accurate high poly, hard surface modelled or sculpted depending on weapon type. Reviewed before low poly begins.' },
      { id: randomUUID(), step: 'Low Poly & UVs', description: 'Game-ready topology with UVs laid out to your texel density. First-person and third-person LODs where required.' },
      { id: randomUUID(), step: 'Baking', description: 'Full bake pass in Marmoset Toolbag — normal, AO, curvature, thickness, and position maps.' },
      { id: randomUUID(), step: 'Texturing', description: 'PBR texture sets per your engine\'s pipeline. Wear, scratches, and material variation handled to brief.' },
      { id: randomUUID(), step: 'In-Engine Integration', description: 'Asset placed in engine, materials set up, LODs assigned. Delivered scene-ready and animation-socket ready.' },
    ],
    features: [
      { id: randomUUID(), feature: 'Firearms — semi-auto, automatic, sniper, shotgun, launcher' },
      { id: randomUUID(), feature: 'Melee — swords, axes, hammers, knives, fantasy weapons' },
      { id: randomUUID(), feature: 'Sci-fi and energy weapons' },
      { id: randomUUID(), feature: 'First and third person LOD sets' },
      { id: randomUUID(), feature: 'Modular weapon attachment and component systems' },
      { id: randomUUID(), feature: 'Full PBR texture pipeline with wear and variation' },
      { id: randomUUID(), feature: 'Animation socket and attachment point setup' },
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
    description: toRichText([
      'Complex mechanical assets require a different level of structural discipline. XQUBE builds vehicles, aircraft, spacecraft, and industrial machinery with panel-level accuracy, realistic material breakdown, and full LOD chains.',
      'We handle both single hero vehicles and full vehicle libraries at scale — ready for hero placement or background dressing.',
    ]),
    process: [
      { id: randomUUID(), step: 'Blueprint & Reference', description: 'Technical drawings, photo reference, and style sheets agreed before modelling begins. Silhouette and proportion confirmed at blockout.' },
      { id: randomUUID(), step: 'High Poly Construction', description: 'Mechanically accurate high poly built panel by panel. Hard surface workflow in ZBrush, Maya, or 3ds Max depending on asset type.' },
      { id: randomUUID(), step: 'Low Poly & LODs', description: 'Game-ready topology built for your poly budget. Full LOD chain from hero to distant.' },
      { id: randomUUID(), step: 'UV Layout', description: 'UVs laid out for maximum texel density across hero surfaces. Tiling materials used for repeated mechanical panels.' },
      { id: randomUUID(), step: 'Baking & Texturing', description: 'Full bake pass. PBR textures with realistic material breakdown — paint, bare metal, rubber, glass, emissives.' },
      { id: randomUUID(), step: 'In-Engine Setup', description: 'Physics body, collision mesh, material slots, and LOD setup configured. Delivered ready to integrate.' },
    ],
    features: [
      { id: randomUUID(), feature: 'Ground vehicles — civilian, military, sci-fi' },
      { id: randomUUID(), feature: 'Aerial assets — aircraft, helicopters, dropships' },
      { id: randomUUID(), feature: 'Spacecraft and futuristic vehicles' },
      { id: randomUUID(), feature: 'Heavy machinery and industrial equipment' },
      { id: randomUUID(), feature: 'Hero and background vehicle libraries' },
      { id: randomUUID(), feature: 'Damage and destruction state variants' },
      { id: randomUUID(), feature: 'Full LOD chains and collision mesh setup' },
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
    description: toRichText([
      'VR demands a different approach from day one. XQUBE builds VR assets with the platform\'s performance constraints baked into the pipeline — not resolved in a final optimisation pass that compromises quality.',
      'We align on draw call budgets, texture compression targets, and interaction requirements before modelling begins. Assets arrive in-engine ready: LODs assigned, collision set, grab points defined, performance profiled on target hardware.',
    ]),
    process: [
      { id: randomUUID(), step: 'Platform Spec Alignment', description: 'Draw call budgets, poly limits, texture resolution, and performance targets locked per device (Meta Quest, PSVR2, PC VR) before production begins.' },
      { id: randomUUID(), step: 'Interaction-Ready Modelling', description: 'Assets modelled with grab points, physics pivots, socket locations, and interaction volumes defined from the start — not retrofitted.' },
      { id: randomUUID(), step: 'Optimisation-First Low Poly', description: 'Topology built for VR frame rates. No retopology surprises at the end of production.' },
      { id: randomUUID(), step: 'LOD Chain Production', description: 'Full LOD chain from hero to billboard. Each LOD tested on target hardware at production stage.' },
      { id: randomUUID(), step: 'Texture Compression & Baking', description: 'Textures baked and compressed to platform spec (ASTC for Quest, BC for PC). Atlasing and draw call budgets maintained.' },
      { id: randomUUID(), step: 'In-Engine VR Integration', description: 'Asset integrated into your VR scene. Interaction tested, performance profiled, and delivered with a performance report.' },
    ],
    features: [
      { id: randomUUID(), feature: 'Meta Quest 2, 3, and Pro optimised assets' },
      { id: randomUUID(), feature: 'PSVR2 and PC VR (SteamVR, OpenXR) assets' },
      { id: randomUUID(), feature: 'Interaction-ready props with grab and physics points' },
      { id: randomUUID(), feature: 'Full LOD chains to impostor and billboard' },
      { id: randomUUID(), feature: 'Draw call and texture budget compliance' },
      { id: randomUUID(), feature: 'Physics, collision, and grab-point setup' },
      { id: randomUUID(), feature: 'Performance profiling report on delivery' },
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
    description: toRichText([
      'XQUBE has shipped live experiences on both UEFN and Roblox, including a Fortnite island produced for Fresh TV and broadcast globally. We handle the full production — environment design, scripting, game systems, QA, and publish.',
      'Not just the art — the whole thing. We know the platform constraints, the creator economy mechanics, and the publish pipeline inside out.',
    ]),
    process: [
      { id: randomUUID(), step: 'Brief & Game Design', description: 'We scope the experience together: objectives, core loop, player flow, and monetisation approach. A written game design document is agreed before production begins.' },
      { id: randomUUID(), step: 'Environment Design & Blockout', description: 'Spatial layout blocked in-engine. You walk through the experience before full art production begins.' },
      { id: randomUUID(), step: 'Art Production', description: 'Full environment, prop, and asset production to platform spec. UEFN or Roblox Studio native — no conversion pipeline.' },
      { id: randomUUID(), step: 'Scripting & Systems', description: 'Verse (UEFN) or Lua (Roblox) scripting for game mechanics, UI systems, leaderboards, and monetisation integration.' },
      { id: randomUUID(), step: 'QA & Playtesting', description: 'Internal QA pass, multiplayer testing at scale, and performance profiling. Issues resolved before publish.' },
      { id: randomUUID(), step: 'Publish & Post-Launch', description: 'We handle the publish. Post-launch support, live ops, and iteration available on retainer.' },
    ],
    features: [
      { id: randomUUID(), feature: 'UEFN island design and full art production' },
      { id: randomUUID(), feature: 'Roblox experience development' },
      { id: randomUUID(), feature: 'Verse scripting — game mechanics, UI, devices' },
      { id: randomUUID(), feature: 'Lua scripting — game systems, monetisation, leaderboards' },
      { id: randomUUID(), feature: 'Multiplayer and live event systems' },
      { id: randomUUID(), feature: 'Monetisation integration (game passes, developer products)' },
      { id: randomUUID(), feature: 'Post-launch support and live operations' },
      { id: randomUUID(), feature: 'Full platform publish handled' },
    ],
    platforms: 'UEFN · Roblox Studio · Verse · Lua · Unreal Engine 5',
    featured: true,
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Initialising Payload...')
  const payload = await getPayload({ config })

  // Delete all existing services
  console.log('Deleting existing services...')
  const existing = await payload.find({ collection: 'services', limit: 100, depth: 0 })
  for (const svc of existing.docs) {
    await payload.delete({ collection: 'services', id: svc.id })
    console.log(`  Deleted: ${(svc as unknown as { title: string }).title}`)
  }
  console.log(`Deleted ${existing.docs.length} existing service(s).`)

  // Create new services
  console.log('\nCreating services...')
  for (const svc of SERVICES) {
    const created = await payload.create({ collection: 'services', data: svc as any })
    console.log(`  Created [${created.id}]: ${svc.title}`)
  }

  console.log('\nDone. All 6 services seeded successfully.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
