import type { Metadata } from 'next'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'

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

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* GA is intentionally NOT loaded here — CookieBanner injects it only after explicit user consent (GDPR Article 7) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'XQube Studio GmbH',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com',
              description: 'AAA game art and XR production studio. Vienna · Dubai · Dhaka.',
              address: { '@type': 'PostalAddress', streetAddress: 'Rathausstrasse 21/12', addressLocality: 'Vienna', postalCode: '1010', addressCountry: 'AT' },
              contactPoint: { '@type': 'ContactPoint', email: 'info@xqubestudio.com', telephone: '+43 650 5207329' },
              sameAs: ['https://www.linkedin.com/company/xqubestudio', 'https://www.artstation.com/xqubestudio'],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <CookieBanner gaId={GA_ID} />
      </body>
    </html>
  )
}
