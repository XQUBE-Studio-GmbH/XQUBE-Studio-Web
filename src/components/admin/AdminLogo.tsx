'use client'

export default function AdminLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <img
        src="/xqube-logo.svg"
        alt="XQube Studio"
        style={{ width: '180px', height: 'auto' }}
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
