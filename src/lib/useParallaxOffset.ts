'use client'

import { useEffect, useState, type RefObject } from 'react'

/**
 * Returns a vertical offset (px) for a parallax background image.
 * Moves from -range to +range as the section scrolls from entering
 * the bottom of the viewport to leaving the top.
 *
 * Use with scale(1.12) on the image wrapper — the extra 12% gives
 * ~60px of headroom on a 500px section, safely covering ±30px motion.
 */
export function useParallaxOffset(
  ref:   RefObject<HTMLElement | null>,
  range: number = 30,
): number {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const rect      = el.getBoundingClientRect()
      const vh        = window.innerHeight
      const sectionH  = el.offsetHeight
      // progress: 0 when section enters from bottom, 1 when it leaves from top
      const progress  = (vh - rect.top) / (vh + sectionH)
      const clamped   = Math.max(0, Math.min(1, progress))
      setOffset((clamped - 0.5) * range * 2)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref, range])

  return offset
}
