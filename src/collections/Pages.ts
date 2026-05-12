import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const isContentEditor = ({ req: { user } }: any) =>
  ['super-admin', 'admin', 'content-editor'].includes(user?.role)

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: isContentEditor,
    update: isContentEditor,
    delete: ({ req: { user } }) => ['super-admin', 'admin'].includes(user?.role || ''),
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'e.g. "home", "about", "services", "contact"',
      },
    },
    { name: 'content', type: 'richText', editor: lexicalEditor({}) },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Metadata',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: { description: 'Recommended: 50–60 characters' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: { description: 'Recommended: 150–160 characters' },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Social share image (1200×630px recommended)' },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: { description: 'Comma-separated keywords' },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Prevent search engines from indexing this page' },
        },
      ],
    },
  ],
}
