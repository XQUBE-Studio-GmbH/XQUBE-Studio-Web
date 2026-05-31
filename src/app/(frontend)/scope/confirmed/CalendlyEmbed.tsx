'use client'

import { useEffect } from 'react'

const CALENDLY_URL = 'https://calendly.com/tanvirkhandlxqsmgs'

export default function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src   = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div
      className="calendly-inline-widget w-full rounded-lg overflow-hidden border border-xq-border"
      data-url={`${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0e0e0e&text_color=c4cad8&primary_color=14cb72`}
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}
