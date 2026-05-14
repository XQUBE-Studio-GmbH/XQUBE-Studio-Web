import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'

import path from 'path'
import { fileURLToPath } from 'url'
import * as initialMigration from './migrations/20250513_initial'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ─── Access helpers ───────────────────────────────────────────────────────────

const isSuperAdmin    = ({ req }: { req: any }) => req.user?.role === 'super-admin'
const isAdminOrAbove  = ({ req }: { req: any }) => !!req.user && ['super-admin', 'admin'].includes(req.user.role)
const isEditorOrAbove = ({ req }: { req: any }) => !!req.user && ['super-admin', 'admin', 'content-editor'].includes(req.user.role)
const isLoggedIn      = ({ req }: { req: any }) => !!req.user

// Content editors and viewers can only edit their own user record
const canUpdateUser = ({ req }: { req: any }) => {
  if (!req.user) return false
  if (['super-admin', 'admin'].includes(req.user.role)) return true
  return { id: { equals: req.user.id } }
}

// ─── Shared access for content collections ────────────────────────────────────
const contentAccess = {
  read:   isLoggedIn,
  create: isEditorOrAbove,
  update: isEditorOrAbove,
  delete: isAdminOrAbove,
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  admin: {
    meta: {
      titleSuffix: '— XQube Admin',
    },
    user: 'users',
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo#default',
        Icon: '@/components/admin/AdminIcon#default',
      },
    },
  },

  email: resendAdapter({
    defaultFromAddress: 'noreply@xqubestudio.com',
    defaultFromName: 'XQube Studio',
    apiKey: process.env.RESEND_API_KEY || '',
  }),

  editor: lexicalEditor(),

  collections: [
    // ─── Admin Users ─────────────────────────────────────────
    {
      slug: 'users',
      auth: true,
      labels: { singular: 'Admin User', plural: 'Admin Users' },
      admin: {
        useAsTitle: 'email',
        group: 'Access',
        description: 'People who can log into this admin panel.',
      },
      access: {
        read:   isAdminOrAbove,
        create: isAdminOrAbove,
        update: canUpdateUser,
        delete: isSuperAdmin,
      },
      fields: [
        {
          name: 'generatePassword',
          type: 'ui',
          admin: {
            components: {
              Field: '@/components/GeneratePasswordButton#default',
            },
            condition: (_data: any) => !_data?.id,
          },
        },
        { name: 'name', type: 'text' },
        {
          name: 'role',
          label: 'Access Level',
          type: 'select',
          defaultValue: 'viewer',
          admin: { description: 'Controls what this user can see and edit.' },
          options: [
            { label: 'Super Admin',    value: 'super-admin' },
            { label: 'Admin',          value: 'admin' },
            { label: 'Content Editor', value: 'content-editor' },
            { label: 'Viewer',         value: 'viewer' },
          ],
        },
      ],
    },

    // ─── Media Library ───────────────────────────────────────
    {
      slug: 'media',
      upload: true,
      labels: { singular: 'Media File', plural: 'Media Library' },
      admin: {
        group: 'Access',
        description: 'Images and files used across the website.',
      },
      access: {
        read:   isLoggedIn,
        create: isEditorOrAbove,
        update: isEditorOrAbove,
        delete: isAdminOrAbove,
      },
      fields: [
        {
          name: 'alt',
          label: 'Image Description (Alt Text)',
          type: 'text',
          required: true,
          admin: { description: 'Describe the image for accessibility and SEO.' },
        },
      ],
    },

    // ─── Portfolio Items ─────────────────────────────────────
    {
      slug: 'portfolio',
      labels: { singular: 'Portfolio Item', plural: 'Portfolio Items' },
      admin: {
        useAsTitle: 'title',
        group: 'Website Content',
        description: 'Work samples shown in the Portfolio section.',
      },
      access: contentAccess,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'slug',
          label: 'URL Slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'Used in the page URL — e.g. /portfolio/my-item. Lowercase, hyphens only.' },
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Characters',   value: 'characters' },
            { label: 'Weapons',      value: 'weapons' },
            { label: 'Vehicles',     value: 'vehicles' },
            { label: 'Environments', value: 'environments' },
            { label: 'Props',        value: 'props' },
            { label: 'VR Assets',    value: 'vr-assets' },
          ],
        },
        {
          name: 'heroImage',
          label: 'Main Image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'shortDescription',
          label: 'Summary',
          type: 'textarea',
          admin: { description: 'A short description shown on the portfolio card and in search results.' },
        },
        { name: 'featured', type: 'checkbox', defaultValue: false },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'draft',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft',     value: 'draft' },
          ],
        },
      ],
    },

    // ─── Services ────────────────────────────────────────────
    {
      slug: 'services',
      admin: {
        useAsTitle: 'title',
        group: 'Website Content',
        description: 'Services listed on the Services page.',
      },
      access: contentAccess,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'slug',
          label: 'URL Slug',
          type: 'text',
          required: true,
          unique: true,
          admin: { description: 'Used in the page URL. Lowercase, hyphens only.' },
        },
        {
          name: 'shortDescription',
          label: 'Summary',
          type: 'textarea',
        },
        { name: 'description', type: 'richText' },
        { name: 'featured', type: 'checkbox', defaultValue: false },
        {
          name: 'order',
          label: 'Display Order',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Lower number appears first.' },
        },
      ],
    },

    // ─── Team Members ────────────────────────────────────────
    {
      slug: 'team-members',
      labels: { singular: 'Team Member', plural: 'Team Members' },
      admin: {
        useAsTitle: 'name',
        group: 'Website Content',
        description: 'Team profiles shown on the About page.',
      },
      access: contentAccess,
      fields: [
        { name: 'name',  type: 'text', required: true },
        { name: 'role',  type: 'text', required: true },
        { name: 'bio',   type: 'textarea' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
        {
          name: 'order',
          label: 'Display Order',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Lower number appears first.' },
        },
      ],
    },

    // ─── Client Logos ────────────────────────────────────────
    {
      slug: 'clients',
      labels: { singular: 'Client Logo', plural: 'Client Logos' },
      admin: {
        useAsTitle: 'name',
        group: 'Website Content',
        description: 'Client logos shown in the homepage logo strip.',
      },
      access: contentAccess,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'featured',
          label: 'Show on Homepage',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'When checked, this logo appears in the homepage client strip.' },
        },
        {
          name: 'order',
          label: 'Display Order',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Lower number appears first.' },
        },
      ],
    },

    // ─── Blog Posts ──────────────────────────────────────────
    {
      slug: 'blog-posts',
      labels: { singular: 'Blog Post', plural: 'Blog Posts' },
      admin: {
        useAsTitle: 'title',
        group: 'Website Content',
        description: 'Articles published in the Blog section.',
      },
      access: contentAccess,
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'slug',
          label: 'URL Slug',
          type: 'text',
          required: true,
          unique: true,
          admin: { description: 'Used in the page URL — e.g. /blog/my-post. Lowercase, hyphens only.' },
        },
        {
          name: 'excerpt',
          label: 'Short Preview',
          type: 'textarea',
          admin: { description: 'Shown on the blog listing page and in search results.' },
        },
        { name: 'content', type: 'richText' },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'draft',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft',     value: 'draft' },
          ],
        },
      ],
    },
  ],

  globals: [
    // ─── Site Settings ───────────────────────────────────────
    {
      slug: 'site-settings',
      label: 'Site Settings',
      admin: {
        group: 'Settings',
        description: 'Global settings that apply across the entire website.',
      },
      access: {
        read:   isLoggedIn,
        update: isAdminOrAbove,
      },
      fields: [
        {
          name: 'siteName',
          label: 'Studio Name',
          type: 'text',
          defaultValue: 'XQube Studio',
        },
        { name: 'tagline', type: 'text', defaultValue: 'Where Art Meets Precision' },
        {
          name: 'contact',
          type: 'group',
          fields: [
            { name: 'email',      type: 'email', defaultValue: 'info@xqubestudio.com' },
            { name: 'calendly',   type: 'text',  defaultValue: 'https://calendly.com/tanvirkhandlxqsmgs' },
            { name: 'linkedin',   type: 'text',  defaultValue: 'https://www.linkedin.com/company/xqubestudio' },
            { name: 'artstation', type: 'text',  defaultValue: 'https://www.artstation.com/xqubestudio' },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          type: 'group',
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'XQube Studio | AAA Game Art & XR Production',
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue: 'XQube Studio is a GmbH-registered game art and XR production studio with hubs in Vienna, Dubai, and Dhaka. Delivering AAA-quality assets for game studios worldwide.',
            },
          ],
        },
        {
          name: 'analytics',
          type: 'group',
          fields: [
            {
              name: 'gaMeasurementId',
              label: 'Google Analytics ID',
              type: 'text',
              admin: { description: 'Format: G-XXXXXXXXXX' },
            },
          ],
        },
        {
          name: 'footerCopy',
          label: 'Footer Text',
          type: 'text',
          defaultValue: '© 2025 XQube Studio GmbH. All rights reserved.',
        },
      ],
    },

    // ─── Navigation ──────────────────────────────────────────
    {
      slug: 'navigation',
      label: 'Navigation',
      admin: {
        group: 'Settings',
        description: 'Manage the header menu links and call-to-action button.',
      },
      access: {
        read:   isLoggedIn,
        update: isAdminOrAbove,
      },
      fields: [
        {
          name: 'mainNav',
          label: 'Menu Links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url',   type: 'text', required: true },
          ],
          defaultValue: [
            { label: 'Home',      url: '/' },
            { label: 'About',     url: '/about' },
            { label: 'Services',  url: '/services' },
            { label: 'Portfolio', url: '/portfolio' },
            { label: 'Blog',      url: '/blog' },
            { label: 'Contact',   url: '/contact' },
          ],
        },
        {
          name: 'ctaButton',
          label: 'Call-to-Action Button',
          type: 'group',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Book a Call' },
            { name: 'url',   type: 'text', defaultValue: 'https://calendly.com/tanvirkhandlxqsmgs' },
          ],
        },
      ],
    },
  ],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ssl: { rejectUnauthorized: false },
      max: 5,
      connectionTimeoutMillis: 10000,
    },
    push: process.env.NODE_ENV !== 'production',
    prodMigrations: [
      {
        name: '20250513_initial',
        up: initialMigration.up,
        down: initialMigration.down,
      },
    ],
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
})
