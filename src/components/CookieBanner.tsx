'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'

const COOKIE_NAME = 'xq-cookie-consent'
const COOKIE_DAYS = 365

// ─── Consent Mode v2 signal helpers ──────────────────────────────────────────
// Only analytics signals are toggled. Ad signals are always denied — no ad
// platform is connected.

declare global {
  interface Window {
    gtag:      (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

function grantAnalytics() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage:  'granted',
      ad_storage:         'denied',
      ad_user_data:       'denied',
      ad_personalization: 'denied',
    })
  }
}

function denyAnalytics() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage:  'denied',
      ad_storage:         'denied',
      ad_user_data:       'denied',
      ad_personalization: 'denied',
    })
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : undefined
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CookieBanner({ gaId }: { gaId?: string }) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const consent = getCookie(COOKIE_NAME)

    if (consent === 'accepted') {
      // Return visit — restore granted state within the wait_for_update window
      // set in the layout inline script (500 ms), so GA receives the update
      // before sending its first hit.
      grantAnalytics()
    } else if (!consent) {
      // First visit — show the banner after a brief delay
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
    // 'declined' — default denied state from the layout inline script stands;
    // no update needed.
  }, [])

  const accept = () => {
    setCookie(COOKIE_NAME, 'accepted', COOKIE_DAYS)
    grantAnalytics()
    setVisible(false)
  }

  const decline = () => {
    setCookie(COOKIE_NAME, 'declined', COOKIE_DAYS)
    denyAnalytics()
    setVisible(false)
  }

  if (!mounted) return null

  return (
    <>
      {/* GA4 — always loaded so Consent Mode v2 modeling works even pre-consent.
          The inline consent default in layout.tsx (analytics_storage: denied)
          prevents any cookies or PII collection until the user explicitly
          accepts. Once accepted, grantAnalytics() updates the signal and GA
          begins full measurement. */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="xq-ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Compact bottom bar */}
      <div
        role="dialog"
        aria-label="Cookie consent"
        aria-live="polite"
        className={`
          fixed bottom-0 left-0 right-0 z-[60]
          border-t border-xq-border bg-xq-card/95 backdrop-blur-md
          transition-transform duration-500 ease-out
          ${visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-xq-muted leading-relaxed">
            We use analytics cookies to understand how visitors use our site. No personal data is sold.{' '}
            <Link href="/cookies" className="text-xq-accent hover:underline underline-offset-2">
              Cookie Policy
            </Link>
            {' '}·{' '}
            <Link href="/privacy" className="text-xq-accent hover:underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="text-xs text-xq-muted hover:text-white transition-colors px-3 py-1.5"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="xq-btn-primary text-xs px-4 py-1.5"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
