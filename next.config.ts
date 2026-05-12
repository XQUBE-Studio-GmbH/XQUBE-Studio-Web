import { withPayload } from '@payloadcms/next'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.artstation.com' },
      { protocol: 'https', hostname: 'cdnb.artstation.com' },
      { protocol: 'https', hostname: 'cdna.artstation.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
    ],
  },
}

export default withPayload(nextConfig)
