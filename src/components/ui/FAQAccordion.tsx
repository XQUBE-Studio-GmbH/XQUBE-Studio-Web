'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Minus } from 'lucide-react'
import type { FAQItem } from '@/types/cms'

// ─── Props ────────────────────────────────────────────────────────────────────

interface FAQAccordionProps {
  faqs: FAQItem[]
  grouped?: boolean // if true, renders group headings between question sets
}

// ─── Group heading labels ─────────────────────────────────────────────────────

const GROUP_LABELS: Record<string, string> = {
  'what-we-do':       'WHAT WE DO',
  'our-work':         'OUR WORK',
  'working-together': 'WORKING TOGETHER',
  'getting-started':  'GETTING STARTED',
}

// ─── Group display order ──────────────────────────────────────────────────────

const GROUP_ORDER = ['what-we-do', 'our-work', 'working-together', 'getting-started', 'none']

// ─── Link parser ─────────────────────────────────────────────────────────────
// Scans answer text for known URLs/emails and renders them as clickable links.

const LINK_PATTERN = /((?:https?:\/\/(?:www\.)?xqubestudio\.com)?\/scope)|((?:https?:\/\/(?:www\.)?xqubestudio\.com)?\/services)|((?:https?:\/\/(?:www\.)?)?artstation\.com\/xqubestudio)|((?:https?:\/\/(?:www\.)?)?calendly\.com\/tanvirkhandlxqsmgs)|(info@xqubestudio\.com)/gi

function parseLinks(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  LINK_PATTERN.lastIndex = 0
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const matched = match[0]
    const linkClass = 'text-xq-accent hover:opacity-80 transition-opacity'

    if (matched.toLowerCase().includes('artstation')) {
      parts.push(<a key={key++} href="https://www.artstation.com/xqubestudio" target="_blank" rel="noopener noreferrer" className={linkClass}>{matched}</a>)
    } else if (matched.toLowerCase().includes('calendly')) {
      parts.push(<a key={key++} href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer" className={linkClass}>{matched}</a>)
    } else if (matched.includes('@')) {
      parts.push(<a key={key++} href="mailto:info@xqubestudio.com" className={linkClass}>{matched}</a>)
    } else if (matched.includes('/scope')) {
      parts.push(<Link key={key++} href="/scope" className={linkClass}>{matched}</Link>)
    } else if (matched.includes('/services')) {
      parts.push(<Link key={key++} href="/services" className={linkClass}>{matched}</Link>)
    } else {
      parts.push(matched)
    }

    lastIndex = LINK_PATTERN.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FAQAccordion({ faqs, grouped = false }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

  if (faqs.length === 0) return null

  if (!grouped) {
    // Flat list — no group headings
    return (
      <div className="divide-y divide-xq-border border-t border-xq-border">
        {faqs.map((faq) => (
          <FAQRow key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} />
        ))}
      </div>
    )
  }

  // Grouped — bucket by faqGroup in canonical order
  const grouped_map: Record<string, FAQItem[]> = {}
  for (const faq of faqs) {
    const g = faq.faqGroup ?? 'none'
    if (!grouped_map[g]) grouped_map[g] = []
    grouped_map[g].push(faq)
  }

  const presentGroups = GROUP_ORDER.filter((g) => grouped_map[g]?.length)

  return (
    <div className="space-y-8">
      {presentGroups.map((groupKey) => (
        <div key={groupKey}>
          {GROUP_LABELS[groupKey] && (
            <div className="xq-label mb-4">{GROUP_LABELS[groupKey]}</div>
          )}
          <div className="divide-y divide-xq-border border-t border-xq-border">
            {grouped_map[groupKey].map((faq) => (
              <FAQRow key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Single row ───────────────────────────────────────────────────────────────

function FAQRow({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-semibold leading-relaxed transition-colors duration-200 ${isOpen ? 'text-xq-accent' : 'text-white'}`}>
          {faq.question}
        </span>
        <span className="mt-0.5 shrink-0 text-xq-accent">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      {/* Animated answer panel */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? '600px' : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <p className="pt-3 text-sm text-xq-muted leading-relaxed">
          {parseLinks(faq.answer)}
        </p>
      </div>
    </div>
  )
}
