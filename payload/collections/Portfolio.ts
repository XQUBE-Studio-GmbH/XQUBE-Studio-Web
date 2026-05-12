import { CollectionConfig } from 'payload/types'

const isEditor = ({ req: { user } }: any) =>
  !!user && ['super-admin', 'admin', 'content-editor'].includes(user.role)

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'featured', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'category', 'tags'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL}/portfolio/${doc.slug}`,
  },
  access: {
    read:   () => true,
    create: isEditor,
    update: isEditor,
    delete: ({ req: { user } }) => !!user && ['super-admin', 'admin'].includes(user.role),
  },
  versions: {
    drafts: true,
  },
  fields: [
    // ─── Core ───────────────────────────────────────────
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
        description: 'Auto-generated from title. Used in the URL: /portfolio/[slug]',
        readOnly: false,
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Characters',   value: 'characters' },
        { label: 'Weapons',      value: 'weapons' },
        { label: 'Vehicles',     value: 'vehicles' },
        { label: 'Environments', value: 'environments' },
        { label: 'Props',        value: 'props' },
        { label: 'VR Assets',    value: 'vr-assets' },
        { label: 'UEFN / Fortnite', value: 'uefn' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
      admin: { description: 'e.g. AAA, Mobile, PBR, Unreal Engine, Unity' },
    },
    // ─── Media ──────────────────────────────────────────
    {
      name: 'heroImage',
      label: 'Hero Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
    {
      name: 'externalSource',
      label: 'External Source (ArtStation / Google Drive)',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'ArtStation', value: 'artstation' },
            { label: 'Google Drive', value: 'gdrive' },
            { label: 'None', value: 'none' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'url',
          type: 'text',
          admin: { description: 'Full URL to the ArtStation post or Google Drive file' },
        },
      ],
    },
    // ─── Details ────────────────────────────────────────
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown on portfolio cards. Max 150 characters.' },
    },
    {
      name: 'description',
      type: 'richText',
      admin: { description: 'Full description shown on the portfolio detail page.' },
    },
    {
      name: 'client',
      type: 'text',
      admin: { description: 'e.g. BMW, INDG, Fresh TV (optional)' },
    },
    {
      name: 'engine',
      type: 'select',
      options: [
        { label: 'Unreal Engine', value: 'unreal' },
        { label: 'Unity',         value: 'unity' },
        { label: 'Godot',         value: 'godot' },
        { label: 'UEFN / Fortnite', value: 'uefn' },
        { label: 'Engine Agnostic', value: 'agnostic' },
        { label: 'Other',         value: 'other' },
      ],
    },
    {
      name: 'platform',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'PC',          value: 'pc' },
        { label: 'Console',     value: 'console' },
        { label: 'Mobile',      value: 'mobile' },
        { label: 'VR',          value: 'vr' },
        { label: 'Fortnite',    value: 'fortnite' },
      ],
    },
    // ─── Display ────────────────────────────────────────
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on homepage portfolio preview (max 6 recommended)' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft',     value: 'draft' },
      ],
    },
    // ─── SEO ────────────────────────────────────────────
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Overrides page title in search results. Leave blank to auto-generate.' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Shown in search results. 150–160 characters ideal.' },
        },
        {
          name: 'ogImage',
          label: 'OG Image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Image shown when shared on LinkedIn/Twitter. 1200×630px ideal.' },
        },
      ],
    },
  ],
}
