'use client'
import { useEffect, useState } from 'react'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('xq-cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const respond = (choice: 'accepted' | 'declined') => {
    localStorage.setItem('xq-cookie-consent', choice)
    setVisible(false)
    window.dispatchEvent(new CustomEvent('xq-consent', { detail: choice }))
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-up">
      <div className="max-w-4xl mx-auto bg-xq-card border border-xq-border rounded-xq-lg p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-xq-light">
            We use cookies to analyze site traffic via Google Analytics.{' '}
            <a href="/privacy" className="text-xq-accent hover:underline">Privacy Policy</a>
          </p>
          <p className="text-xs text-xq-muted mt-1">
            Required by EU law (GDPR) for XQube Studio GmbH, Vienna.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => respond('declined')}
            className="xq-btn-ghost text-sm px-4 py-2"
          >
            Decline
          </button>
          <button
            onClick={() => respond('accepted')}
            className="xq-btn-primary text-sm px-4 py-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
