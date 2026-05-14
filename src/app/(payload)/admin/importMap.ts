import type { ImportMap } from 'payload'
import GeneratePasswordButton from '@/components/GeneratePasswordButton'
import AdminLogo from '@/components/admin/AdminLogo'
import AdminIcon from '@/components/admin/AdminIcon'

export const importMap: ImportMap = {
  '@/components/GeneratePasswordButton#default': GeneratePasswordButton,
  '@/components/admin/AdminLogo#default': AdminLogo,
  '@/components/admin/AdminIcon#default': AdminIcon,
}
