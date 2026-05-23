'use client'

import { useAuth } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface AdminUser {
  mustChangePassword?: boolean
}

// Full-screen overlay that blocks the admin until the user changes their
// temporary password. Cleared automatically when they save a new password
// on the /admin/account page (beforeChange hook sets mustChangePassword: false).
export default function MustChangePasswordGuard({ children }: { children?: React.ReactNode }) {
  const { user, refreshCookieAsync } = useAuth()
  const pathname = usePathname()
  const [showOverlay, setShowOverlay] = useState(false)
  const [ready, setReady] = useState(false)

  // On mount, refresh the auth cookie from the server before checking
  // mustChangePassword. This prevents a 1-second false flash caused by the
  // admin loading with a stale JWT that hasn't caught up to the DB yet
  // (e.g. immediately after login when Payload's token refresh is in-flight).
  useEffect(() => {
    refreshCookieAsync()
      .catch(() => {}) // non-fatal — falls through to the check below
      .finally(() => setReady(true))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Only evaluate mustChangePassword after we've confirmed the server state.
  useEffect(() => {
    if (!ready) return
    const mustChange = (user as AdminUser)?.mustChangePassword === true
    const isAccountPage = pathname?.includes('/account')
    setShowOverlay(mustChange && !isAccountPage)
  }, [user, pathname, ready])

  if (!showOverlay) return <>{children}</>

  return (
    <>
      {children}
      {/* Full-screen overlay — cannot be dismissed */}
      <div style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: 'rgba(0,0,0,0.92)',
        zIndex:          99999,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '24px',
      }}>
        <div style={{
          background:   '#111',
          border:       '1px solid #2a2a2a',
          borderRadius: '12px',
          padding:      '40px 36px',
          maxWidth:     '440px',
          width:        '100%',
          textAlign:    'center',
        }}>
          {/* Icon */}
          <div style={{
            width:        '52px',
            height:       '52px',
            borderRadius: '50%',
            background:   'rgba(20,203,114,0.1)',
            border:       '1px solid rgba(20,203,114,0.3)',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            margin:       '0 auto 20px',
            fontSize:     '22px',
          }}>
            🔒
          </div>

          {/* Heading */}
          <h2 style={{
            color:       '#fff',
            fontSize:    '20px',
            fontWeight:  700,
            margin:      '0 0 12px',
            fontFamily:  'sans-serif',
          }}>
            Change your password
          </h2>

          {/* Body */}
          <p style={{
            color:      '#8d95a8',
            fontSize:   '14px',
            lineHeight: '1.6',
            margin:     '0 0 32px',
            fontFamily: 'sans-serif',
          }}>
            For security, you must set a permanent password before you can access the admin panel. Your temporary password will no longer work after this step.
          </p>

          {/* CTA */}
          <Link
            href="/admin/account"
            style={{
              display:        'inline-block',
              background:     '#14CB72',
              color:          '#000',
              padding:        '12px 28px',
              borderRadius:   '6px',
              fontWeight:     700,
              fontSize:       '14px',
              textDecoration: 'none',
              fontFamily:     'sans-serif',
            }}
          >
            Set New Password →
          </Link>
        </div>
      </div>
    </>
  )
}
