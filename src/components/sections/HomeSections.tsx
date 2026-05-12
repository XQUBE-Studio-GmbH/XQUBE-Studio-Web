import { Gamepad2, Cpu, Users, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function StatsSection() {
  const stats = [
    { value: 'AAA', label: 'Asset Quality', sub: 'Console & PC grade' },
    { value: 'EU', label: 'Registered GmbH', sub: 'Vienna, Austria' },
    { value: 'GDPR', label: 'Compliant', sub: 'Full IP ownership transfer' },
    { value: '48h', label: 'Response Time', sub: 'On all inquiries' },
  ]

  return (
    <section className="section-py border-b border-white/[0.06]">
      <div className="container-xqube">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card-xqube p-6 text-center">
              <div className="text-3xl font-black text-[#14CB72] mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-xs text-[#8D95A8]">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ServicesPreview() {
  const services = [
    {
      icon: Gamepad2,
      title: 'Game Art Production',
      description: 'Environment art, characters, weapons, vehicles, and props. Cross-platform delivery for PC, console, mobile, and Fortnite UEFN.',
      href: '/services#game-art',
      tags: ['Characters', 'Environments', 'Weapons', 'Props'],
    },
    {
      icon: Cpu,
      title: 'XR & Simulation',
      description: 'Immersive XR experiences, digital twins, and simulation environments optimized for Meta Quest, HTC Vive, and PlayStation VR.',
      href: '/services#xr-simulation',
      tags: ['Digital Twins', 'VR Assets', 'Simulation'],
    },
    {
      icon: Package,
      title: 'xKIT Retainers',
      description: 'AI-powered tiered production retainers. From Nano Qube to Ultra Qube — predictable monthly capacity, no surprises.',
      href: '/services#xkit',
      tags: ['Nano', 'Mega', 'Giga', 'Ultra'],
    },
    {
      icon: Users,
      title: 'Staff Augmentation',
      description: 'Dedicated artists embedded in your pipeline. DevOps-compatible, engine-agnostic, EU-compliant with clear IP ownership.',
      href: '/services#staff-aug',
      tags: ['Dedicated Artists', 'Pipeline Integration'],
    },
  ]

  return (
    <section className="section-py">
      <div className="container-xqube">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="tag-xqube mb-4 inline-block">What We Do</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">
              Production-grade<br />
              <span className="text-[#14CB72]">services</span> at scale
            </h2>
          </div>
          <Link href="/services" className="btn-outline self-start lg:self-auto">
            All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link
                key={service.title}
                href={service.href}
                className="card-xqube p-7 group block"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-sm bg-[#14CB72]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#14CB72]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#14CB72]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#14CB72] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-[#8D95A8] leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 bg-white/5 text-[#8D95A8] rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function PortfolioPreview() {
  // Phase 1: Static placeholder grid
  // Phase 2: Dynamic from CMS — portfolio collection, featured: true
  const categories = ['All', 'Characters', 'Weapons', 'Vehicles', 'Environments', 'VR Assets']

  return (
    <section className="section-py bg-[#0E0E0E]/30">
      <div className="container-xqube">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="tag-xqube mb-4 inline-block">Our Work</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">
              Featured<br />
              <span className="text-[#14CB72]">Portfolio</span>
            </h2>
          </div>
          <Link href="/portfolio" className="btn-outline self-start lg:self-auto">
            View All Work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-sm transition-all ${
                i === 0
                  ? 'bg-[#14CB72] text-black'
                  : 'bg-white/5 text-[#8D95A8] hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid - placeholder until CMS populated */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="card-xqube aspect-square relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#14CB72]/10 to-[#0E0E0E] animate-shimmer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-xs font-semibold text-white">Asset {i + 1}</div>
                <div className="text-[10px] text-[#14CB72]">Category</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#8D95A8]/60 mt-6">
          Portfolio assets loading from CMS — add your work via the admin panel
        </p>
      </div>
    </section>
  )
}

export function CtaSection() {
  return (
    <section className="section-py relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#14CB72]/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14CB72]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14CB72]/30 to-transparent" />

      <div className="container-xqube relative z-10 text-center">
        <span className="tag-xqube mb-6 inline-block">Start a Project</span>
        <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">
          Ready to elevate<br />
          your <span className="text-[#14CB72]">game art?</span>
        </h2>
        <p className="text-[#8D95A8] text-lg max-w-xl mx-auto mb-10">
          Book a 30-minute discovery call. We'll review your project, discuss your pipeline, and outline what working together looks like.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://calendly.com/tanvirkhandlxqsmgs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-10 py-4 text-base"
          >
            Book Discovery Call
            <ArrowRight className="w-5 h-5" />
          </a>
          <Link href="/contact" className="btn-outline px-10 py-4 text-base">
            Send a Message
          </Link>
        </div>
        <p className="text-xs text-[#8D95A8]/60 mt-6">
          info@xqubestudio.com · Registered GmbH, Vienna, Austria
        </p>
      </div>
    </section>
  )
}
