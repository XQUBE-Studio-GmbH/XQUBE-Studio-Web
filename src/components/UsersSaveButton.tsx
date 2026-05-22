'use client'

import { SaveButton } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui'

// Hides the default Payload Save button on the Users create page.
// On create, the GeneratePasswordButton handles user creation + invite in one action.
// On edit, the standard Save button is still needed to update name/email/role.
export default function UsersSaveButton() {
  const { id } = useDocumentInfo()
  if (!id) return null
  return <SaveButton />
}
