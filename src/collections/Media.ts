import type { CollectionConfig } from 'payload'

const isContentEditor = ({ req: { user } }: any) =>
  ['super-admin', 'admin', 'content-editor'].includes(user?.role)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    create: isContentEditor,
    update: isContentEditor,
    delete: ({ req: { user } }) => ['super-admin', 'admin'].includes(user?.role || ''),
  },
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
