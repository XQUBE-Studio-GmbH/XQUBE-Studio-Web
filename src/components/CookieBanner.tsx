'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'

const COOKIE_NAME = 'xq-cookie-consent'
const COOKIE_DAYS = 365

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : undefined
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`
}

export default function CookieBanner({ gaId }: { gaId?: string }) {
  const [visible, setVisible]   = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    setMounted(true)
    const consent = getCookie(COOKIE_NAME)
    if (consent === 'accepted') {
      setAccepted(true)   // silently re-load GA on return visits
    } else if (!consent) {
      // Small delay so banner doesn't flash during initial render
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
    // 'declined' → do nothing: no banner, no GA
  }, [])

  const accept = () => {
    setCookie(COOKIE_NAME, 'accepted', COOKIE_DAYS)
    setAccepted(true)
    setVisible(false)
  }

  const decline = () => {
    setCookie(COOKIE_NAME, 'declined', COOKIE_DAYS)
    setVisible(false)
  }

  if (!mounted) return null

  return (
    <>
      {/* ── Google Analytics — only injected after explicit consent ── */}
      {accepted && gaId && (
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

      {/* ── Consent banner ── */}
      <div
        role="dialog"
        aria-label="Cookie consent"
        aria-live="polite"
        className={`
          fixed bottom-5 left-5 z-[60] w-[calc(100vw-2.5rem)] max-w-sm
          rounded-xl border border-xq-border bg-xq-card/98 backdrop-blur-md shadow-xl
          p-4 transition-all duration-500 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        {/* Message */}
        <p className="text-xs text-xq-muted leading-relaxed mb-3">
          We use analytics cookies to understand how visitors use our site.
          No personal data is sold.{' '}
          <Link href="/cookies" className="text-xq-accent hover:underline underline-offset-2">
            Cookie Policy
          </Link>
          {' '}·{' '}
          <Link href="/privacy" className="text-xq-accent hover:underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={accept}
            className="xq-btn-primary text-xs px-4 py-2 flex-1"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="xq-btn-ghost text-xs px-4 py-2 flex-1"
          >
            Decline
          </button>
        </div>
      </div>
    </>
  )
}
