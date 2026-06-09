'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function AdminLogo() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <Image
        src={isDark ? '/xqube-logo.svg' : '/xqube-logo-light.svg'}
        alt="XQUBE Studio"
        width={320}
        height={183}
        priority
        style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
      />
      <span style={{
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: isDark ? '#666' : '#888',
      }}>
        Admin Panel
      </span>
    </div>
  )
}
