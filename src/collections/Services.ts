import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const isContentEditor = ({ req: { user } }: any) =>
  ['super-admin', 'admin', 'content-editor'].includes(user?.role)

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'serviceType', 'featured', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: isContentEditor,
    update: isContentEditor,
    delete: ({ req: { user } }) => ['super-admin', 'admin'].includes(user?.role || ''),
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
      name: 'serviceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Game Art Production', value: 'game-art' },
        { label: 'XR & Simulation', value: 'xr-simulation' },
        { label: 'xKIT Retainer', value: 'xkit' },
        { label: 'Staff Augmentation', value: 'staff-aug' },
        { label: 'AI Solutions', value: 'ai-solutions' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Shown on services card (max 160 chars)',
      },
    },
    {
      name: 'fullDescription',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Lucide icon name (e.g. "Gamepad2", "Cpu", "Users")',
      },
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
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    // xKIT specific tiers
    {
      name: 'xkitTiers',
      type: 'array',
      label: 'xKIT Tiers',
      admin: {
        condition: (data) => data.serviceType === 'xkit',
        description: 'Only for xKIT service type',
      },
      fields: [
        {
          name: 'tierName',
          type: 'text',
          required: true,
        },
        {
          name: 'priceEUR',
          type: 'number',
        },
        {
          name: 'priceUSD',
          type: 'number',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'features',
          type: 'array',
          fields: [
            { name: 'feature', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
