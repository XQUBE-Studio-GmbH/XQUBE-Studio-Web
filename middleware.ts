import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Content negotiation — serve Markdown when:
 *   - Client sends Accept: text/markdown header, OR
 *   - Client appends ?format=md query param
 *
 * Rewrites to the corresponding /path/index.md static file in public/.
 * Supports C1 of the AIScan AI agent-readiness rubric.
 */

const MD_MAP: Record<string, string> = {
  '/':          '/index.md',
  '/about':     '/about/index.md',
  '/services':  '/services/index.md',
  '/portfolio': '/portfolio/index.md',
  '/contact':   '/contact/index.md',
  '/blog':      '/blog/index.md',
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const accept = request.headers.get('accept') ?? ''
  const wantsMarkdown =
    accept.includes('text/markdown') || searchParams.get('format') === 'md'

  if (wantsMarkdown) {
    const mdPath = MD_MAP[pathname]
    if (mdPath) {
      const url = request.nextUrl.clone()
      url.pathname = mdPath
      url.searchParams.delete('format')
      const response = NextResponse.rewrite(url)
      response.headers.set('Content-Type', 'text/markdown; charset=utf-8')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  // Only run on the pages that have corresponding .md files.
  // Excludes /admin, /api, /_next, and static assets automatically.
  matcher: ['/', '/about', '/services', '/portfolio', '/contact', '/blog'],
}
