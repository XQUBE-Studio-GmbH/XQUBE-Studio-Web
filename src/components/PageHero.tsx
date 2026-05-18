'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useParallaxOffset } from '@/lib/useParallaxOffset'
import type { MediaRef } from '@/types/cms'

interface PageHeroProps {
  label:      string
  heading:    string
  subtitle?:  string
  image?:     MediaRef | null
  /** Tailwind min-height class. Default: 'min-h-[50vh]' */
  minHeight?: string
  /** Optional extra content rendered below the subtitle (e.g. a CTA button) */
  children?:  React.ReactNode
}

/**
 * Shared inner-page hero banner used by About, Services, Portfolio, Blog,
 * and Contact pages. Owns its own parallax ref and scroll calculation —
 * parent components just pass content props.
 */
export default function PageHero({
  label,
  heading,
  subtitle,
  image,
  minHeight = 'min-h-[50vh]',
  children,
}: PageHeroProps) {
  const heroRef        = useRef<HTMLElement>(null)
  const parallaxOffset = useParallaxOffset(heroRef)

  return (
    <section ref={heroRef} className={`relative ${minHeight} flex items-center overflow-hidden`}>
      {/* ── Background ──────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#060e08] to-[#0a1f13]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(20,203,114,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Parallax image (when provided) ──────────────────────────────────── */}
      {image?.url && (
        <div
          className="absolute inset-0"
          style={{ transform: `scale(1.12) translateY(${parallaxOffset}px)`, willChange: 'transform' }}
        >
          <Image src={image.url} alt={image.alt || heading} fill className="object-cover" priority />
        </div>
      )}

      {/* ── Dark overlays ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* ── Text content ────────────────────────────────────────────────────── */}
      <div className="xq-container relative z-10">
        <div className="max-w-3xl">
          <div className="xq-label mb-6">{label}</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6 leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {heading}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
