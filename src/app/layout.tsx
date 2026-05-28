import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'

// Self-host Urbanist via next/font — no external Google Fonts request at runtime.
// This eliminates the render-blocking @import that was in globals.css and saves
// ~1,880ms on FCP/LCP (mobile Lighthouse). The CSS variable --font-urbanist is set
// on <html> so globals.css can reference it without any client-side JS.
const urbanist = Urbanist({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-urbanist',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'),
  title: {
    default: 'XQube Studio | AAA Game Art & XR Production',
    template: '%s | XQube Studio',
  },
  description: 'XQube Studio is a GmbH-registered game art and XR production studio with hubs in Vienna, Dubai, and Dhaka. Delivering AAA-quality assets for game studios worldwide.',
  keywords: ['game art studio', 'outsource game art', 'AAA game assets', 'character art', 'environment art', 'VR assets', 'UEFN Fortnite', 'Vienna game studio'],
  openGraph: {
    type: 'website',
    siteName: 'XQube Studio',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

// Minimal root layout — just the required html/body shell.
// suppressHydrationWarning is needed because Payload's RootLayout injects
// its own data-theme / dir / lang attributes onto <html> at runtime.
// All frontend-specific chrome (CookieBanner, LD-JSON, Navbar, etc.)
// lives in (frontend)/layout.tsx so it never leaks into the admin panel.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={urbanist.variable}>
      <head>
        {/* Warm up the DO Spaces CDN connection before any media requests fire.
            preconnect handles DNS + TCP + TLS in parallel with page parsing,
            reducing LCP latency for hero images and other above-the-fold media. */}
        <link rel="preconnect" href="https://xqube-web-media.fra1.cdn.digitaloceanspaces.com" />
        <link rel="dns-prefetch" href="https://xqube-web-media.fra1.cdn.digitaloceanspaces.com" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
