import type { ImportMap } from 'payload'
import GeneratePasswordButton from '@/components/GeneratePasswordButton'
import AdminLogo from '@/components/admin/AdminLogo'
import AdminIcon from '@/components/admin/AdminIcon'
import { S3ClientUploadHandler } from '@payloadcms/storage-s3/client'
import { CollectionCards } from '@payloadcms/next/rsc'

export const importMap: ImportMap = {
  '@/components/GeneratePasswordButton#default': GeneratePasswordButton,
  '@/components/admin/AdminLogo#default': AdminLogo,
  '@/components/admin/AdminIcon#default': AdminIcon,
  '@payloadcms/storage-s3/client#S3ClientUploadHandler': S3ClientUploadHandler,
  '@payloadcms/next/rsc#CollectionCards': CollectionCards,
}
