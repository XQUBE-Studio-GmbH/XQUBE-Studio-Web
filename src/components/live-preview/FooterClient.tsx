'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import Footer from '@/components/Footer'
import type { SiteSettingsGlobal } from '@/components/Footer'

interface Props {
  initialData: SiteSettingsGlobal
  serverURL:   string
}

// Wraps Footer with useLivePreview so edits to the site-settings global in the
// Payload admin Live Preview panel update the footer in the iframe in real-time.
// On the live site (outside the admin iframe) useLivePreview simply returns
// initialData — no runtime overhead.
export default function FooterClient({ initialData, serverURL }: Props) {
  const { data: settings } = useLivePreview<SiteSettingsGlobal>({
    initialData,
    serverURL,
    depth: 0,
  })

  return <Footer settings={settings} />
}
