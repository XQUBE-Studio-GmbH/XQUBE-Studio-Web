import type { Metadata } from 'next'

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
}

// Minimal root layout — just the required html/body shell.
// suppressHydrationWarning is needed because Payload's RootLayout injects
// its own data-theme / dir / lang attributes onto <html> at runtime.
// All frontend-specific chrome (CookieBanner, LD-JSON, Navbar, etc.)
// lives in (frontend)/layout.tsx so it never leaks into the admin panel.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
