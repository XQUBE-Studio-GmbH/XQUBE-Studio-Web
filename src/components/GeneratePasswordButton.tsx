'use client'

import { useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  return Array.from(
    { length: 16 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')
}

export default function GeneratePasswordButton() {
  const [password, setPassword] = useState('')
  const [copied, setCopied]     = useState(false)
  const dispatchFields = useFormFields(([, dispatch]) => dispatch)

  const generate = () => {
    const p = generatePassword()
    setPassword(p)
    setCopied(false)
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
        A password has been generated — copy it to share with the new user. Click Regenerate for a different one.
      </p>

      {password && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
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
    </div>
  )
}
