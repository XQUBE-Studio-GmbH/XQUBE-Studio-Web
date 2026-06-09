/**
 * GET /services/vr-assets/index.md
 *
 * Markdown summary of the VR Assets service page for AI crawlers and agents.
 */

const MARKDOWN = `# XQUBE Studio — VR Asset Production

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
`

export function GET() {
  return new Response(MARKDOWN, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
