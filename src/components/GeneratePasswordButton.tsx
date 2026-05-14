'use client'

import { useState } from 'react'

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

  const generate = () => {
    setPassword(generatePassword())
    setCopied(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '13px', color: '#a0a0a0', marginBottom: '8px' }}>
        Generate a strong temporary password to share with the new user. They can change it after logging in.
      </p>
      <button
        type="button"
        onClick={generate}
        style={{
          padding: '8px 16px',
          background: '#1f6feb',
          border: 'none',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        Generate Password
      </button>

      {password && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
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
