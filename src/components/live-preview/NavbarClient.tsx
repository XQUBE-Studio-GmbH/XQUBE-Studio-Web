'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import Navbar from '@/components/Navbar'
import type { NavLink, CtaButton } from '@/components/Navbar'

interface NavigationGlobal {
  mainNav?:   NavLink[]
  ctaButton?: CtaButton
}

interface Props {
  initialData: NavigationGlobal
  serverURL:   string
}

// Wraps Navbar with useLivePreview so edits to the navigation global in the
// Payload admin Live Preview panel update the navbar in the iframe in real-time.
// On the live site (outside the admin iframe) useLivePreview simply returns
// initialData — no runtime overhead.
export default function NavbarClient({ initialData, serverURL }: Props) {
  const { data: nav } = useLivePreview<NavigationGlobal>({
    initialData,
    serverURL: typeof window !== 'undefined'
      ? (window !== window.parent && document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin)
      : serverURL,
    depth: 0,
  })

  return (
    <Navbar
      navLinks={nav.mainNav}
      ctaButton={nav.ctaButton}
    />
  )
}
