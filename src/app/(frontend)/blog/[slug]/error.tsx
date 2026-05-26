'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary for individual blog post pages.
 * Handles missing slugs, unpublished posts, or DB errors on this route.
 */
export default function BlogSlugError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[BlogSlugError]', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="xq-container">
        <div className="max-w-lg mx-auto text-center">
          <div className="xq-label mb-6">Blog</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Post not<br />
            <span className="text-xq-accent">found</span>
          </h1>
          <p className="text-xq-muted text-lg mb-10 leading-relaxed">
            This article may have been moved or is no longer available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={reset} className="xq-btn-primary text-sm px-6 py-3">
              Try again
            </button>
            <Link href="/blog" className="xq-btn-ghost text-sm px-6 py-3">
              View all posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
