/**
 * GET /about/index.md
 *
 * Markdown summary of the About page for AI crawlers and agents.
 * Satisfies the [C1] AIScan "expose /path/index.md" requirement.
 */

const MARKDOWN = `# About XQUBE Studio

> A studio built for precision.

XQUBE Studio GmbH is a AAA game art production studio with teams in Vienna, Dubai, and Dhaka. We deliver production-grade 3D assets for PC, console, mobile, and VR — built to pipeline spec, on time.

## What We Do

We are 3D artists and production specialists. We build the environments, props, weapons, vehicles, and VR assets that ship in games. Not concepting, not pitching ideas — making production-ready assets that drop straight into your engine.

## Locations

- **Vienna, Austria** — Studio HQ and client-facing operations.
- **Dubai, UAE** — Regional hub for Middle East and South Asia projects.
- **Dhaka, Bangladesh** — Core production team.

## Links

- [Home](/)
- [Services](/services)
- [Portfolio](/portfolio)
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
