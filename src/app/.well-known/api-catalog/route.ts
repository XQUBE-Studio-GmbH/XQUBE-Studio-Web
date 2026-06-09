import { NextResponse } from 'next/server'

/**
 * RFC 9727 — API Catalog
 * Describes the machine-readable resources published by XQUBE Studio.
 * Expressed as an RFC 9264 Linkset document.
 */
export function GET() {
  const catalog = {
    linkset: [
      {
        anchor: 'https://www.xqubestudio.com',
        describedby: [
          {
            href: 'https://www.xqubestudio.com/llms.txt',
            type: 'text/markdown',
            title: 'LLM-readable site description (llmstxt.org)',
          },
          {
            href: 'https://www.xqubestudio.com/sitemap.xml',
            type: 'application/xml',
            title: 'XML sitemap',
          },
        ],
        'service-desc': [
          {
            href: 'https://www.xqubestudio.com/robots.txt',
            type: 'text/plain',
            title: 'Crawl rules including AI bot directives',
          },
        ],
      },
    ],
  }

  return NextResponse.json(catalog, {
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
