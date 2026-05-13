import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'XQube Studio | AAA Game Art & XR Production',
  description: 'XQube Studio delivers AAA-quality game art and XR production for studios worldwide. GmbH registered in Vienna. GDPR compliant. IP ownership clear.',
}

const services = [
  {
    title: 'Game Art Production',
    description: 'Characters, environments, weapons, vehicles, props, and modular kits — delivered to your pipeline specifications. UE5, Unity, UEFN, Roblox.',
    icon: '🎮',
  },
  {
    title: 'XR & Simulation',
    description: 'Immersive XR experiences, digital twins, and simulation environments optimized for Meta Quest, HTC Vive, and PlayStation VR.',
    icon: '🥽',
  },
  {
    title: 'Staff Augmentation',
    description: 'Dedicated artists embedded directly in your pipeline. Engine-agnostic, DevOps-compatible, EU-compliant IP ownership.',
    icon: '👥',
  },
]

const clients = ['BMW', 'INDG', 'FlightSim Studio', 'Fresh TV', 'Cyberfox', 'C3D', 'Barney Studio']

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '80+', label: 'Clients Worldwide' },
  { value: '20+', label: 'Core Team Members' },
  { value: '3',   label: 'Global Hubs' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0a1f13]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-xq-accent/5 rounded-full blur-3xl" />
        <div className="xq-container relative z-10">
          <div className="max-w-4xl">
            <div className="xq-label mb-6">Vienna · Dubai · Dhaka</div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05]">
              Where Art Meets <span className="text-xq-accent">Precision</span>
            </h1>
            <p className="text-xl text-xq-muted max-w-2xl mb-10 leading-relaxed">
              XQube Studio delivers AAA-quality game art and XR production for studios worldwide.
              GmbH registered in Vienna. GDPR compliant. IP ownership clear.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer" className="xq-btn-primary text-base px-8 py-4">
                Book a Discovery Call
              </Link>
              <Link href="/portfolio" className="xq-btn-ghost text-base px-8 py-4">View Portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-xq-border bg-xq-surface">
        <div className="xq-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-black text-xq-accent mb-1">{stat.value}</div>
                <div className="text-sm text-xq-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="border-b border-xq-border bg-xq-bg">
        <div className="xq-container py-10">
          <p className="text-center text-xs text-xq-muted tracking-widest uppercase mb-8">Trusted by studios worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clients.map((client) => (
              <div key={client} className="text-xq-muted font-semibold text-sm tracking-wide opacity-60 hover:opacity-100 transition-opacity">{client}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="xq-section">
        <div className="xq-container">
          <div className="mb-16">
            <div className="xq-label mb-4">What We Do</div>
            <h2 className="text-4xl md:text-5xl font-black text-white max-w-xl">Production-grade art at scale</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="xq-card">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-xq-muted text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="xq-btn-ghost">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* Pilot-First + Pricing Signal */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="xq-label mb-4">How We Engage</div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Try before you commit</h2>
              <p className="text-xq-muted leading-relaxed mb-6">
                Not ready to sign a retainer? Commission a single asset first. We scope it upfront,
                deliver in 2–3 days, and if you proceed — the fee counts toward Month 1.
              </p>
              <p className="text-xq-muted leading-relaxed">
                Retainer engagements start from{' '}
                <span className="text-white font-semibold">€2,800/month</span>.
                Weekly delivery cycles. Direct Slack access. No middlemen.
              </p>
              <div className="mt-8">
                <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer" className="xq-btn-primary">
                  Get a Scoped Quote
                </Link>
              </div>
            </div>
            <div className="space-y-5">
              {[
                { step: '01', title: 'You brief us', body: 'One asset, scope agreed upfront — no surprises.' },
                { step: '02', title: 'We deliver in 2–3 days', body: 'Fast turnaround, AAA quality from day one.' },
                { step: '03', title: 'Fee credited to Month 1', body: 'If you proceed with a retainer, it counts.' },
                { step: '04', title: 'Walk away if not satisfied', body: 'No contract, no obligation.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start p-4 border border-xq-border rounded-lg">
                  <div className="text-xq-accent font-black text-sm shrink-0 w-8 mt-0.5">{item.step}</div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-xq-muted text-sm">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="xq-label mb-6">Ready to Start?</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Let's build something <span className="text-xq-accent">extraordinary</span>
            </h2>
            <p className="text-xq-muted text-lg mb-10 max-w-xl mx-auto">
              Book a 30-minute discovery call. We'll scope your project, answer your questions,
              and give you a clear path forward — no commitment required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer" className="xq-btn-primary text-base px-8 py-4">
                Book a Discovery Call
              </Link>
              <Link href="/contact" className="xq-btn-ghost text-base px-8 py-4">Send a Message</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
