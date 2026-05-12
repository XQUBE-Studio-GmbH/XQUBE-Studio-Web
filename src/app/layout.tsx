import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import '../styles/globals.css'
import { Navbar }           from '@/components/layout/Navbar'
import { Footer }           from '@/components/layout/Footer'
import { CookieBanner }     from '@/components/ui/CookieBanner'
import { Analytics }        from '@/components/ui/Analytics'
import { getSiteSettings }  from '@/lib/payload'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300','400','500','600','700','800','900'],
  display: 'swap',
  variable: '--font-urbanist',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const seo = settings?.defaultSeo

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'),
    title: {
      default:  seo?.title  || 'XQube Studio | AAA Game Art & XR Production',
      template: '%s | XQube Studio',
    },
    description: seo?.description || 'XQube Studio is a GmbH-registered game art and XR production studio with hubs in Vienna, Dubai, and Dhaka.',
    keywords: [
      'game art studio', 'outsource game art', 'AAA game assets',
      'character art outsourcing', 'environment art', 'weapon art',
      'VR assets', 'UEFN Fortnite assets', 'XR studio', 'digital twins',
      'Vienna game studio', 'EU game art studio',
    ],
    authors:   [{ name: 'XQube Studio GmbH' }],
    creator:   'XQube Studio GmbH',
    publisher: 'XQube Studio GmbH',
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    openGraph: {
      type:        'website',
      siteName:    'XQube Studio',
      locale:      'en_US',
      url:         process.env.NEXT_PUBLIC_SITE_URL,
      title:       seo?.title || 'XQube Studio | AAA Game Art & XR Production',
      description: seo?.description,
      images:      seo?.ogImage ? [{ url: seo.ogImage.url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title:       seo?.title || 'XQube Studio',
      description: seo?.description,
    },
    alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL },
    icons:      { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
    manifest:   '/site.webmanifest',
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }
}

function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:       'XQube Studio GmbH',
    url:        'https://www.xqubestudio.com',
    logo:       'https://www.xqubestudio.com/logo.png',
    description: 'AAA game art and XR production studio with hubs in Vienna, Dubai, and Dhaka.',
    address: { '@type': 'PostalAddress', addressLocality: 'Vienna', addressCountry: 'AT' },
    contactPoint: { '@type': 'ContactPoint', email: 'info@xqubestudio.com', contactType: 'customer service' },
    sameAs: [
      'https://www.linkedin.com/company/xqubestudio',
      'https://www.artstation.com/xqubestudio',
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={urbanist.variable}>
      <head><OrganizationSchema /></head>
      <body className={`${urbanist.className} bg-xq-bg text-xq-light antialiased`}>
        <Analytics />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
