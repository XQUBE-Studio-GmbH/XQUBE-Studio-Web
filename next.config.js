/** @type {import('next').NextConfig} */
const { withPayload } = require('@payloadcms/next-payload')

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.artstation.com' },
      { protocol: 'https', hostname: '**.artstation.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@payloadcms/db-postgres', 'payload'],
  },
}

module.exports = withPayload(nextConfig, {
  configPath: './payload/payload.config.ts',
})
