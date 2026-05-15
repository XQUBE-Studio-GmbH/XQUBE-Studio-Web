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
  const [mounted, setMounted]     = useState(false)
  const [password, setPassword]   = useState('')
  const [copied, setCopied]       = useState(false)
  const [resetStatus, setReset]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [inviteStatus, setInvite] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const { id } = useDocumentInfo()
  const isSaved = !!id

  const dispatchFields = useFormFields(([, dispatch]) => dispatch)
  const email = useFormFields(([fields]) => fields?.email?.value as string | undefined)
  const name  = useFormFields(([fields]) => fields?.name?.value as string | undefined)
  const role  = useFormFields(([fields]) => fields?.role?.value as string | undefined)

  const dispatchToForm = (p: string) => {
    if (dispatchFields) {
      dispatchFields({ type: 'UPDATE', path: 'password',         value: p })
      dispatchFields({ type: 'UPDATE', path: 'confirm-password', value: p })
    }
  }

  // Create page: dispatch to form state via setTimeout to survive Form's REPLACE_STATE.
  // Edit page: generate for display only — password is reset via API, not the form.
  useEffect(() => {
    const p = generatePassword()
    setPassword(p)
    setMounted(true)
    if (!isSaved) {
      setTimeout(() => dispatchToForm(p), 0)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const newPassword = () => {
    const p = generatePassword()
    setPassword(p)
    setCopied(false)
    setReset('idle')
    setInvite('idle')
    if (!isSaved) dispatchToForm(p)
  }

  // Edit page only: PATCH the user directly — no form save needed.
  const resetViaApi = async () => {
    if (!id) return
    setReset('loading')
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword: password }),
      })
      setReset(res.ok ? 'done' : 'error')
    } catch {
      setReset('error')
    }
  }

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

  if (!mounted) return null

  const canSendInvite = isSaved && (!isSaved || resetStatus === 'done')

  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '13px', color: '#a0a0a0', marginBottom: '8px' }}>
        {isSaved
          ? 'Click Reset Password to save the new password instantly — no need to save the form.'
          : 'A password has been generated and will be saved when you create this user.'}
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
            onClick={newPassword}
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
            New Password
          </button>
        </div>
      )}

      {/* Edit page: reset via API — no form save required */}
      {isSaved && (
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={resetViaApi}
            disabled={resetStatus === 'loading' || resetStatus === 'done'}
            style={{
              padding: '8px 18px',
              background: resetStatus === 'done' ? '#238636' : resetStatus === 'error' ? '#b91c1c' : '#2563eb',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: resetStatus === 'loading' || resetStatus === 'done' ? 'not-allowed' : 'pointer',
              opacity: resetStatus === 'loading' ? 0.7 : 1,
              transition: 'background 0.2s',
            }}
          >
            {resetStatus === 'loading' && 'Resetting…'}
            {resetStatus === 'done'    && '✓ Password saved'}
            {resetStatus === 'error'   && 'Failed — try again'}
            {resetStatus === 'idle'    && 'Reset Password'}
          </button>
          {resetStatus === 'idle' && (
            <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '6px' }}>
              Click Reset Password first — then send the invitation with the correct credentials.
            </p>
          )}
          {resetStatus === 'done' && (
            <p style={{ color: '#4ade80', fontSize: '12px', marginTop: '6px' }}>
              Password saved. Copy it above to share manually, or send the invitation email below.
            </p>
          )}
          {resetStatus === 'error' && (
            <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>
              Could not reset password. Try again.
            </p>
          )}
        </div>
      )}

      {/* Create page: must save first */}
      {!isSaved && (
        <p style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '8px' }}>
          Save the user first — then you can send the invitation email.
        </p>
      )}

      <button
        type="button"
        onClick={sendInvite}
        disabled={!canSendInvite || inviteStatus === 'loading' || inviteStatus === 'sent'}
        style={{
          padding: '8px 18px',
          background: !canSendInvite ? '#1a1a1a' : inviteStatus === 'sent' ? '#238636' : inviteStatus === 'error' ? '#b91c1c' : '#14CB72',
          border: !canSendInvite ? '1px solid #333' : 'none',
          borderRadius: '4px',
          color: !canSendInvite ? '#555' : inviteStatus === 'sent' || inviteStatus === 'error' ? '#fff' : '#000',
          fontSize: '13px',
          fontWeight: 600,
          cursor: !canSendInvite || inviteStatus === 'loading' || inviteStatus === 'sent' ? 'not-allowed' : 'pointer',
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
