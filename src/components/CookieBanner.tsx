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
          fixed bottom-0 left-0 right-0 z-[60]
          border-t border-xq-border bg-xq-card/98 backdrop-blur-md
          transition-transform duration-500 ease-out
          ${visible ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="xq-container py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            {/* Message */}
            <p className="text-sm text-xq-muted leading-relaxed max-w-2xl">
              We use analytics cookies to understand how visitors use our site and to improve it.
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
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={decline}
                className="xq-btn-ghost text-sm px-5 py-2.5"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="xq-btn-primary text-sm px-5 py-2.5"
              >
                Accept Analytics
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
