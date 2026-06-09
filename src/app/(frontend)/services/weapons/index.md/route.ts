/**
 * GET /services/weapons/index.md
 *
 * Markdown summary of the Weapons service page for AI crawlers and agents.
 */

const MARKDOWN = `# XQUBE Studio — Weapon Art Production

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
`

export function GET() {
  return new Response(MARKDOWN, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
