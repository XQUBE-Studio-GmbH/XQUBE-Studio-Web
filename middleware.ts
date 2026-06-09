import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Content negotiation — serve Markdown when:
 *   - Client sends Accept: text/markdown header, OR
 *   - Client appends ?format=md query param
 *
 * Returns the markdown response DIRECTLY (not a rewrite) so we have full
 * control over Content-Type: text/markdown. Edge middleware cannot read the
 * filesystem, so the content is inlined here. The public/*.md files remain
 * as static fallbacks for direct /path/index.md access.
 *
 * Supports C1 of the AIScan AI agent-readiness rubric.
 */

const MD_CONTENT: Record<string, string> = {
  '/': `# XQUBE Studio — Where Art Meets Precision

AAA game art and XR production studio. Vienna · Dubai · Dhaka.

XQUBE Studio GmbH delivers production-grade 3D assets for PC, console, mobile, and VR. 15+ years of AAA pipeline experience.

## Services

- [Environments](/services/environments): Modular level art, biomes, and interior sets built to engine spec.
- [Props](/services/props): Hero interactive objects to full background dressing libraries, produced at scale.
- [Weapons](/services/weapons): Firearms, melee, sci-fi, and fantasy weapons built to AAA spec.
- [Hard Surfaces](/services/hard-surfaces): Vehicles, aircraft, spacecraft, and heavy machinery.
- [VR Assets](/services/vr-assets): VR-native asset production optimised for Meta Quest, PSVR2, and PC VR.
- [UEFN & Roblox](/services/uefn-roblox): End-to-end platform experience production including scripting and publish.

## Portfolio

- [View Portfolio](/portfolio): AAA game art work across environments, props, weapons, vehicles, and VR.

## Engagement Models

- **Project-Based**: Fixed scope, fixed price. Ideal for defined asset lists and short productions.
- **Monthly Retainer**: Dedicated team capacity reserved monthly. Best for ongoing productions.
- **Embedded Team**: XQUBE artists join your pipeline directly, working to your tools and process.

## Company

- [About](/about): Studio story, team, and locations — Vienna, Dubai, Dhaka.
- [Blog](/blog): Production insights and studio news.
- [Contact](/contact): Book a discovery call.
- [Get a Quote](/scope): Submit a brief — response within 24 hours.

## Contact

- Email: info@xqubestudio.com
- Website: https://www.xqubestudio.com
`,

  '/about': `# About XQUBE Studio

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
`,

  '/services': `# XQUBE Studio — Production-Grade Services

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
`,

  '/portfolio': `# XQUBE Studio — AAA Game Art Portfolio

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
`,

  '/contact': `# Contact XQUBE Studio

Get in touch — we respond within 24 hours.

## Contact Details

- **Email**: info@xqubestudio.com
- **Phone**: +43 650 5207329
- **Address**: Rathausstrasse 21/12, 1010 Vienna, Austria

## Book a Call

Schedule a 30-minute discovery call: https://www.xqubestudio.com/contact

## Submit a Brief

Start a project: https://www.xqubestudio.com/scope

## Links

- [Home](/)
- [Services](/services)
- [Portfolio](/portfolio)
`,

  '/blog': `# XQUBE Studio — Blog & Insights

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
`,
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const accept = request.headers.get('accept') ?? ''
  const wantsMarkdown =
    accept.includes('text/markdown') || searchParams.get('format') === 'md'

  if (wantsMarkdown) {
    const content = MD_CONTENT[pathname]
    if (content) {
      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  // Only run on the pages that have corresponding markdown content.
  // Excludes /admin, /api, /_next, and static assets automatically.
  matcher: ['/', '/about', '/services', '/portfolio', '/contact', '/blog'],
}
