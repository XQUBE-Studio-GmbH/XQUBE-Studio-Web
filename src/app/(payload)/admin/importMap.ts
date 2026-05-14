import type { ImportMap } from 'payload'
import GeneratePasswordButton from '@/components/GeneratePasswordButton'
import AdminLogo from '@/components/admin/AdminLogo'

export const importMap: ImportMap = {
  '@/components/GeneratePasswordButton#default': GeneratePasswordButton,
  '@/components/admin/AdminLogo#default': AdminLogo,
}
