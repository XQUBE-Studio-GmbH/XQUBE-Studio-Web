import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Tell webpack NOT to bundle these server-only packages — require them at
  // runtime instead. Prevents "Can't resolve 'crypto'" and similar Node.js
  // built-in errors that occur when Payload / drizzle / postgres packages
  // are accidentally pulled into the webpack graph (e.g. via instrumentation.ts).
  async rewrites() {
    // When a client sends Accept: text/markdown, rewrite the request to the
    // corresponding /path/index.md route handler which returns Content-Type:
    // text/markdown explicitly. This satisfies [C1] content negotiation.
    // Rewrites run at Next.js routing level — more reliable than middleware for
    // header-based routing, and does not change the URL seen by the client.
    const mdAccept = [{ type: 'header', key: 'accept', value: '(.*text/markdown.*)' }]
    return [
      { source: '/',          has: mdAccept, destination: '/index.md' },
      { source: '/about',     has: mdAccept, destination: '/about/index.md' },
      { source: '/services',  has: mdAccept, destination: '/services/index.md' },
      { source: '/portfolio', has: mdAccept, destination: '/portfolio/index.md' },
      { source: '/contact',   has: mdAccept, destination: '/contact/index.md' },
      { source: '/blog',      has: mdAccept, destination: '/blog/index.md' },
    ]
  },

  async redirects() {
    return [
      // ── Canonical domain — non-www → www ─────────────────────────────────
      // Prevents Google treating xqubestudio.com and www.xqubestudio.com as duplicates.
      {
        source:      '/:path*',
        has:         [{ type: 'host', value: 'xqubestudio.com' }],
        destination: 'https://www.xqubestudio.com/:path*',
        permanent:   true,
      },

      // ── Old Wix pages ─────────────────────────────────────────────────────
      // Google indexed /aboutus — correct URL is /about
      { source: '/aboutus',  destination: '/about', permanent: true },
      // /xkit — scrapped Wix page, was returning 403; redirect to homepage
      { source: '/xkit',     destination: '/',      permanent: true },
      // /blank and /blank-2 — leftover Wix dev pages; redirect to homepage
      { source: '/blank',    destination: '/',      permanent: true },
      { source: '/blank-2',  destination: '/',      permanent: true },
    ]
  },

  async headers() {
    return [
      {
        // Serve .md files with the correct MIME type so AI crawlers receive
        // text/markdown (not text/plain or application/octet-stream).
        // Applies to /index.md, /about/index.md, /services/index.md, etc.
        // Regex pattern is unambiguous for files with extensions.
        source: '/(.*\\.md)',
        headers: [
          { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
        ],
      },
      {
        // Allow Payload admin (on any domain/origin) to embed frontend pages in the live-preview iframe.
        // CSP frame-ancestors supersedes X-Frame-Options in modern browsers.
        // 'self' covers same-origin access; the two explicit origins cover cross-domain admin access.
        source: '/((?!admin).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "frame-ancestors 'self'",
              // Allow the Vercel deployment URL (stable production alias)
              'https://xqube-studio-web.vercel.app',
              // Allow the custom domain once it goes live
              process.env.NEXT_PUBLIC_SITE_URL,
            ].filter(Boolean).join(' '),
          },
          {
            // D3: Link header for AI/agent discovery (AIScan rubric)
            // rel=api-catalog points to RFC 9727 catalog; rel=describedby points to llms.txt
            key: 'Link',
            value: [
              '</.well-known/api-catalog>; rel="api-catalog"',
              '</llms.txt>; rel="describedby"; type="text/markdown"',
            ].join(', '),
          },
        ],
      },
    ]
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Node.js built-ins pulled in by Payload/drizzle/pg packages must not be
      // bundled for the browser — set them to false (empty module) instead.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        fs:     false,
        path:   false,
        os:     false,
        net:    false,
        tls:    false,
        dns:    false,
        child_process: false,
      }
    }
    return config
  },

  images: {
    // Bypass /_next/image — images are already WebP on DO Spaces CDN.
    // Vercel free plan quota (~1,000 unique source URLs/month) was exceeded
    // after migrating 199 images to .webp URLs, causing HTTP 402 errors.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.artstation.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.digitaloceanspaces.com' },     // origin
      { protocol: 'https', hostname: '**.cdn.digitaloceanspaces.com' }, // CDN endpoint
    ],
  },
}

export default withPayload(nextConfig)
