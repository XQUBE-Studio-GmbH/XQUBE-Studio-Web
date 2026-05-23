// Shared JSON-LD schema helpers.
// Used by server components — no 'use client' directive.

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'

export const LOGO_URL = `${BASE_URL}/logo.svg`

export const ORG_REF = {
  '@type': 'Organization',
  name:    'XQUBE Studio',
  url:     BASE_URL,
} as const

// Builds a BreadcrumbList schema object (include @context — standalone script tag).
export function buildBreadcrumbList(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type':    'ListItem',
      position:  i + 1,
      name:       item.name,
      item:       item.url,
    })),
  }
}
