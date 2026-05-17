'use client'

import { useRef, useEffect, useState, useMemo } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Split "80+" → { num: 80, suffix: "+" }. Returns null for non-numeric strings. */
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
  value:     string   // e.g. "80+", "15+", "3"
  label:     string
  duration?: number   // animation duration ms (default 1500)
}

/**
 * Animated stat counter — counts from 0 to target on scroll.
 * Uses useMemo so parsed never changes between parent re-renders,
 * preventing the animation from restarting on every useLivePreview tick.
 */
export default function StatCounter({ value, label, duration = 1500 }: Props) {
  // useMemo ensures parsed is stable across re-renders unless `value` changes
  const parsed  = useMemo(() => parse(value), [value])
  const ref     = useRef<HTMLDivElement>(null)
  const [count,   setCount]   = useState(0)
  const [started, setStarted] = useState(false)

  // Trigger once when the stat scrolls into view
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
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed])  // `started` intentionally omitted — we only want to register once

  // Run the count-up animation — cancelAnimationFrame on cleanup prevents
  // multiple concurrent animations if the effect somehow re-fires
  useEffect(() => {
    if (!started || !parsed) return
    const target    = parsed.num
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.round(easeOut(progress) * target))
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
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
