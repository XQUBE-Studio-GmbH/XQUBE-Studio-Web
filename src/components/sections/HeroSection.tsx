'use client'

import { ChevronRight, Play, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#14CB72]/5 rounded-full blur-[120px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="container-xqube relative z-10 pt-24 pb-16">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
            <span className="tag-xqube">Game Art & XR Production</span>
            <span className="flex items-center gap-1.5 text-xs text-[#8D95A8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14CB72] animate-pulse" />
              Vienna · Dubai · Dhaka
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.0] mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            Where{' '}
            <span className="text-[#14CB72]">Art</span>
            <br />
            Meets{' '}
            <span className="relative">
              Precision
              <span className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-[#14CB72] to-transparent" />
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg lg:text-xl text-[#8D95A8] max-w-2xl leading-relaxed mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            AAA-quality game art, XR experiences, and digital twins — delivered by a production-grade studio trusted by game studios worldwide. EU-registered, GDPR-compliant.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            <a
              href="https://calendly.com/tanvirkhandlxqsmgs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 text-base"
            >
              Book Discovery Call
              <ChevronRight className="w-4 h-4" />
            </a>
            <Link
              href="/portfolio"
              className="btn-outline px-8 py-4 text-base"
            >
              View Portfolio
              <ArrowDownRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Social proof numbers */}
          <div
            className="grid grid-cols-3 gap-6 max-w-lg animate-fade-in-up"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            {[
              { value: '50+', label: 'Projects Delivered' },
              { value: '15+', label: 'Studio Clients' },
              { value: '3', label: 'Global Hubs' },
            ].map((stat) => (
              <div key={stat.label} className="border-l border-white/10 pl-4">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-[#8D95A8] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-[#8D95A8]">
        <span className="text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center translate-y-6">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#14CB72]/50 to-transparent" />
      </div>
    </section>
  )
}
