'use client'

import { useEffect, useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

// Mirrors the server-side hook logic so the preview is always consistent.
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Reusable real-time slug field for all collections.
// • On create — auto-fills as you type the title, starting immediately.
// • On edit   — shows existing slug (locked); "regenerate" button resets it
//               from the current title so the user can update it intentionally.
// • The server-side beforeValidate hook still runs on save as a safety net.
export const SlugField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const resolvedPath = path ?? field.name
  const { value, setValue, showError } = useField<string>({ path: resolvedPath })
  const title = useFormFields(([fields]) => fields['title']?.value as string | undefined)

  // Lock auto-generation once the slug already has a value (edit mode).
  // On create the slug starts blank so isLocked starts false.
  const [isLocked, setIsLocked] = useState(() => Boolean(value))

  useEffect(() => {
    if (!isLocked && title) {
      setValue(slugify(title))
    }
  }, [title, isLocked, setValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLocked(true)
    setValue(e.target.value)
  }

  const handleRegenerate = () => {
    setIsLocked(false)
    if (title) setValue(slugify(title))
  }

  const borderColor = showError
    ? 'var(--theme-error-500)'
    : 'var(--theme-border-color, var(--theme-elevation-200))'

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Label row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.4rem',
      }}>
        <label
          htmlFor={`field-${resolvedPath}`}
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--theme-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {String(field.label ?? 'URL Slug')}
          {field.required && (
            <span style={{ color: 'var(--theme-error-500)', marginLeft: '0.2rem' }}>*</span>
          )}
        </label>

        {isLocked && !readOnly && title && (
          <button
            type="button"
            onClick={handleRegenerate}
            style={{
              fontSize: '0.7rem',
              color: 'var(--theme-text)',
              opacity: 0.55,
              cursor: 'pointer',
              background: 'none',
              border: '1px solid currentColor',
              borderRadius: '3px',
              padding: '1px 7px',
              lineHeight: 1.5,
              fontFamily: 'inherit',
            }}
          >
            ↺ regenerate from title
          </button>
        )}
      </div>

      {/* Input */}
      <input
        id={`field-${resolvedPath}`}
        type="text"
        value={value ?? ''}
        readOnly={readOnly}
        onChange={handleChange}
        style={{
          width: '100%',
          height: '40px',
          padding: '0 12px',
          background: 'var(--theme-elevation-100)',
          border: `1px solid ${borderColor}`,
          borderRadius: '4px',
          color: 'var(--theme-text)',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          cursor: readOnly ? 'not-allowed' : 'text',
          opacity: readOnly ? 0.6 : 1,
          outline: 'none',
          transition: 'border-color 0.15s ease',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--theme-success-500, var(--theme-elevation-400))')}
        onBlur={(e) => (e.currentTarget.style.borderColor = borderColor)}
      />

      {/* Description */}
      {field.admin?.description && (
        <p style={{
          marginTop: '0.3rem',
          fontSize: '0.72rem',
          color: 'var(--theme-text)',
          opacity: 0.5,
          lineHeight: 1.4,
        }}>
          {String(field.admin.description)}
        </p>
      )}
    </div>
  )
}
