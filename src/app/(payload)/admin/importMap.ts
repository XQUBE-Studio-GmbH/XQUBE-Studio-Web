import type { ImportMap } from 'payload'
import GeneratePasswordButton from '@/components/GeneratePasswordButton'
import AdminLogo from '@/components/admin/AdminLogo'
import AdminIcon from '@/components/admin/AdminIcon'
import UsersSaveButton from '@/components/UsersSaveButton'
import MustChangePasswordGuard from '@/components/admin/MustChangePasswordGuard'
import { SlugField } from '@/components/admin/SlugField'
import { S3ClientUploadHandler } from '@payloadcms/storage-s3/client'
import { CollectionCards } from '@payloadcms/next/rsc'
import { RscEntryLexicalField, RscEntryLexicalCell, LexicalDiffComponent } from '@payloadcms/richtext-lexical/rsc'

export const importMap: ImportMap = {
  '@/components/GeneratePasswordButton#default': GeneratePasswordButton,
  '@/components/admin/AdminLogo#default': AdminLogo,
  '@/components/admin/AdminIcon#default': AdminIcon,
  '@/components/UsersSaveButton#default': UsersSaveButton,
  '@/components/admin/MustChangePasswordGuard#default': MustChangePasswordGuard,
  '@/components/admin/SlugField#SlugField': SlugField,
  '@payloadcms/storage-s3/client#S3ClientUploadHandler': S3ClientUploadHandler,
  '@payloadcms/next/rsc#CollectionCards': CollectionCards,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField': RscEntryLexicalField,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell': RscEntryLexicalCell,
  '@payloadcms/richtext-lexical/rsc#LexicalDiffComponent': LexicalDiffComponent,
}
