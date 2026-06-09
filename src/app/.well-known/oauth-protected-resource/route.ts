import { NextResponse } from 'next/server'

/**
 * RFC 9728 — OAuth 2.0 Protected Resource Metadata
 * Declares that XQUBE Studio's public content requires no authentication.
 * AI agents can read all public pages without any OAuth flow.
 */
export function GET() {
  const metadata = {
    resource: 'https://www.xqubestudio.com',
    authorization_servers: [],
    bearer_methods_supported: [],
    resource_documentation: 'https://www.xqubestudio.com/llms.txt',
    resource_signing_alg_values_supported: [],
  }

  return NextResponse.json(metadata, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
