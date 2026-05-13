'use client'
import { useState } from 'react'
import Link from 'next/link'

const contactInfo = [
  { label: 'Email',    value: 'info@xqubestudio.com',          href: 'mailto:info@xqubestudio.com' },
  { label: 'Phone',    value: '+43 650 5207329',                href: 'tel:+436505207329' },
  { label: 'Address',  value: 'Rathausstrasse 21/12, 1010 Vienna, Austria', href: null },
  { label: 'LinkedIn', value: 'linkedin.com/company/xqubestudio', href: 'https://www.linkedin.com/company/xqubestudio' },
  { label: 'ArtStation', value: 'artstation.com/xqubestudio',  href: 'https://www.artstation.com/xqubestudio' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="xq-section">
      <div className="xq-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl">

          {/* Left — Info */}
          <div>
            <div className="xq-label mb-4">Get in Touch</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              Let's talk about your project
            </h1>
            <p className="text-xq-muted mb-10 leading-relaxed">
              Book a discovery call for a scoped conversation, or fill out the form and we'll
              respond within 24–48 hours.
            </p>

            <Link
              href="https://calendly.com/tanvirkhandlxqsmgs"
              target="_blank"
              rel="noopener noreferrer"
              className="xq-btn-primary mb-10 w-full justify-center"
            >
              Book a Discovery Call
            </Link>

            <div className="space-y-4 mt-10">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex gap-4 border-b border-xq-border pb-4">
                  <div className="text-xq-muted text-sm w-24 shrink-0">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-white hover:text-xq-accent transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm text-white">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <div className="xq-label mb-6">Or send a message</div>

            {status === 'success' ? (
              <div className="xq-card text-center py-12">
                <div className="text-4xl mb-4 text-xq-accent">✓</div>
                <h3 className="text-white font-bold text-xl mb-2">Message sent</h3>
                <p className="text-xq-muted">We'll be in touch within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-xq-muted mb-2">Name</label>
                  <input type="text" required className="xq-input" placeholder="Your name"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-xq-muted mb-2">Email</label>
                  <input type="email" required className="xq-input" placeholder="your@email.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-xq-muted mb-2">Message</label>
                  <textarea required rows={5} className="xq-input resize-none"
                    placeholder="Tell us about your project, timeline, and what you're looking for..."
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                {status === 'error' && (
                  <p className="text-red-400 text-sm">
                    Something went wrong. Email us directly at{' '}
                    <a href="mailto:info@xqubestudio.com" className="text-xq-accent">info@xqubestudio.com</a>
                  </p>
                )}
                <button type="submit" disabled={status === 'loading'}
                  className="xq-btn-primary w-full justify-center py-4 disabled:opacity-50">
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
