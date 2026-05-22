'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import Footer from '@/components/Footer'
import type { SiteSettingsGlobal } from '@/components/Footer'
import type { NavLink } from '@/components/Navbar'

interface Props {
  initialData: SiteSettingsGlobal
  navLinks?:   NavLink[]
  serverURL:   string
}

// Wraps Footer with useLivePreview so edits to the site-settings global in the
// Payload admin Live Preview panel update the footer in the iframe in real-time.
// On the live site (outside the admin iframe) useLivePreview simply returns
// initialData — no runtime overhead.
export default function FooterClient({ initialData, navLinks, serverURL }: Props) {
  const { data: settings } = useLivePreview<SiteSettingsGlobal>({
    initialData,
    serverURL: typeof window !== 'undefined'
      ? (window !== window.parent && document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin)
      : serverURL,
    depth: 1,
  })

  return <Footer settings={settings} navLinks={navLinks} />
}
