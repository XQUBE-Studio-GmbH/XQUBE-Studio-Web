import type { CollectionConfig } from 'payload'

const isContentEditor = ({ req: { user } }: any) =>
  ['super-admin', 'admin', 'content-editor'].includes(user?.role)

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'engine', 'featured', 'status'],
    listSearchableFields: ['title', 'category', 'tags'],
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
    // Core Info
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
      admin: {
        description: 'URL-friendly identifier (e.g. "female-soldier-character")',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Characters', value: 'characters' },
        { label: 'Weapons', value: 'weapons' },
        { label: 'Vehicles', value: 'vehicles' },
        { label: 'Props', value: 'props' },
        { label: 'Environments', value: 'environments' },
        { label: 'VR Assets', value: 'vr-assets' },
        { label: 'Fortnite / UEFN', value: 'fortnite-uefn' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short description shown in portfolio grid',
      },
    },

    // Media
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Primary showcase image',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },

    // External Sources
    {
      name: 'artStationUrl',
      type: 'text',
      label: 'ArtStation URL',
      admin: {
        description: 'Link to ArtStation post for this asset',
      },
    },
    {
      name: 'googleDriveUrl',
      type: 'text',
      label: 'Google Drive URL',
      admin: {
        description: 'Google Drive folder/file link for high-res assets',
      },
    },

    // Technical Specs
    {
      name: 'specs',
      type: 'group',
      label: 'Technical Specifications',
      fields: [
        {
          name: 'engine',
          type: 'select',
          options: [
            { label: 'Unreal Engine 5', value: 'ue5' },
            { label: 'Unreal Engine 4', value: 'ue4' },
            { label: 'Unity', value: 'unity' },
            { label: 'Fortnite / UEFN', value: 'uefn' },
            { label: 'Engine Agnostic', value: 'agnostic' },
          ],
        },
        {
          name: 'polyCount',
          type: 'text',
          label: 'Poly Count',
        },
        {
          name: 'textureResolution',
          type: 'text',
          label: 'Texture Resolution',
        },
        {
          name: 'platform',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'PC', value: 'pc' },
            { label: 'Console', value: 'console' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'VR', value: 'vr' },
            { label: 'Fortnite', value: 'fortnite' },
          ],
        },
      ],
    },

    // Display Options
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage portfolio preview',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower number = appears first',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'client',
      type: 'text',
      admin: {
        description: 'Client name (optional, shown if client allows)',
      },
    },

    // SEO
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
