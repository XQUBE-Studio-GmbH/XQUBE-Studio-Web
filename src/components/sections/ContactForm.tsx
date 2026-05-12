'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to send')
      setState('success')
      form.reset()
    } catch (err) {
      setState('error')
      setErrorMessage('Something went wrong. Please email us directly at info@xqubestudio.com')
    }
  }

  if (state === 'success') {
    return (
      <div className="card-xqube p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
        <CheckCircle className="w-12 h-12 text-[#14CB72] mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Message Received</h3>
        <p className="text-[#8D95A8] text-sm max-w-sm">
          Thanks for reaching out. We'll get back to you within 48 hours at the email you provided.
        </p>
        <button
          onClick={() => setState('idle')}
          className="btn-outline mt-6 text-sm"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-semibold tracking-wider uppercase text-[#8D95A8] mb-2">
          Your Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Jane Smith"
          className="w-full bg-[#0E0E0E] border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder-[#8D95A8]/50 focus:outline-none focus:border-[#14CB72]/50 transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold tracking-wider uppercase text-[#8D95A8] mb-2">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="jane@studio.com"
          className="w-full bg-[#0E0E0E] border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder-[#8D95A8]/50 focus:outline-none focus:border-[#14CB72]/50 transition-colors"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-semibold tracking-wider uppercase text-[#8D95A8] mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your project — what you need, your timeline, and any relevant context..."
          className="w-full bg-[#0E0E0E] border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder-[#8D95A8]/50 focus:outline-none focus:border-[#14CB72]/50 transition-colors resize-none"
        />
      </div>

      {/* Error */}
      {state === 'error' && (
        <div className="flex items-start gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {errorMessage}
        </div>
      )}

      {/* Privacy note */}
      <p className="text-xs text-[#8D95A8]/60">
        Your information is handled in accordance with our Privacy Policy and GDPR regulations.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  )
}
