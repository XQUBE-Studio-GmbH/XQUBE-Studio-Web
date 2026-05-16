import '../globals.css'
import { getPayload } from 'payload'
import config from '../../../payload/payload.config'
import NavbarClient from '@/components/live-preview/NavbarClient'
import FooterClient from '@/components/live-preview/FooterClient'
import CookieBanner from '@/components/CookieBanner'
import type { NavLink, CtaButton } from '@/components/Navbar'
import type { SiteSettingsGlobal } from '@/components/Footer'

// force-dynamic required because this layout fetches from Payload on every request
// to always reflect the latest published draft of navigation and site-settings.
export const dynamic = 'force-dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavigationGlobal {
  mainNav?:   NavLink[]
  ctaButton?: CtaButton
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function getLayoutData(): Promise<{
  nav:      NavigationGlobal
  settings: SiteSettingsGlobal
}> {
  try {
    const payload = await getPayload({ config })
    const [nav, settings] = await Promise.all([
      payload.findGlobal({ slug: 'navigation' })    as Promise<NavigationGlobal>,
      payload.findGlobal({ slug: 'site-settings' }) as Promise<SiteSettingsGlobal>,
    ])
    return { nav, settings }
  } catch {
    // Graceful fallback — components have their own hardcoded defaults
    return { nav: {}, settings: {} }
  }
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const GA_ID     = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { nav, settings } = await getLayoutData()

  return (
    <>
      {/* Organisation structured data — frontend only */}
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

      {/* NavbarClient uses useLivePreview — updates in real-time when editing
          the navigation global in the Payload admin Live Preview panel */}
      <NavbarClient initialData={nav} serverURL={serverURL} />

      <main className="pt-[72px] relative z-0">{children}</main>

      {/* FooterClient uses useLivePreview — updates in real-time when editing
          the site-settings global in the Payload admin Live Preview panel */}
      <FooterClient initialData={settings} serverURL={serverURL} />

      <CookieBanner gaId={GA_ID} />
    </>
  )
}
