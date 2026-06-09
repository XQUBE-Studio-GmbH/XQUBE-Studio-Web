/**
 * GET /blog/index.md
 *
 * Markdown summary of the Blog page for AI crawlers and agents.
 * Satisfies the [C1] AIScan "expose /path/index.md" requirement.
 */

const MARKDOWN = `# XQUBE Studio — Blog & Insights

Game art production insights, pipeline breakdowns, and studio news.

## Topics

- Game art pipeline and production workflows
- 3D environment and prop production techniques
- VR asset optimisation for Meta Quest and PSVR2
- UEFN and Roblox development insights
- Studio operations and project management

## Read the Blog

Full blog: https://www.xqubestudio.com/blog

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
