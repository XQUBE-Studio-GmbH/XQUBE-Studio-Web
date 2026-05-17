'use client'

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'

interface Props {
  children:  ReactNode
  className?: string
  delay?:     number   // ms — for staggered groups
  distance?:  number   // px translate-y distance (default 28)
  threshold?: number   // Intersection threshold 0–1 (default 0.1)
  once?:      boolean  // stop observing after first reveal (default true)
}

/**
 * Wraps children in a div that fades + slides up when it enters the viewport.
 * Uses IntersectionObserver — no external library needed.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay     = 0,
  distance  = 28,
  threshold = 0.1,
  once      = true,
}: Props) {
  const ref     = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold])

  const style: CSSProperties = {
    transitionDelay:    `${delay}ms`,
    transitionDuration: '650ms',
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    opacity:   visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
