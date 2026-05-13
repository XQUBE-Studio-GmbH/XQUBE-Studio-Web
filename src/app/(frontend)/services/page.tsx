import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Game art production, XR & simulation, xKIT retainer tiers, and staff augmentation for game studios worldwide.',
}

const services = [
  {
    title: 'Game Art Production',
    slug: 'game-art',
    description: 'End-to-end game asset production. Characters, environments, weapons, vehicles, props, and modular kits — all delivered to your pipeline specifications.',
    features: ['AAA Character & Creature Art', 'Environment & Level Art', 'Weapon & Vehicle Art', 'Props & Modular Kits', 'Cross-platform delivery (PC, Console, Mobile, UEFN)'],
  },
  {
    title: 'XR & Simulation',
    slug: 'xr-simulation',
    description: 'Immersive XR experiences and digital twins built for real-world deployment across Meta Quest, HTC Vive, and PlayStation VR.',
    features: ['XR Experience Design', 'Digital Twin Development', 'Simulation Environments', 'Optimized for major VR platforms', 'High detail without performance cost'],
  },
  {
    title: 'xKIT Production Tiers',
    slug: 'xkit',
    description: 'AI-powered structured production retainer. Scale your art output without scaling your overhead. Four tiers from Nano to Ultra.',
    features: ['Nano Qube — Entry tier', 'Mega Qube', 'Giga Qube', 'Ultra Qube — Full studio capacity', 'Monthly retainer, predictable output'],
  },
  {
    title: 'Staff Augmentation',
    slug: 'staff-augmentation',
    description: 'Dedicated artists embedded directly in your team and pipeline. Invisible to your stakeholders, indispensable to your delivery.',
    features: ['Dedicated artist assignments', 'DevOps-compatible workflows', 'Engine-agnostic skill sets', 'EU-compliant IP ownership', 'GDPR-compliant data handling'],
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
          <p className="text-xq-muted text-lg max-w-2xl">
            From single asset packs to full embedded teams — we scale to your needs with the
            quality and reliability EU-registered studios demand.
          </p>
        </div>
      </section>

      <section className="border-t border-xq-border pb-32">
        <div className="xq-container space-y-12 mt-12">
          {services.map((service) => (
            <div key={service.slug} className="xq-card p-8">
              <h2 className="text-2xl font-black text-white mb-4">{service.title}</h2>
              <p className="text-xq-muted leading-relaxed mb-6 max-w-2xl">{service.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-xq-muted">
                    <span className="text-xq-accent">→</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="xq-container mt-16 text-center">
          <p className="text-xq-muted mb-6">Not sure which service fits your project?</p>
          <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
            className="xq-btn-primary text-base px-8 py-4">
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </>
  )
}
