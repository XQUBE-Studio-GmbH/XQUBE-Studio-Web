import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

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

  const introBody1  = ap.intro?.body1 ?? 'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria. With 15+ years of hands-on delivery across gaming, XR, simulation, and AI — we work with studios worldwide to deliver AAA-quality assets at scale.'
  const introBody2  = ap.intro?.body2 ?? 'Our three-hub model combines European business standards with world-class production capability — giving clients the reliability of a Vienna GmbH with the speed and depth of a Dhaka production team.'
  const introImage  = ap.intro?.image as MediaRef | null | undefined
  const credentials = ap.credentials && ap.credentials.length > 0 ? ap.credentials : FB_CREDENTIALS
  const hubs        = ap.hubs        && ap.hubs.length > 0        ? ap.hubs        : FB_HUBS
  const whyCards    = ap.whyXqube    && ap.whyXqube.length > 0    ? ap.whyXqube    : FB_WHY
  const clientList  = clients.length > 0 ? clients : FB_CLIENTS

  return (
    <>
      {/* ── Intro ────────────────────────────────────────────── */}
      <section className="xq-section">
        <div className="xq-container">
          {introImage?.url ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="xq-label mb-4">About Us</div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">
                  A studio built for precision
                </h1>
                <p className="text-xq-muted text-lg leading-relaxed mb-6">{introBody1}</p>
                <p className="text-xq-muted text-lg leading-relaxed">{introBody2}</p>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-xq-border">
                <Image src={introImage.url} alt={introImage.alt || 'XQube Studio'} fill className="object-cover" priority />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl">
              <div className="xq-label mb-4">About Us</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">
                A studio built for precision
              </h1>
              <p className="text-xq-muted text-lg leading-relaxed mb-6">{introBody1}</p>
              <p className="text-xq-muted text-lg leading-relaxed">{introBody2}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Credentials ──────────────────────────────────────── */}
      <section className="border-t border-xq-border bg-xq-surface">
        <div className="xq-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {credentials.map((c, i) => (
              <div key={c.id ?? i} className="text-center">
                <div className="text-4xl font-black text-xq-accent mb-1">{c.value}</div>
                <div className="text-white font-semibold text-sm mb-1">{c.label}</div>
                {c.detail && <div className="text-xq-muted text-xs">{c.detail}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hubs ─────────────────────────────────────────────── */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container">
          <div className="xq-label mb-4">Our Hubs</div>
          <h2 className="text-3xl font-black text-white mb-12">Global presence, unified delivery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hubs.map((hub, i) => (
              <div key={hub.id ?? i} className="xq-card overflow-hidden">
                {hub.image?.url && (
                  <div className="relative aspect-video -mx-6 -mt-6 mb-6">
                    <Image src={hub.image.url} alt={hub.image.alt || hub.city} fill className="object-cover" />
                  </div>
                )}
                {hub.flag && !hub.image?.url && <div className="text-4xl mb-4">{hub.flag}</div>}
                <h3 className="text-xl font-bold text-white mb-1">{hub.city}</h3>
                <p className="text-xq-accent text-sm font-semibold mb-3">{hub.country}</p>
                {hub.role   && <p className="text-xq-muted text-sm mb-2">{hub.role}</p>}
                {hub.detail && <p className="text-xq-muted text-xs opacity-70">{hub.detail}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clients ──────────────────────────────────────────── */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <div className="xq-label mb-4">Clients & Partners</div>
          <h2 className="text-3xl font-black text-white mb-12">
            Trusted by leading brands across gaming, automotive, simulation, and entertainment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientList.map((client) => (
              <div key={String(client.id)} className="xq-card py-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold">{client.name}</h3>
                  {client.sector && (
                    <span className="text-xs text-xq-accent border border-xq-accent/30 px-2 py-0.5 rounded">{client.sector}</span>
                  )}
                </div>
                {client.note && <p className="text-xq-muted text-sm">{client.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why XQube ────────────────────────────────────────── */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container">
          <div className="xq-label mb-4">Why XQube</div>
          <h2 className="text-3xl font-black text-white mb-10">Built for serious studios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyCards.map((item, i) => (
              <div key={item.id ?? i} className="xq-card">
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-xq-muted text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container text-center">
          <h2 className="text-3xl font-black text-white mb-6">Ready to work together?</h2>
          <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
            className="xq-btn-primary text-base px-8 py-4">
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </>
  )
}
