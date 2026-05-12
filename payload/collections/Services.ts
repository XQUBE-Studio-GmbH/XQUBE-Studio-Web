import { CollectionConfig } from 'payload/types'

const isEditor = ({ req: { user } }: any) =>
  !!user && ['super-admin', 'admin', 'content-editor'].includes(user.role)

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'order', 'featured', 'updatedAt'],
  },
  access: {
    read:   () => true,
    create: isEditor,
    update: isEditor,
    delete: ({ req: { user } }) => !!user && ['super-admin', 'admin'].includes(user.role),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown on homepage services section. Keep under 120 characters.' },
    },
    {
      name: 'description',
      type: 'richText',
      admin: { description: 'Full description on the Services page.' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Lucide icon name (e.g. "Layers", "Cpu", "Boxes"). See lucide.dev' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Key Features',
      fields: [
        { name: 'feature', type: 'text', required: true },
      ],
    },
    {
      name: 'deliverables',
      type: 'array',
      label: 'Deliverables',
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order. Lower number = appears first.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on homepage services section' },
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', label: 'OG Image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
