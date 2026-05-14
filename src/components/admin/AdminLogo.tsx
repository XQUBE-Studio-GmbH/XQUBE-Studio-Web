'use client'

import Image from 'next/image'

export default function AdminLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <Image
        src="/xqube-logo.svg"
        alt="XQube Studio"
        width={320}
        height={183}
        priority
      />
      <span style={{
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#666',
      }}>
        Admin Panel
      </span>
    </div>
  )
}
