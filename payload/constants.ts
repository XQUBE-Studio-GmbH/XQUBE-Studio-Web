// ─── Payload CMS Role Constants ───────────────────────────────────────────────
// Single source of truth for role strings.
// Used in payload.config.ts access-control functions.

export const ROLES = {
  SUPER_ADMIN:    'super-admin',
  ADMIN:          'admin',
  CONTENT_EDITOR: 'content-editor',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]
