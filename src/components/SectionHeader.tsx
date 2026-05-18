'use client'

import ScrollReveal from '@/components/ScrollReveal'

interface SectionHeaderProps {
  label:        string
  heading:      string
  description?: string
  className?:   string
}

/**
 * Reusable section header with built-in ScrollReveal animation.
 * Renders the xq-label pill, an h2, and an optional description paragraph.
 */
export default function SectionHeader({ label, heading, description, className = 'mb-12' }: SectionHeaderProps) {
  return (
    <ScrollReveal className={className}>
      <div className="xq-label mb-4">{label}</div>
      <h2 className="text-3xl font-black text-white">{heading}</h2>
      {description && (
        <p className="text-xq-muted mt-3 max-w-2xl leading-relaxed">{description}</p>
      )}
    </ScrollReveal>
  )
}
