'use client'
import Script from 'next/script'
import { useEffect, useState } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function Analytics() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('xq-cookie-consent')
    if (consent === 'accepted') setConsented(true)

    const handler = (e: CustomEvent) => {
      if (e.detail === 'accepted') setConsented(true)
    }
    window.addEventListener('xq-consent' as any, handler)
    return () => window.removeEventListener('xq-consent' as any, handler)
  }, [])

  if (!GA_ID || !consented) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}
