import type { Metadata } from 'next'
import { ContactForm } from '@/components/sections/ContactForm'
import { MapPin, Mail, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with XQube Studio. Book a discovery call or send us a message about your game art or XR project.',
}

const hubs = [
  { city: 'Vienna', country: 'Austria', role: 'Headquarters', flag: '🇦🇹' },
  { city: 'Dubai', country: 'UAE', role: 'MENA Hub', flag: '🇦🇪' },
  { city: 'Dhaka', country: 'Bangladesh', role: 'Production Hub', flag: '🇧🇩' },
]

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-xqube">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="tag-xqube mb-4 inline-block">Get In Touch</span>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
            Let's build<br />
            <span className="text-[#14CB72]">together</span>
          </h1>
          <p className="text-[#8D95A8] text-lg leading-relaxed">
            Tell us about your project. We respond to all inquiries within 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Direct Contact */}
            <div className="card-xqube p-6">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-[#14CB72] mb-4">Direct Contact</h3>
              <a
                href="mailto:info@xqubestudio.com"
                className="flex items-center gap-3 text-[#C4CAD8] hover:text-white transition-colors mb-4"
              >
                <Mail className="w-4 h-4 text-[#14CB72]" />
                info@xqubestudio.com
              </a>
              <a
                href="https://calendly.com/tanvirkhandlxqsmgs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center"
              >
                Book Discovery Call
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Studio Hubs */}
            <div className="card-xqube p-6">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-[#14CB72] mb-4">Our Studios</h3>
              <div className="space-y-4">
                {hubs.map((hub) => (
                  <div key={hub.city} className="flex items-start gap-3">
                    <span className="text-lg">{hub.flag}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{hub.city}, {hub.country}</div>
                      <div className="text-xs text-[#8D95A8]">{hub.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EU Trust */}
            <div className="card-xqube p-6 border-[#14CB72]/20">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-[#14CB72] mb-3">EU Registered</h3>
              <p className="text-xs text-[#8D95A8] leading-relaxed">
                XQube Studio GmbH is registered in Vienna, Austria. Full GDPR compliance, clear IP ownership transfer, and EU-standard contracts on all engagements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
