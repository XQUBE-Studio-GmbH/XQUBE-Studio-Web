'use client'

import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  return Array.from(
    { length: 16 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')
}

export default function GeneratePasswordButton() {
  const [password, setPassword]     = useState('')
  const [copied, setCopied]         = useState(false)
  const [inviteStatus, setInvite]   = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const { id } = useDocumentInfo()
  const isSaved = !!id

  const dispatchFields = useFormFields(([, dispatch]) => dispatch)
  const email = useFormFields(([fields]) => fields?.email?.value as string | undefined)
  const name  = useFormFields(([fields]) => fields?.name?.value as string | undefined)
  const role  = useFormFields(([fields]) => fields?.role?.value as string | undefined)

  const generate = () => {
    const p = generatePassword()
    setPassword(p)
    setCopied(false)
    setInvite('idle')
    dispatchFields({ type: 'UPDATE', path: 'password',         value: p })
    dispatchFields({ type: 'UPDATE', path: 'confirm-password', value: p })
  }

  // Auto-generate on mount so the form is never missing a password
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { generate() }, [])

  const copy = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendInvite = async () => {
    if (!email?.trim()) {
      alert('Fill in the email field first.')
      return
    }
    setInvite('loading')
    try {
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      setInvite(res.ok ? 'sent' : 'error')
    } catch {
      setInvite('error')
    }
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Hide the built-in password fields — this button handles them */}
      <style>{`
        div:has(> input#field-password),
        div:has(> input#field-confirm-password),
        label[for="field-password"],
        label[for="field-confirm-password"] { display: none !important; }
      `}</style>
      <p style={{ fontSize: '13px', color: '#a0a0a0', marginBottom: '8px' }}>
        A password has been generated. Copy it manually or send an invitation email directly to the new user.
      </p>

      {password && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <code style={{
            background: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '14px',
            letterSpacing: '1px',
            color: '#e0e0e0',
            userSelect: 'all',
          }}>
            {password}
          </code>
          <button
            type="button"
            onClick={copy}
            style={{
              padding: '6px 14px',
              background: copied ? '#238636' : '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={generate}
            style={{
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#a0a0a0',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Regenerate
          </button>
        </div>
      )}

      {!isSaved && (
        <p style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '8px' }}>
          Save the user first — then you can send the invitation email.
        </p>
      )}

      <button
        type="button"
        onClick={sendInvite}
        disabled={!isSaved || inviteStatus === 'loading' || inviteStatus === 'sent'}
        style={{
          padding: '8px 18px',
          background: !isSaved ? '#1a1a1a' : inviteStatus === 'sent' ? '#238636' : inviteStatus === 'error' ? '#b91c1c' : '#14CB72',
          border: !isSaved ? '1px solid #333' : 'none',
          borderRadius: '4px',
          color: !isSaved ? '#555' : inviteStatus === 'sent' || inviteStatus === 'error' ? '#fff' : '#000',
          fontSize: '13px',
          fontWeight: 600,
          cursor: !isSaved || inviteStatus === 'loading' || inviteStatus === 'sent' ? 'not-allowed' : 'pointer',
          opacity: inviteStatus === 'loading' ? 0.7 : 1,
          transition: 'background 0.2s',
        }}
      >
        {inviteStatus === 'loading' && 'Sending…'}
        {inviteStatus === 'sent'    && '✓ Invitation sent'}
        {inviteStatus === 'error'   && 'Failed — try again'}
        {inviteStatus === 'idle'    && 'Send Invitation Email'}
      </button>

      {inviteStatus === 'error' && (
        <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>
          Could not send email. Copy the password and share it manually.
        </p>
      )}
    </div>
  )
}
