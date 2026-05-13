import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Game art production, XR & simulation, and staff augmentation for game studios worldwide. Engagements from €2,800/month.',
}

const services = [
  {
    title: 'Game Art Production',
    description: 'Full-spectrum 3D art production. From a single hero asset to an entire game world — delivered to your pipeline specifications, on time, at AAA quality.',
    features: [
      'Characters & Creatures — heroes, NPCs, enemies, rig-ready',
      'Weapons — firearms, melee, sci-fi, PBR textured',
      'Vehicles — ground, air, sci-fi variants',
      'Environments — modular level art, biomes, interior sets',
      'Props & Items — environmental props, interactive objects',
      'UI/UX & 2D — HUDs, menus, key art, marketing assets',
    ],
    platforms: 'Unreal Engine 5 · Unity · UEFN / Fortnite · Roblox · Meta Quest · PSVR2',
  },
  {
    title: 'XR & Simulation',
    description: 'Immersive XR experiences and digital twins built for real-world deployment. We handle the full pipeline from concept to engine-ready delivery.',
    features: [
      'XR experience design and development',
      'Digital twin environments',
      'Simulation asset production',
      'Optimized for Meta Quest, HTC Vive, PlayStation VR',
      'High fidelity without performance cost',
      'Automotive & industrial simulation (BMW, INDG)',
    ],
    platforms: 'Meta Quest · HTC Vive · PSVR2 · 6DoF ready',
  },
  {
    title: 'Staff Augmentation',
    description: 'Dedicated artists embedded directly in your team and pipeline. Invisible to your stakeholders, indispensable to your delivery.',
    features: [
      'Dedicated senior artist assignments — no juniors on your work',
      'Your AD works directly with ours',
      'DevOps-compatible workflows',
      'Engine-agnostic skill sets',
      'EU-compliant IP ownership and GDPR-compliant data handling',
      'Scale up or down per milestone — no long-term headcount risk',
    ],
    platforms: 'UE5 · Unity · UEFN · Roblox · Any engine',
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="xq-section">
        <div className="xq-container">
          <div className="xq-label mb-4">What We Offer</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 max-w-2xl">
            Production-grade services for serious studios
          </h1>
          <p className="text-xq-muted text-lg max-w-2xl leading-relaxed">
            From a single asset to a fully embedded team — we scale to your needs with the
            quality and reliability a GmbH-registered EU studio demands.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-xq-border pb-24">
        <div className="xq-container space-y-10 mt-12">
          {services.map((service) => (
            <div key={service.title} className="xq-card p-8">
              <h2 className="text-2xl font-black text-white mb-4">{service.title}</h2>
              <p className="text-xq-muted leading-relaxed mb-6 max-w-2xl">{service.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-xq-muted">
                    <span className="text-xq-accent mt-0.5 shrink-0">→</span> {f}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-xq-muted border-t border-xq-border pt-4">
                <span className="text-xq-accent font-semibold">Platforms: </span>{service.platforms}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Signal */}
      <section className="border-t border-xq-border xq-section bg-xq-surface">
        <div className="xq-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="xq-label mb-4">Engagement & Pricing</div>
              <h2 className="text-3xl font-black text-white mb-6">Try before you commit</h2>
              <p className="text-xq-muted leading-relaxed mb-4">
                Not ready to sign a retainer? Start with a single scoped asset. We deliver in 2–3 days —
                and if you proceed, the fee counts toward Month 1.
              </p>
              <p className="text-xq-muted leading-relaxed mb-8">
                Retainer engagements start from{' '}
                <span className="text-white font-semibold">€2,800/month</span>.
                Weekly delivery cycles. Direct Slack access. No middlemen. No long-term commitment required.
              </p>
              <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
                className="xq-btn-primary">
                Book a Discovery Call
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { icon: '✓', title: 'AI-augmented delivery', body: '30–50% faster turnaround at every pipeline stage.' },
                { icon: '✓', title: 'Senior artists only', body: 'No juniors on your work. Your AD works directly with ours.' },
                { icon: '✓', title: 'Weekly sprint cycles', body: 'Full visibility. Brief to engine-ready, owned by you.' },
                { icon: '✓', title: 'EU IP protection', body: 'Vienna GmbH — contracts, data security, GDPR compliant.' },
                { icon: '✓', title: 'Zero long-term commitment', body: 'Scale up or down per milestone, no headcount risk.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 items-start">
                  <div className="text-xq-accent font-bold shrink-0">{item.icon}</div>
                  <div>
                    <span className="text-white font-semibold text-sm">{item.title} — </span>
                    <span className="text-xq-muted text-sm">{item.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
