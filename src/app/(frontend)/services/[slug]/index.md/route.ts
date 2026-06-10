/**
 * GET /services/[slug]/index.md
 *
 * Markdown summary of each service page for AI crawlers and agents.
 * Consolidated from individual per-slug route handlers — the static slug
 * directories they lived in were shadowing the [slug]/page.tsx dynamic route.
 */

const MARKDOWN: Record<string, string> = {
  'uefn-roblox': `# XQUBE Studio — UEFN & Roblox Development

End-to-end island and experience production for UEFN (Unreal Editor for Fortnite) and Roblox. Shipped a live Fortnite island broadcast globally with Fresh TV.

## What We Build

### UEFN (Fortnite Creative 2.0)
- Full island design and layout from brief to publish
- Verse scripting — game logic, scoring systems, player progression
- Custom asset creation within Fortnite's material and poly constraints
- Performance optimisation to meet Fortnite's island budgets
- Publish support and post-launch iteration

### Roblox
- Experience design, world building, and environment art
- Lua scripting — game systems, UI, monetisation hooks
- Avatar items and UGC asset production
- Performance optimisation for Roblox's rendering constraints
- Publish and live-ops support

## Shipped Work

- Fortnite island for Fresh TV — broadcast globally to millions of viewers

## Engagement

- [Get a Quote](/scope)
- [View Portfolio](/portfolio)
- [All Services](/services)
- [Contact](/contact)

## About XQUBE Studio

XQUBE Studio GmbH — AAA game art studio. Vienna · Dubai · Dhaka.
Website: https://www.xqubestudio.com
`,

  'vr-assets': `# XQUBE Studio — VR Asset Production

VR-native asset production with optimisation built into every stage — not bolted on at the end.

## What We Build

- **VR Props & Interactables**: Grab-ready objects, tools, and interactive environment items
- **VR Environments**: Immersive spaces built to VR poly and draw call budgets from the outset
- **VR Characters**: NPCs and avatar bodies optimised for real-time VR rendering
- **VR Weapons**: First-person weapons with interaction-ready rigs for Quest and PSVR2
- **VR UI Elements**: World-space UI panels, menus, and in-world interactive displays

## Pipeline & Optimisation

- Poly budgets and texture memory limits set at brief stage, not at delivery
- Draw call budgets respected throughout — no surprise optimisation passes
- LOD chains and impostor meshes included
- Tested against Meta Quest 2 / 3 and PSVR2 performance targets
- Unreal Engine 5 (with VR template), Unity XR Toolkit, or FBX + textures

## Platforms

Meta Quest 2 · Meta Quest 3 · PSVR2 · PC VR · OpenXR · SteamVR

## Engagement

- [Get a Quote](/scope)
- [View Portfolio](/portfolio)
- [All Services](/services)
- [Contact](/contact)

## About XQUBE Studio

XQUBE Studio GmbH — AAA game art studio. Vienna · Dubai · Dhaka.
Website: https://www.xqubestudio.com
`,

  'environments': `# XQUBE Studio — Environment Art Production

Modular level art, biomes, and interior sets built to engine spec and delivered on time.

## What We Build

- **Modular Level Art**: Tiling sets and kit-bashed environments for PC, console, and mobile
- **Biomes & Outdoor Worlds**: Open-world terrain, foliage systems, and atmospheric outdoor sets
- **Interior Sets**: Architectural interiors, dungeons, sci-fi corridors, and urban environments
- **Hero Environments**: Bespoke hand-crafted hero areas built to cinematic quality
- **Modular Kits**: Reusable tile sets and snap-together modular systems for level designers

## Pipeline

Full production pipeline from concept block-out through final in-engine delivery:
- High-poly sculpt (ZBrush) → retopo → UV → PBR texturing (Substance Painter)
- Nanite / Lumen ready for UE5 projects
- LOD chains, collision meshes, and lightmap UVs included
- Delivered in Unreal Engine 5, Unity, or as FBX/OBJ with textures

## Platforms

Unreal Engine 5 · Unity · UEFN · PC · Console · Mobile

## Engagement

- [Get a Quote](/scope)
- [View Portfolio](/portfolio)
- [All Services](/services)
- [Contact](/contact)

## About XQUBE Studio

XQUBE Studio GmbH — AAA game art studio. Vienna · Dubai · Dhaka.
Website: https://www.xqubestudio.com
`,

  'props': `# XQUBE Studio — Prop Art Production

Hero interactive objects to full background dressing libraries, produced at scale without sacrificing quality on any individual asset.

## What We Build

- **Hero Props**: High-detail interactive objects — weapons racks, machinery, interactive items
- **Background Dressing**: Environmental props, scatter assets, and set dressing libraries
- **Furniture & Interiors**: Tables, chairs, shelving, appliances, and architectural details
- **Industrial & Mechanical**: Crates, barrels, pipes, cables, and factory equipment
- **Nature & Organic Props**: Rocks, logs, debris, and natural scatter assets
- **Prop Libraries**: Themed sets of 20–200+ props delivered as a cohesive art package

## Pipeline

- High-poly sculpt → retopo → UV → PBR texturing (Substance Painter / Designer)
- Atlas texturing and trim sheet workflows for large libraries
- LOD chains, collision, and lightmap UVs included
- Unreal Engine 5, Unity, or FBX + textures delivery

## Platforms

Unreal Engine 5 · Unity · PC · Console · Mobile · Meta Quest

## Engagement

- [Get a Quote](/scope)
- [View Portfolio](/portfolio)
- [All Services](/services)
- [Contact](/contact)

## About XQUBE Studio

XQUBE Studio GmbH — AAA game art studio. Vienna · Dubai · Dhaka.
Website: https://www.xqubestudio.com
`,

  'weapons': `# XQUBE Studio — Weapon Art Production

Firearms, melee, sci-fi, and fantasy weapons to AAA spec. Full pipeline from high poly to in-engine integration — first and third person LODs included.

## What We Build

- **Firearms**: Pistols, rifles, shotguns, SMGs, LMGs — modern, historical, and sci-fi
- **Melee Weapons**: Swords, axes, knives, blunt weapons — fantasy, historical, and futuristic
- **Sci-Fi Weapons**: Energy weapons, railguns, plasma rifles, and alien designs
- **Fantasy Weapons**: Staffs, wands, bows, enchanted blades, and mythological arms
- **Attachments & Accessories**: Scopes, suppressors, grips, and customisation systems

## Pipeline

- High-poly sculpt (ZBrush) → retopo → UV → PBR texturing (Substance Painter)
- First-person (FPS) and third-person (TPS) LOD variants
- Animation-ready rigs and bone structures on request
- Modular attachment points for weapon customisation systems
- Unreal Engine 5, Unity, or FBX + textures delivery

## Platforms

Unreal Engine 5 · Unity · PC · Console · Mobile

## Engagement

- [Get a Quote](/scope)
- [View Portfolio](/portfolio)
- [All Services](/services)
- [Contact](/contact)

## About XQUBE Studio

XQUBE Studio GmbH — AAA game art studio. Vienna · Dubai · Dhaka.
Website: https://www.xqubestudio.com
`,

  'hard-surfaces': `# XQUBE Studio — Hard Surface Art Production

Vehicles, aircraft, spacecraft, and heavy machinery built with structural accuracy and full LOD chains.

## What We Build

- **Ground Vehicles**: Cars, trucks, tanks, APCs, motorbikes — modern, historical, and sci-fi
- **Aircraft**: Fighter jets, helicopters, dropships, bombers, and UAVs
- **Spacecraft**: Fighters, freighters, capital ships, and space stations
- **Naval**: Warships, submarines, patrol boats, and offshore platforms
- **Heavy Machinery**: Construction equipment, industrial machinery, and factory systems
- **Mechs & Robots**: Bipedal mechs, robotic drones, and mechanised units

## Pipeline

- Hard surface modelling in Maya / Blender / ZBrush
- Accurate mechanical topology with clean edge loops for deformation
- PBR texturing with metal/roughness workflow (Substance Painter)
- Full LOD chains from hero to impostor level
- Breakable parts and damage states on request
- Unreal Engine 5, Unity, or FBX + textures delivery

## Platforms

Unreal Engine 5 · Unity · PC · Console

## Engagement

- [Get a Quote](/scope)
- [View Portfolio](/portfolio)
- [All Services](/services)
- [Contact](/contact)

## About XQUBE Studio

XQUBE Studio GmbH — AAA game art studio. Vienna · Dubai · Dhaka.
Website: https://www.xqubestudio.com
`,
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const markdown = MARKDOWN[slug]

  if (!markdown) {
    return new Response('Not Found', { status: 404 })
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
