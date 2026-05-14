/**
 * Seed script — pre-populates Payload CMS globals and collections with the
 * existing site copy so the admin panel reflects what the site actually shows.
 *
 * Run once after deploying the dynamic-website update:
 *   npm run seed
 *
 * Safe to re-run: globals are always upserted; collections are only seeded
 * when the collection is completely empty (0 documents).
 */

import { getPayload } from 'payload'
import config from '../payload/payload.config'

// ─── Seed data ───────────────────────────────────────────────────────────────

const HOME_PAGE = {
  hero: {
    label:          'Vienna · Dubai · Dhaka',
    headline:       'Where Art Meets Precision',
    subtitle:       'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
    primaryLabel:   'Book a Discovery Call',
    primaryUrl:     'https://calendly.com/tanvirkhandlxqsmgs',
    secondaryLabel: 'View Portfolio',
    secondaryUrl:   '/portfolio',
  },
  stats: [
    { value: '15+', label: 'Years Experience' },
    { value: '80+', label: 'Clients Worldwide' },
    { value: '20+', label: 'Core Team Members' },
    { value: '3',   label: 'Global Hubs' },
  ],
  cta: {
    headline:    'Looking for a long-term art partner?',
    subtitle:    'We might be the right fit.',
    buttonLabel: 'Start a Conversation',
    buttonUrl:   '/contact',
  },
}

const ABOUT_PAGE = {
  intro: {
    body1: 'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria. With 15+ years of hands-on delivery across gaming, XR, simulation, and AI — we work with studios worldwide to deliver AAA-quality assets at scale.',
    body2: 'Our three-hub model combines European business standards with world-class production capability — giving clients the reliability of a Vienna GmbH with the speed and depth of a Dhaka production team.',
  },
  credentials: [
    { value: '15+', label: 'Years Experience', detail: 'XR · game art · AI simulation · delivered across 3 continents' },
    { value: '80+', label: 'Clients Worldwide', detail: 'Gaming · XR · flight sim · digital twin · entertainment' },
    { value: '20+', label: 'Core Team Members', detail: 'Artists, engineers, developers, designers, operations' },
    { value: '3',   label: 'Global Hubs',       detail: 'Vienna · Dubai · Dhaka' },
  ],
  hubs: [
    { flag: '🇦🇹', city: 'Vienna', country: 'Austria',    role: 'HQ — Strategy, Leadership & Business Development',  detail: 'EU IP protection · enterprise contracts' },
    { flag: '🇦🇪', city: 'Dubai',  country: 'UAE',         role: 'MENA Hub — Strategic Market Access & Partnerships', detail: 'MENA expansion · enterprise & government access' },
    { flag: '🇧🇩', city: 'Dhaka',  country: 'Bangladesh', role: 'Production Hub — Scalable Delivery & Game Art',      detail: 'Cost efficiency · deep talent pool' },
  ],
  whyXqube: [
    {
      title: 'Zero Handoff Overhead',
      body:  'Your brief goes directly to the senior artists doing the work — no account manager layer. Deliverables arrive pipeline-native: FBX, UE5, Unity, your naming conventions, your LOD specs. Zero integration overhead.',
    },
    {
      title: '24-Hour Production Cycle',
      body:  'Vienna, Dubai, and Dhaka span nine time zones. While your team sleeps, work continues. 30–50% faster delivery across 80+ clients — because three hubs in sequence never stop.',
    },
    {
      title: 'Engine Agnostic',
      body:  'UE5, Unity, Godot, UEFN, Roblox. We match your pipeline, your stack, your standards.',
    },
    {
      title: 'Senior Artists Only',
      body:  'No juniors on your work. Your Art Director works directly with ours. Your feedback actioned in 24 hours.',
    },
    {
      title: 'Pilot-First Model',
      body:  'Try one asset before signing anything. Fee credited to Month 1 if you proceed. Zero obligation.',
    },
    {
      title: 'End-to-End Pipeline',
      body:  'Concept to engine-ready — ZBrush, Substance, UE5, Unity. Full ownership of the deliverable.',
    },
  ],
}

const SITE_SETTINGS_CONTACT = {
  email:      'info@xqubestudio.com',
  phone:      '+43 650 5207329',
  address:    'Rathausstrasse 21/12, 1010 Vienna, Austria',
  calendly:   'https://calendly.com/tanvirkhandlxqsmgs',
  linkedin:   'https://www.linkedin.com/company/xqubestudio',
  artstation: 'https://www.artstation.com/xqubestudio',
}

const SERVICES = [
  {
    title:            'Game Art Production',
    shortDescription: 'Full-spectrum 3D art production from a single hero asset to an entire game world. Delivered to your pipeline specifications, on time, at AAA quality.',
    icon:             '🎮',
    featured:         true,
    order:            1,
    features: [
      { feature: 'Characters & Creatures — heroes, NPCs, enemies, rig-ready' },
      { feature: 'Weapons — firearms, melee, sci-fi, PBR textured' },
      { feature: 'Vehicles — ground, air, sci-fi variants' },
      { feature: 'Environments — modular level art, biomes, interior sets' },
      { feature: 'Props & Items — environmental props, interactive objects' },
      { feature: 'UI/UX & 2D — HUDs, menus, key art, marketing assets' },
    ],
    platforms: 'Unreal Engine 5 · Unity · UEFN · Roblox · Meta Quest · PSVR2',
  },
  {
    title:            'VR Game Assets',
    shortDescription: 'Production-ready VR assets and immersive game environments built for performance. We understand the constraints of real-time VR and design to them.',
    icon:             '🥽',
    featured:         true,
    order:            2,
    features: [
      { feature: 'High-fidelity VR character and prop assets' },
      { feature: 'Immersive VR environment design' },
      { feature: 'Optimized for Meta Quest, HTC Vive, PlayStation VR' },
      { feature: 'LOD chains and draw call budgets built in' },
      { feature: 'Interaction-ready asset preparation' },
      { feature: 'VR game environment lighting and post-processing' },
    ],
    platforms: 'Meta Quest · HTC Vive · PSVR2 · 6DoF ready · OpenXR',
  },
  {
    title:            'Interactive Development',
    shortDescription: "End-to-end development for UEFN islands, Roblox experiences, and VR games. We've shipped on all three platforms — including a live Fortnite island with Fresh TV.",
    icon:             '⚡',
    featured:         true,
    order:            3,
    features: [
      { feature: 'UEFN island development — design, scripting, publish' },
      { feature: 'Roblox Studio — Lua scripting, game systems, publish' },
      { feature: 'VR game development — Unity (C#) and Unreal (Blueprint)' },
      { feature: 'Complex VR application development' },
      { feature: 'Performance optimization across all platforms' },
      { feature: 'Post-launch support and iteration' },
    ],
    platforms: 'UEFN · Roblox Studio · Unity · Unreal Engine · Blueprint · C#',
  },
  {
    title:            'Staff Augmentation',
    shortDescription: 'Dedicated resources embedded directly in your team. Your tools, your pipeline, your standards — our people.',
    icon:             '🤝',
    featured:         true,
    order:            4,
    features: [
      { feature: 'Resources onboard to your stack from day one' },
      { feature: 'Sprint cycles, standups, review loops — your cadence' },
      { feature: 'Naming conventions, file structures, poly budgets followed exactly' },
      { feature: 'Direct access — no account managers, no middlemen' },
      { feature: 'Scale up or down per milestone' },
      { feature: 'EU-compliant IP ownership, GDPR-compliant data handling' },
    ],
    platforms: 'Any engine · Any platform · Any pipeline',
  },
]

const CLIENTS = [
  { name: 'Fresh TV',         sector: 'Media & TV',  note: 'Total Drama Island · UEFN — shipped & live', featured: true, order: 1 },
  { name: 'BMW',              sector: 'Automotive',  note: 'Interactive configurators & simulation models', featured: true, order: 2 },
  { name: 'C3D',              sector: 'Game Studio', note: 'AAA 3D assets and environment art production', featured: true, order: 3 },
  { name: 'Barney Studio',    sector: 'Creative',    note: 'Characters, rigged animations & concept art', featured: true, order: 4 },
  { name: 'INDG',             sector: 'CGI Tech',    note: 'Photorealistic CGI & digital twin — automotive', featured: true, order: 5 },
  { name: 'Cyberfox',         sector: 'Game Studio', note: 'Game-ready assets · VR environments', featured: true, order: 6 },
  { name: 'FlightSim Studio', sector: 'Flight Sim',  note: 'Aircraft & scenery to sim-ready spec', featured: true, order: 7 },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const payload = await getPayload({ config })

  // ── Home Page global ──────────────────────────────────────────────────────
  console.log('Seeding home-page global...')
  await payload.updateGlobal({ slug: 'home-page', data: HOME_PAGE })
  console.log('  ✓ home-page')

  // ── About Page global ─────────────────────────────────────────────────────
  console.log('Seeding about-page global...')
  await payload.updateGlobal({ slug: 'about-page', data: ABOUT_PAGE })
  console.log('  ✓ about-page')

  // ── Site Settings — contact fields ────────────────────────────────────────
  console.log('Seeding site-settings contact info...')
  await payload.updateGlobal({ slug: 'site-settings', data: { contact: SITE_SETTINGS_CONTACT } })
  console.log('  ✓ site-settings')

  // ── Services collection ───────────────────────────────────────────────────
  console.log('Checking services collection...')
  const existingServices = await payload.find({ collection: 'services', limit: 1 })
  if (existingServices.totalDocs === 0) {
    console.log('  Empty — seeding services...')
    for (const service of SERVICES) {
      await payload.create({ collection: 'services', data: service })
      console.log(`  ✓ ${service.title}`)
    }
  } else {
    console.log(`  Skipped — ${existingServices.totalDocs} service(s) already exist`)
  }

  // ── Clients collection ────────────────────────────────────────────────────
  console.log('Checking clients collection...')
  const existingClients = await payload.find({ collection: 'clients', limit: 1 })
  if (existingClients.totalDocs === 0) {
    console.log('  Empty — seeding clients...')
    for (const client of CLIENTS) {
      await payload.create({ collection: 'clients', data: client })
      console.log(`  ✓ ${client.name}`)
    }
  } else {
    console.log(`  Skipped — ${existingClients.totalDocs} client(s) already exist`)
  }

  console.log('\nSeed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
