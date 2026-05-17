import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
              'https://xqube-studio-web.vercel.app',
              'https://www.xqubestudio.com',
            ].join(' '),
          },
        ],
      },
    ]
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
