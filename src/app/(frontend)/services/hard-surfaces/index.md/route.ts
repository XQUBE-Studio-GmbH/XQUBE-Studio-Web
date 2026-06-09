/**
 * GET /services/hard-surfaces/index.md
 *
 * Markdown summary of the Hard Surfaces service page for AI crawlers and agents.
 */

const MARKDOWN = `# XQUBE Studio — Hard Surface Art Production

Vehicles, aircraft, spacecraft, and heavy machinery built with structural accuracy and full LOD chains.

## What We Build

- **Ground Vehicles**: Cars, trucks, tanks, APCs, motorbikes — modern, historical, and sci-fi
- **Aircraft**: Fighter jets, helicopters, dropships, bombers, and UAVs
- **Spacecraft**: Fighters, freighters, capital ships, and space stations
- **Naval**: Warships, submarines, patrol boats, and offshore platforms
- **Heavy Machinery**: Construction equipment, industrial machinery, and factory systems
- **Mechs & Robots**: Bipedal mechs, robotic drones, and mechanised units

## Pipeline

- Hard surface modelling in Maya / Blender / ZBrush
- Accurate mechanical topology with clean edge loops for deformation
- PBR texturing with metal/roughness workflow (Substance Painter)
- Full LOD chains from hero to impostor level
- Breakable parts and damage states on request
- Unreal Engine 5, Unity, or FBX + textures delivery

## Platforms

Unreal Engine 5 · Unity · PC · Console

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
