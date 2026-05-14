import type { ImportMap } from 'payload'
import GeneratePasswordButton from '@/components/GeneratePasswordButton'
import AdminLogo from '@/components/admin/AdminLogo'
import AdminStyles from '@/components/admin/AdminStyles'

export const importMap: ImportMap = {
  '@/components/GeneratePasswordButton#default': GeneratePasswordButton,
  '@/components/admin/AdminLogo#default': AdminLogo,
  '@/components/admin/AdminStyles#default': AdminStyles,
}
