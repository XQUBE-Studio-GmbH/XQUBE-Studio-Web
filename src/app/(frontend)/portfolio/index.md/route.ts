/**
 * GET /portfolio/index.md
 *
 * Markdown summary of the Portfolio page for AI crawlers and agents.
 * Satisfies the [C1] AIScan "expose /path/index.md" requirement.
 */

const MARKDOWN = `# XQUBE Studio — AAA Game Art Portfolio

Production-grade 3D work spanning environments, props, weapons, vehicles, and VR assets.

## Asset Categories

- **Environments**: Modular level art, biomes, open-world and interior sets for PC, console, and mobile.
- **Props**: Hero interactive objects, background dressing libraries, and scatter assets.
- **Weapons**: Firearms, melee, sci-fi, and fantasy weapons with full PBR texture pipeline.
- **Hard Surfaces**: Vehicles, aircraft, spacecraft, and heavy machinery.
- **VR Assets**: Optimised interactive props and environments for Meta Quest, PSVR2, and PC VR.

## View Work

Full portfolio: https://www.xqubestudio.com/portfolio

## Links

- [Services](/services)
- [About](/about)
- [Get a Quote](/scope)
`

export function GET() {
  return new Response(MARKDOWN, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
