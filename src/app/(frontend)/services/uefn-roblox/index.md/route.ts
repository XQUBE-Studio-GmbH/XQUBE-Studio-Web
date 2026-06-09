/**
 * GET /services/uefn-roblox/index.md
 *
 * Markdown summary of the UEFN & Roblox service page for AI crawlers and agents.
 */

const MARKDOWN = `# XQUBE Studio — UEFN & Roblox Development

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
`

export function GET() {
  return new Response(MARKDOWN, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
