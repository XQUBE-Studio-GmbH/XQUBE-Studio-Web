import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'XQube Studio | AAA Game Art & XR Production',
  description: 'XQube Studio is a GmbH-registered game art and XR production studio. We deliver AAA-quality characters, environments, weapons, and XR assets for game studios worldwide.',
}

const services = [
  {
    title: 'Game Art Production',
    description: 'AAA-quality characters, environments, weapons, vehicles, and props. Cross-platform delivery for PC, Console, Mobile, and UEFN.',
    icon: '🎮',
  },
  {
    title: 'XR & Simulation',
    description: 'Immersive XR experiences, digital twins, and simulation environments optimized for Meta Quest, HTC Vive, and PlayStation VR.',
    icon: '🥽',
  },
  {
    title: 'xKIT Production Tiers',
    description: 'Structured AI-powered retainer service. From Nano Qube to Ultra Qube — scalable production capacity without the overhead.',
    icon: '⚡',
  },
  {
    title: 'Staff Augmentation',
    description: 'Dedicated artists embedded directly in your pipeline. Engine-agnostic, DevOps-compatible, EU-compliant IP ownership.',
    icon: '👥',
  },
]

const clients = ['BMW', 'INDG', 'FlightSim Studio', 'Fresh TV', 'Cyberfox', 'C3D', 'Barney Studio']

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '3',   label: 'Global Hubs' },
  { value: 'AAA', label: 'Quality Standard' },
  { value: 'EU',  label: 'GmbH Registered' },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0a1f13]" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(20,203,114,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-xq-accent/5 rounded-full blur-3xl" />

        <div className="xq-container relative z-10">
          <div className="max-w-4xl">
            <div className="xq-label mb-6 animate-fade-in">Vienna · Dubai · Dhaka</div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] animate-fade-up">
              Where Art Meets{' '}
              <span className="text-xq-accent">Precision</span>
            </h1>
            <p className="text-xl text-xq-muted max-w-2xl mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
              XQube Studio delivers AAA-quality game art and XR production for studios worldwide.
              GmbH registered in Vienna. GDPR compliant. IP ownership clear.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
                className="xq-btn-primary text-base px-8 py-4">
                Book a Discovery Call
              </Link>
              <Link href="/portfolio" className="xq-btn-ghost text-base px-8 py-4">
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
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

      {/* ── Client Logos ─────────────────────────────────────── */}
      <section className="border-b border-xq-border bg-xq-bg">
        <div className="xq-container py-10">
          <p className="text-center text-xs text-xq-muted tracking-widest uppercase mb-8">
            Trusted by studios worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clients.map((client) => (
              <div key={client} className="text-xq-muted font-semibold text-sm tracking-wide opacity-60 hover:opacity-100 transition-opacity">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section className="xq-section">
        <div className="xq-container">
          <div className="mb-16">
            <div className="xq-label mb-4">What We Do</div>
            <h2 className="text-4xl md:text-5xl font-black text-white max-w-xl">
              Production-grade art at scale
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.title} className="xq-card">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-xq-muted text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="xq-btn-ghost">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="xq-label mb-6">Ready to Start?</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Let's build something{' '}
              <span className="text-xq-accent">extraordinary</span>
            </h2>
            <p className="text-xq-muted text-lg mb-10 max-w-xl mx-auto">
              Book a 30-minute discovery call. We'll scope your project, answer your questions, and give you a clear path forward.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
                className="xq-btn-primary text-base px-8 py-4">
                Book a Discovery Call
              </Link>
              <Link href="/contact" className="xq-btn-ghost text-base px-8 py-4">
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
