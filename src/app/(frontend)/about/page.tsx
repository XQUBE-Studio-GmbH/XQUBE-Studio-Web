import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About XQube Studio',
  description: 'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria, with production hubs in Dubai and Dhaka.',
}

const hubs = [
  { city: 'Vienna', country: 'Austria', role: 'HQ — Business, Legal, Client-Facing', flag: '🇦🇹' },
  { city: 'Dubai',  country: 'UAE',     role: 'MENA Hub — Regional BD & Partnerships', flag: '🇦🇪' },
  { city: 'Dhaka',  country: 'Bangladesh', role: 'Production Hub — Core Delivery', flag: '🇧🇩' },
]

export default function AboutPage() {
  return (
    <>
      <section className="xq-section">
        <div className="xq-container">
          <div className="max-w-3xl">
            <div className="xq-label mb-4">About Us</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              A studio built for precision
            </h1>
            <p className="text-xq-muted text-lg leading-relaxed mb-6">
              XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria.
              We work with game studios worldwide to deliver AAA-quality assets — from characters and
              environments to full XR experiences.
            </p>
            <p className="text-xq-muted text-lg leading-relaxed">
              Our three-hub model combines European business standards with world-class production
              capability — giving clients the best of both: reliability and quality, at scale.
            </p>
          </div>
        </div>
      </section>

      {/* Hubs */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container">
          <div className="xq-label mb-4">Our Hubs</div>
          <h2 className="text-3xl font-black text-white mb-12">Global presence, unified delivery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hubs.map((hub) => (
              <div key={hub.city} className="xq-card">
                <div className="text-4xl mb-4">{hub.flag}</div>
                <h3 className="text-xl font-bold text-white mb-1">{hub.city}</h3>
                <p className="text-xq-accent text-sm font-semibold mb-3">{hub.country}</p>
                <p className="text-xq-muted text-sm">{hub.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EU credentials */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="xq-label mb-4">Why XQube</div>
            <h2 className="text-3xl font-black text-white mb-6">Built for serious studios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
              {[
                { title: 'GmbH Registered', body: 'Austrian GmbH registration gives EU clients a legally reliable, GDPR-compliant partner.' },
                { title: 'IP Ownership Clear', body: 'Full IP transfer on all deliverables. No ambiguity, no licensing traps. Your assets, your rights.' },
                { title: 'Engine Agnostic', body: 'Unreal, Unity, Godot, UEFN. We match your pipeline, not the other way around.' },
              ].map((item) => (
                <div key={item.title} className="xq-card">
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-xq-muted text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="xq-section border-t border-xq-border">
        <div className="xq-container text-center">
          <h2 className="text-3xl font-black text-white mb-6">Ready to work together?</h2>
          <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
            className="xq-btn-primary text-base px-8 py-4">
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </>
  )
}
