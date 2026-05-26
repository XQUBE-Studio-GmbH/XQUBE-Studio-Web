'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ContactInfo, ContactPageCopy } from './page'

const PROJECT_TYPES = [
  { value: '', label: 'Select project type' },
  { value: 'game-art-production', label: 'Game Art Production' },
  { value: 'vr-xr-assets',        label: 'VR / XR Assets' },
  { value: 'interactive-dev',      label: 'Interactive Development' },
  { value: 'staff-augmentation',   label: 'Staff Augmentation' },
  { value: 'full-game-production', label: 'Full Game Production' },
  { value: 'other',                label: 'Other / Not Sure Yet' },
]

const ENGINES = [
  { value: '', label: 'Select engine / platform' },
  { value: 'unreal-engine-5',  label: 'Unreal Engine 5' },
  { value: 'unity',            label: 'Unity' },
  { value: 'uefn-fortnite',    label: 'UEFN / Fortnite' },
  { value: 'roblox',           label: 'Roblox' },
  { value: 'godot',            label: 'Godot' },
  { value: 'custom-engine',    label: 'Custom / Proprietary Engine' },
  { value: 'vr-platform',      label: 'VR Platform (Meta Quest, PSVR, etc.)' },
  { value: 'not-sure',         label: 'Not Sure Yet' },
]

const BUDGETS = [
  { value: '', label: 'Select budget range' },
  { value: 'under-10k',   label: 'Under $10K' },
  { value: '10k-50k',     label: '$10K – $50K' },
  { value: '50k-150k',    label: '$50K – $150K' },
  { value: '150k-500k',   label: '$150K – $500K' },
  { value: '500k-plus',   label: '$500K+' },
  { value: 'not-sure',    label: 'Not Sure Yet' },
]

const TIMELINES = [
  { value: '', label: 'Select timeline' },
  { value: 'asap',         label: 'ASAP — we need to start immediately' },
  { value: '1-3-months',   label: '1–3 months' },
  { value: '3-6-months',   label: '3–6 months' },
  { value: '6-12-months',  label: '6–12 months' },
  { value: '12-plus',      label: '12+ months (ongoing)' },
  { value: 'exploring',    label: 'Just exploring options' },
]

interface FormState {
  name: string
  email: string
  company: string
  projectType: string
  engine: string
  budget: string
  timeline: string
  message: string
}

export default function ContactForm({ contactInfo: ci, pageCopy: pc }: { contactInfo: ContactInfo; pageCopy: ContactPageCopy }) {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', company: '', projectType: '', engine: '', budget: '', timeline: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

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
      if (res.ok) setForm({ name: '', email: '', company: '', projectType: '', engine: '', budget: '', timeline: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="xq-section">
      <div className="xq-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 max-w-6xl">

          {/* Left — Info */}
          <div>
            {/* label/heading/subtext are suppressed when the page shows a banner hero above */}
            {pc.label    && <div className="xq-label mb-4">{pc.label}</div>}
            {pc.heading  && (
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">
                {pc.heading}
              </h1>
            )}
            {pc.subtext  && <p className="text-xq-muted mb-10 leading-relaxed">{pc.subtext}</p>}

            <Link
              href={ci.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="xq-btn-primary mb-10 w-full justify-center"
            >
              {pc.calendlyLabel}
            </Link>

            {pc.image?.url && (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-xq-border mb-10">
                <Image src={pc.image.url} alt={pc.image.alt || 'XQube Studio'} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            )}

            <div className="space-y-4 mt-10">
              {[
                { label: 'Email',      value: ci.email,      href: `mailto:${ci.email}` },
                { label: 'Phone',      value: ci.phone,      href: `tel:${ci.phone.replace(/\s/g, '')}` },
                { label: 'Address',    value: ci.address,    href: null },
                { label: 'LinkedIn',   value: ci.linkedin.replace('https://www.', '').replace('https://', ''),   href: ci.linkedin },
                { label: 'ArtStation', value: ci.artstation.replace('https://www.', '').replace('https://', ''), href: ci.artstation },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 border-b border-xq-border pb-4">
                  <div className="text-xq-muted text-sm w-20 sm:w-24 shrink-0">{item.label}</div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-white hover:text-xq-accent transition-colors"
                    >
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
            <div className="xq-label mb-6">Send a project brief</div>

            {status === 'success' ? (
              <div className="xq-card text-center py-12">
                <div className="text-4xl mb-4 text-xq-accent">✓</div>
                <h3 className="text-white font-bold text-xl mb-2">Brief received</h3>
                <p className="text-xq-muted">We'll be in touch within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-xq-muted mb-2">Name <span className="text-xq-accent">*</span></label>
                    <input type="text" required className="xq-input" placeholder="Your name"
                      value={form.name} onChange={set('name')} />
                  </div>
                  <div>
                    <label className="block text-sm text-xq-muted mb-2">Work Email <span className="text-xq-accent">*</span></label>
                    <input type="email" required className="xq-input" placeholder="you@studio.com"
                      value={form.email} onChange={set('email')} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-xq-muted mb-2">Studio / Company</label>
                  <input type="text" className="xq-input" placeholder="Your studio or company name"
                    value={form.company} onChange={set('company')} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-xq-muted mb-2">Project Type</label>
                    <select className="xq-input" value={form.projectType} onChange={set('projectType')}>
                      {PROJECT_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-xq-muted mb-2">Engine / Platform</label>
                    <select className="xq-input" value={form.engine} onChange={set('engine')}>
                      {ENGINES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-xq-muted mb-2">Budget Range</label>
                    <select className="xq-input" value={form.budget} onChange={set('budget')}>
                      {BUDGETS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-xq-muted mb-2">Timeline</label>
                    <select className="xq-input" value={form.timeline} onChange={set('timeline')}>
                      {TIMELINES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-xq-muted mb-2">Project Brief <span className="text-xq-accent">*</span></label>
                  <textarea required rows={5} className="xq-input resize-none"
                    placeholder="Describe your project — what you're building, the style direction, asset types, and any pipeline requirements..."
                    value={form.message} onChange={set('message')} />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-sm">
                    Something went wrong. Email us directly at{' '}
                    <a href={`mailto:${ci.email}`} className="text-xq-accent">{ci.email}</a>
                  </p>
                )}

                <button type="submit" disabled={status === 'loading'}
                  className="xq-btn-primary w-full justify-center py-4 disabled:opacity-50">
                  {status === 'loading' ? 'Sending...' : 'Send Project Brief'}
                </button>

                <p className="text-xq-muted text-xs text-center">
                  We respond to every qualified inquiry within 24–48 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
