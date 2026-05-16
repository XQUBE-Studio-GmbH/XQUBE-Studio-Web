import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import AboutPageClient from '@/components/live-preview/AboutPageClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
  description: 'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria, with production hubs in Dubai and Dhaka. 15+ years experience, 80+ clients worldwide.',
  openGraph: {
    title: 'About XQube Studio | A Studio Built for Precision',
    description: 'GmbH registered in Vienna. 15+ years. 80+ clients. Three global hubs.',
    url: 'https://www.xqubestudio.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About XQube Studio',
    description: 'GmbH registered in Vienna. 15+ years. 80+ clients. Three global hubs.',
  },
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface MediaRef    { url?: string; alt?: string }
interface Credential { id?: string; value: string; label: string; detail?: string }
interface Hub        { id?: string; flag?: string; city: string; country: string; role?: string; detail?: string; image?: MediaRef | null }
interface WhyCard    { id?: string; title: string; body: string }
interface ClientItem { id: string | number; name: string; sector?: string; note?: string }
interface AboutGlobal {
  intro?: { body1?: string; body2?: string; image?: MediaRef | null }
  credentials?: Credential[]
  hubs?: Hub[]
  whyXqube?: WhyCard[]
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FB_CREDENTIALS: Credential[] = [
  { value: '15+', label: 'Years Experience', detail: 'XR · game art · AI simulation · delivered across 3 continents' },
  { value: '80+', label: 'Clients Worldwide', detail: 'Gaming · XR · flight sim · digital twin · entertainment' },
  { value: '20+', label: 'Core Team Members', detail: 'Artists, engineers, developers, designers, operations' },
  { value: '3',   label: 'Global Hubs',       detail: 'Vienna · Dubai · Dhaka' },
]

const FB_HUBS: Hub[] = [
  { flag: '🇦🇹', city: 'Vienna',  country: 'Austria',    role: 'HQ — Strategy, Leadership & Business Development', detail: 'EU IP protection · enterprise contracts' },
  { flag: '🇦🇪', city: 'Dubai',   country: 'UAE',         role: 'MENA Hub — Strategic Market Access & Partnerships', detail: 'MENA expansion · enterprise & government access' },
  { flag: '🇧🇩', city: 'Dhaka',   country: 'Bangladesh', role: 'Production Hub — Scalable Delivery & Game Art',     detail: 'Cost efficiency · deep talent pool' },
]

const FB_WHY: WhyCard[] = [
  { title: 'Zero Handoff Overhead',      body: 'Your brief goes directly to the senior artists doing the work — no account manager layer. Deliverables arrive pipeline-native: FBX, UE5, Unity, your naming conventions, your LOD specs. Zero integration overhead.' },
  { title: '24-Hour Production Cycle',   body: 'Vienna, Dubai, and Dhaka span nine time zones. While your team sleeps, work continues. 30–50% faster delivery across 80+ clients — because three hubs in sequence never stop.' },
  { title: 'Engine Agnostic',            body: 'UE5, Unity, Godot, UEFN, Roblox. We match your pipeline, your stack, your standards.' },
  { title: 'Senior Artists Only',        body: 'No juniors on your work. Your Art Director works directly with ours. Your feedback actioned in 24 hours.' },
  { title: 'Pilot-First Model',          body: 'Try one asset before signing anything. Fee credited to Month 1 if you proceed. Zero obligation.' },
  { title: 'End-to-End Pipeline',        body: 'Concept to engine-ready — ZBrush, Substance, UE5, Unity. Full ownership of the deliverable.' },
]

const FB_CLIENTS = [
  { id: 'fresh-tv',  name: 'Fresh TV',         sector: 'Media & TV',  note: 'Total Drama Island · UEFN — shipped & live' },
  { id: 'bmw',       name: 'BMW',              sector: 'Automotive',  note: 'Interactive configurators & simulation models' },
  { id: 'c3d',       name: 'C3D',             sector: 'Game Studio', note: 'AAA 3D assets and environment art production' },
  { id: 'barney',    name: 'Barney Studio',    sector: 'Creative',    note: 'Characters, rigged animations & concept art' },
  { id: 'indg',      name: 'INDG',             sector: 'CGI Tech',    note: 'Photorealistic CGI & digital twin — automotive' },
  { id: 'cyberfox',  name: 'Cyberfox',         sector: 'Game Studio', note: 'Game-ready assets · VR environments' },
  { id: 'flightsim', name: 'FlightSim Studio', sector: 'Flight Sim',  note: 'Aircraft & scenery to sim-ready spec' },
]

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [ap, clientsRes] = await Promise.all([
      payload.findGlobal({ slug: 'about-page' }) as Promise<AboutGlobal>,
      payload.find({ collection: 'clients', sort: 'order', limit: 20, depth: 0 }),
    ])
    return {
      ap:      ap as AboutGlobal,
      clients: clientsRes.docs as unknown as ClientItem[],
    }
  } catch {
    return { ap: {} as AboutGlobal, clients: [] }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const { ap, clients } = await getData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <AboutPageClient
      initialData={ap}
      clients={clients}
      serverURL={serverURL}
    />
  )
}
