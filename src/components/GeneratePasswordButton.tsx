'use client'

import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  return Array.from(
    { length: 16 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')
}

export default function GeneratePasswordButton() {
  const [mounted, setMounted]   = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied]     = useState(false)
  const [status, setStatus]     = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const { id } = useDocumentInfo()
  const isSaved = !!id
  const router = useRouter()

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

  // Auto-generate password on mount for both create and edit pages.
  // On create: dispatch to form so it's saved with the user.
  // On edit: just show it — admin must click Reset & Send to apply it.
  useEffect(() => {
    const p = generatePassword()
    setPassword(p)
    setMounted(true)
    if (!isSaved) setTimeout(() => dispatchToForm(p), 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateNew = () => {
    const p = generatePassword()
    setPassword(p)
    setCopied(false)
    setStatus('idle')
    setErrorMsg('')
    if (!isSaved) dispatchToForm(p)
  }

  const copy = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ─── CREATE PAGE: create user + send invitation in one action ─────────────
  const createAndSendInvite = async () => {
    if (!email?.trim()) { alert('Fill in the email field first.'); return }
    if (!name?.trim())  { alert('Fill in the name field first.');  return }
    setStatus('loading')
    setErrorMsg('')
    try {
      // 1. Create the user via Payload REST API
      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword: password, role, mustChangePassword: true }),
      })
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}))
        throw new Error(data?.errors?.[0]?.message || 'Failed to create user.')
      }
      const { doc } = await createRes.json()

      // 2. Send invitation email
      const inviteRes = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      if (!inviteRes.ok) throw new Error('User created but invitation email failed to send.')

      setStatus('done')

      // 3. Redirect to the new user's edit page after a short delay
      if (doc?.id) {
        setTimeout(() => router.push(`/admin/collections/users/${doc.id}`), 1500)
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  // ─── EDIT PAGE: reset password via API + send invitation in one action ────
  const resetAndSendInvite = async () => {
    if (!email?.trim()) { alert('No email address found on this user.'); return }
    setStatus('loading')
    setErrorMsg('')
    try {
      const resetRes = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmPassword: password, mustChangePassword: true }),
      })
      if (!resetRes.ok) throw new Error('Password reset failed.')

      const inviteRes = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      if (!inviteRes.ok) throw new Error('Password reset but invitation email failed to send.')

      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (!mounted) return null

  // ─── Shared: password display ─────────────────────────────────────────────
  const PasswordDisplay = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <code style={{
        background: '#1a1a2e', border: '1px solid #333', borderRadius: '4px',
        padding: '6px 12px', fontSize: '14px', letterSpacing: '1px',
        color: '#e0e0e0', userSelect: 'all',
      }}>
        {password}
      </code>
      <button type="button" onClick={copy} style={{
        padding: '6px 14px', background: copied ? '#238636' : '#333',
        border: 'none', borderRadius: '4px', color: '#fff',
        fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s',
      }}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button type="button" onClick={generateNew} disabled={status === 'loading' || status === 'done'} style={{
        padding: '6px 14px', background: 'transparent', border: '1px solid #444',
        borderRadius: '4px', color: '#a0a0a0', fontSize: '12px',
        cursor: status === 'loading' || status === 'done' ? 'not-allowed' : 'pointer',
      }}>
        New Password
      </button>
    </div>
  )

  // ─── CREATE PAGE ──────────────────────────────────────────────────────────
  if (!isSaved) {
    return (
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: '#a0a0a0', marginBottom: '8px' }}>
          A password has been generated for this user. Click Send Invitation to create the account and email their credentials in one step.
        </p>
        <PasswordDisplay />
        <button
          type="button"
          onClick={createAndSendInvite}
          disabled={status === 'loading' || status === 'done'}
          style={{
            padding: '8px 18px',
            background: status === 'done'  ? '#238636'
                      : status === 'error' ? '#b91c1c'
                      : '#14CB72',
            border: 'none', borderRadius: '4px',
            color: status === 'idle' ? '#000' : '#fff',
            fontSize: '13px', fontWeight: 600,
            cursor: status === 'loading' || status === 'done' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
            transition: 'background 0.2s',
          }}
        >
          {status === 'loading' && 'Creating & Sending…'}
          {status === 'done'    && '✓ User created & invitation sent'}
          {status === 'error'   && 'Failed — try again'}
          {status === 'idle'    && 'Send Invitation'}
        </button>
        {status === 'error' && errorMsg && (
          <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>{errorMsg}</p>
        )}
        {status === 'done' && (
          <p style={{ color: '#4ade80', fontSize: '12px', marginTop: '6px' }}>
            Redirecting to user profile…
          </p>
        )}
      </div>
    )
  }

  // ─── EDIT PAGE ────────────────────────────────────────────────────────────
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '13px', color: '#a0a0a0', marginBottom: '8px' }}>
        This will reset the user's password and send them a new invitation email.
      </p>
      <PasswordDisplay />
      <button
        type="button"
        onClick={resetAndSendInvite}
        disabled={status === 'loading' || status === 'done'}
        style={{
          padding: '8px 18px',
          background: status === 'done'  ? '#238636'
                    : status === 'error' ? '#b91c1c'
                    : '#14CB72',
          border: 'none', borderRadius: '4px',
          color: status === 'idle' ? '#000' : '#fff',
          fontSize: '13px', fontWeight: 600,
          cursor: status === 'loading' || status === 'done' ? 'not-allowed' : 'pointer',
          opacity: status === 'loading' ? 0.7 : 1,
          transition: 'background 0.2s',
        }}
      >
        {status === 'loading' && 'Sending…'}
        {status === 'done'    && '✓ Password reset & invitation sent'}
        {status === 'error'   && 'Failed — try again'}
        {status === 'idle'    && 'Reset Password & Send Invitation'}
      </button>
      {status === 'error' && errorMsg && (
        <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>{errorMsg}</p>
      )}
    </div>
  )
}
