import { NextResponse } from 'next/server'

/**
 * RFC 8414 — OAuth 2.0 Authorization Server Metadata
 * XQUBE Studio does not operate an OAuth authorization server.
 * This minimal document signals to AI agents that the site is
 * a public resource requiring no OAuth flow.
 */
export function GET() {
  const metadata = {
    issuer: 'https://www.xqubestudio.com',
    service_documentation: 'https://www.xqubestudio.com/llms.txt',
  }

  return NextResponse.json(metadata, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
