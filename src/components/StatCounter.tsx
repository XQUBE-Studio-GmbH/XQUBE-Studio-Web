'use client'

import { useRef, useEffect, useState } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Split "80+" → { num: 80, suffix: "+" }. Non-numeric values are returned as-is. */
function parse(value: string): { num: number; suffix: string } | null {
  const m = value.match(/^(\d+)(.*)$/)
  if (!m) return null
  return { num: parseInt(m[1], 10), suffix: m[2] }
}

/** easeOutQuart — fast start, smooth brake */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  value:    string   // e.g. "80+", "15+", "3"
  label:    string
  duration?: number  // animation duration in ms (default 1500)
}

/**
 * Animated stat counter — counts from 0 to the target number using
 * IntersectionObserver to trigger on scroll, easeOutQuart for natural motion.
 * Falls back to displaying the raw value string for non-numeric values.
 */
export default function StatCounter({ value, label, duration = 1500 }: Props) {
  const parsed  = parse(value)
  const ref     = useRef<HTMLDivElement>(null)
  const [count,   setCount]   = useState(0)
  const [started, setStarted] = useState(false)

  // Trigger when the stat scrolls into view
  useEffect(() => {
    if (!parsed) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [parsed, started])

  // Run the count-up animation
  useEffect(() => {
    if (!started || !parsed) return
    const target = parsed.num
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.round(easeOut(progress) * target))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [started, parsed, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-black text-xq-accent mb-1">
        {parsed ? `${count}${parsed.suffix}` : value}
      </div>
      <div className="text-sm text-xq-muted">{label}</div>
    </div>
  )
}
