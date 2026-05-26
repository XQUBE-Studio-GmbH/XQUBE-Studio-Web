'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
  error:  Error & { digest?: string }
  reset:  () => void
}

/**
 * Top-level error boundary for all frontend routes.
 * Catches any unhandled runtime error (DB down, Payload throw, bad data, etc.)
 * and renders a branded fallback instead of Next.js's raw crash screen.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to console so errors are visible in Vercel runtime logs
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="xq-container">
        <div className="max-w-lg mx-auto text-center">
          {/* Label */}
          <div className="xq-label mb-6">Something went wrong</div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Unexpected<br />
            <span className="text-xq-accent">Error</span>
          </h1>

          {/* Message */}
          <p className="text-xq-muted text-lg mb-10 leading-relaxed">
            We hit an unexpected issue on our end. Try refreshing — if the
            problem persists, drop us a message.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="xq-btn-primary text-sm px-6 py-3"
            >
              Try again
            </button>
            <Link href="/" className="xq-btn-ghost text-sm px-6 py-3">
              Go home
            </Link>
            <Link href="/contact" className="xq-btn-ghost text-sm px-6 py-3">
              Contact us
            </Link>
          </div>

          {/* Digest for debugging — only shown in dev */}
          {process.env.NODE_ENV === 'development' && error.digest && (
            <p className="mt-8 text-xs text-xq-muted font-mono opacity-50">
              digest: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
