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
      payload.findGlobal({ slug: 'navigation' })                    as Promise<NavigationGlobal>,
      payload.findGlobal({ slug: 'site-settings', depth: 1 })      as Promise<SiteSettingsGlobal>,
    ])
    return { nav, settings }
  } catch {
    // Graceful fallback — components have their own hardcoded defaults
    return { nav: {}, settings: {} }
  }
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const GA_ID     = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { nav, settings } = await getLayoutData()

  return (
    <>
      {/* Consent Mode v2 — default state MUST be set before gtag.js loads.
          Inline script runs synchronously during SSR/hydration, before any
          afterInteractive Script tags fire. All signals denied until the user
          explicitly accepts in the CookieBanner. */}
      {GA_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: [
              'window.dataLayer=window.dataLayer||[];',
              'function gtag(){dataLayer.push(arguments);}',
              "gtag('consent','default',{",
              "  analytics_storage:'denied',",
              "  ad_storage:'denied',",
              "  ad_user_data:'denied',",
              "  ad_personalization:'denied',",
              '  wait_for_update:500',
              '});',
            ].join(''),
          }}
        />
      )}

      {/* Organisation + WebSite structured data — applied to every frontend page.
          Organization pulls live contact/social data from the site-settings global.
          WebSite enables sitelinks search box eligibility in Google. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'XQUBE Studio GmbH',
            url: serverURL,
            logo: `${serverURL}/logo.svg`,
            description: 'AAA game art and XR production studio. Vienna · Dubai · Dhaka.',
            address: {
              '@type':           'PostalAddress',
              streetAddress:     'Rathausstrasse 21/12',
              addressLocality:   'Vienna',
              postalCode:        '1010',
              addressCountry:    'AT',
            },
            contactPoint: {
              '@type':      'ContactPoint',
              email:        settings.contact?.email      || 'info@xqubestudio.com',
              telephone:    settings.contact?.phone      || '+43 650 5207329',
              contactType:  'customer service',
            },
            sameAs: settings.contact?.socialLinks?.map((l) => l.url).filter(Boolean) ?? [
              'https://www.linkedin.com/company/xqubestudio',
              'https://www.artstation.com/xqubestudio',
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'WebSite',
            name:       'XQUBE Studio',
            url:        serverURL,
          }),
        }}
      />

      {/* NavbarClient uses useLivePreview — updates in real-time when editing
          the navigation global in the Payload admin Live Preview panel */}
      <NavbarClient initialData={nav} serverURL={serverURL} socialLinks={settings.contact?.socialLinks} />

      <main className="pt-[72px] relative z-0">{children}</main>

      {/* FooterClient uses useLivePreview — updates in real-time when editing
          the site-settings global in the Payload admin Live Preview panel */}
      <FooterClient initialData={settings} navLinks={nav.mainNav} serverURL={serverURL} />

      <CookieBanner gaId={GA_ID} />
    </>
  )
}
