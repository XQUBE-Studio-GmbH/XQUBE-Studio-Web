import type { Metadata } from 'next'
import CalendlyEmbed from './CalendlyEmbed'

export const metadata: Metadata = {
  title:  'Brief Received — XQube Studio',
  robots: { index: false },
}

export default function ScopeConfirmedPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-xq-bg">
      <div className="xq-container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">

          {/* ── Confirmation message ── */}
          <div className="mb-12">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-[#0a1f14] border border-xq-accent flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="#14CB72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <p className="text-xs font-semibold tracking-widest uppercase text-xq-accent mb-3">
              Brief received
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Got your brief. We'll be in touch<br className="hidden sm:block" /> within 24 hours.
            </h1>
            <p className="text-xq-muted text-base leading-relaxed">
              Your project brief has been sent to our team. We review every submission and typically
              respond within one business day.
            </p>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-xq-border mb-10" />

          {/* ── Calendly section ── */}
          <div className="mb-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-xq-accent mb-2">
              Want to speak sooner?
            </p>
            <h2 className="text-xl font-bold text-white mb-1">
              Book a 30-minute call.
            </h2>
            <p className="text-xq-muted text-sm mb-6">
              Skip the back-and-forth — pick a time and we'll scope your project together live.
            </p>
          </div>

          <CalendlyEmbed />

        </div>
      </div>
    </div>
  )
}
