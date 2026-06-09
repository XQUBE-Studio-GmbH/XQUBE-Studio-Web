/**
 * GET /services/props/index.md
 *
 * Markdown summary of the Props service page for AI crawlers and agents.
 */

const MARKDOWN = `# XQUBE Studio — Prop Art Production

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
`

export function GET() {
  return new Response(MARKDOWN, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
