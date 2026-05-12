import { CollectionConfig } from 'payload/types'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user && ['super-admin', 'admin', 'content-editor'].includes(user.role),
    update: ({ req: { user } }) => !!user && ['super-admin', 'admin', 'content-editor'].includes(user.role),
    delete: ({ req: { user } }) => !!user && ['super-admin', 'admin'].includes(user.role),
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400,  height: 300,  crop: 'center' },
      { name: 'card',      width: 800,  height: 600,  crop: 'center' },
      { name: 'hero',      width: 1920, height: 1080, crop: 'center' },
      { name: 'og',        width: 1200, height: 630,  crop: 'center' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe this image for SEO and accessibility.' },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
