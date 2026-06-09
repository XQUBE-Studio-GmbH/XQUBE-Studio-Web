/**
 * GET /services/environments/index.md
 *
 * Markdown summary of the Environments service page for AI crawlers and agents.
 */

const MARKDOWN = `# XQUBE Studio — Environment Art Production

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
`

export function GET() {
  return new Response(MARKDOWN, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
