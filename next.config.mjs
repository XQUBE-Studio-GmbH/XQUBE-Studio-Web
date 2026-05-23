import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Tell webpack NOT to bundle these server-only packages — require them at
  // runtime instead. Prevents "Can't resolve 'crypto'" and similar Node.js
  // built-in errors that occur when Payload / drizzle / postgres packages
  // are accidentally pulled into the webpack graph (e.g. via instrumentation.ts).
  async headers() {
    return [
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
