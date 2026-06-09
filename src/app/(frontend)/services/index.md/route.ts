/**
 * GET /services/index.md
 *
 * Markdown summary of the Services page for AI crawlers and agents.
 * Satisfies the [C1] AIScan "expose /path/index.md" requirement.
 */

const MARKDOWN = `# XQUBE Studio — Production-Grade Services

Game art, VR production, and platform experiences built to AAA spec.

## Service Areas

- [Environments](/services/environments): Modular level art, biomes, and interior sets. From a single interior to a full game world — delivered to engine spec, on time.
- [Props](/services/props): Hero interactive objects to full background dressing libraries. Produced at scale without sacrificing quality on any individual asset.
- [Weapons](/services/weapons): Firearms, melee, sci-fi, and fantasy weapons to AAA spec. Full pipeline from high poly to in-engine integration — first and third person LODs included.
- [Hard Surfaces](/services/hard-surfaces): Vehicles, aircraft, spacecraft, and heavy machinery built with structural accuracy and full LOD chains.
- [VR Assets](/services/vr-assets): VR-native asset production with optimisation built into every stage — not bolted on at the end.
- [UEFN & Roblox](/services/uefn-roblox): End-to-end island and experience production. Shipped a live Fortnite island broadcast globally with Fresh TV.

## Engagement Models

- **Project-Based**: Fixed scope, fixed price. Ideal for defined asset lists.
- **Monthly Retainer**: Dedicated team capacity reserved monthly for ongoing productions.
- **Embedded Team**: XQUBE artists join your pipeline directly.

## Get Started

- [Get a Quote](/scope)
- [Contact](/contact)
`

export function GET() {
  return new Response(MARKDOWN, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
