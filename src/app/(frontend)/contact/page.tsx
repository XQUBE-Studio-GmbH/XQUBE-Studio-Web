'use client'
import type { Metadata } from 'next'
import { useState } from 'react'
import Link from 'next/link'

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
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="xq-section">
      <div className="xq-container">
        <div className="max-w-2xl mx-auto">
          <div className="xq-label mb-4">Get in Touch</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Let's talk about your project
          </h1>
          <p className="text-xq-muted mb-10">
            Fill out the form below and we'll get back to you within 24–48 hours.
            Or book a call directly if you'd like to speak sooner.
          </p>

          <div className="mb-8">
            <Link
              href="https://calendly.com/tanvirkhandlxqsmgs"
              target="_blank"
              rel="noopener noreferrer"
              className="xq-btn-primary"
            >
              Book a Discovery Call
            </Link>
          </div>

          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-xq-border" />
            <span className="text-xq-muted text-sm">or send a message</span>
            <div className="flex-1 h-px bg-xq-border" />
          </div>

          {status === 'success' ? (
            <div className="xq-card text-center py-12">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-white font-bold text-xl mb-2">Message sent</h3>
              <p className="text-xq-muted">We'll be in touch within 24–48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-xq-muted mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="xq-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-xq-muted mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="xq-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-xq-muted mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  className="xq-input resize-none"
                  placeholder="Tell us about your project..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              {status === 'error' && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please email us directly at{' '}
                  <a href="mailto:info@xqubestudio.com" className="text-xq-accent">info@xqubestudio.com</a>
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="xq-btn-primary w-full justify-center py-4 disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
