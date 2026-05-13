import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  admin: {
    meta: {
      titleSuffix: '— XQube Admin',
    },
    user: 'users',
  },

  editor: lexicalEditor(),

  collections: [
    // ─── Users ───────────────────────────────────────────────
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [
        { name: 'name', type: 'text' },
        {
          name: 'role',
          type: 'select',
          defaultValue: 'viewer',
          options: [
            { label: 'Super Admin',    value: 'super-admin' },
            { label: 'Admin',          value: 'admin' },
            { label: 'BD Manager',     value: 'bd-manager' },
            { label: 'Content Editor', value: 'content-editor' },
            { label: 'Viewer',         value: 'viewer' },
          ],
        },
      ],
    },

    // ─── Media ───────────────────────────────────────────────
    {
      slug: 'media',
      upload: true,
      fields: [
        { name: 'alt', type: 'text', required: true },
      ],
    },

    // ─── Portfolio ───────────────────────────────────────────
    {
      slug: 'portfolio',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug',  type: 'text', required: true, unique: true, index: true },
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
        { name: 'heroImage',         type: 'upload', relationTo: 'media' },
        { name: 'shortDescription',  type: 'textarea' },
        { name: 'featured',          type: 'checkbox', defaultValue: false },
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
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title',            type: 'text',     required: true },
        { name: 'slug',             type: 'text',     required: true, unique: true },
        { name: 'shortDescription', type: 'textarea' },
        { name: 'description',      type: 'richText' },
        { name: 'featured',         type: 'checkbox', defaultValue: false },
        { name: 'order',            type: 'number',   defaultValue: 0 },
      ],
    },

    // ─── Team Members ────────────────────────────────────────
    {
      slug: 'team-members',
      admin: { useAsTitle: 'name' },
      fields: [
        { name: 'name',  type: 'text', required: true },
        { name: 'role',  type: 'text', required: true },
        { name: 'bio',   type: 'textarea' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },

    // ─── Clients (Logo Strip) ────────────────────────────────
    {
      slug: 'clients',
      admin: { useAsTitle: 'name' },
      fields: [
        { name: 'name',     type: 'text',     required: true },
        { name: 'logo',     type: 'upload',   relationTo: 'media', required: true },
        { name: 'featured', type: 'checkbox', defaultValue: true },
        { name: 'order',    type: 'number',   defaultValue: 0 },
      ],
    },

    // ─── Blog Posts ──────────────────────────────────────────
    {
      slug: 'blog-posts',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title',   type: 'text',     required: true },
        { name: 'slug',    type: 'text',     required: true, unique: true },
        { name: 'excerpt', type: 'textarea' },
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
      fields: [
        { name: 'siteName', type: 'text',  defaultValue: 'XQube Studio' },
        { name: 'tagline',  type: 'text',  defaultValue: 'Where Art Meets Precision' },
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
          type: 'group',
          fields: [
            { name: 'title',       type: 'text',     defaultValue: 'XQube Studio | AAA Game Art & XR Production' },
            { name: 'description', type: 'textarea', defaultValue: 'XQube Studio is a GmbH-registered game art and XR production studio with hubs in Vienna, Dubai, and Dhaka. Delivering AAA-quality assets for game studios worldwide.' },
          ],
        },
        {
          name: 'analytics',
          type: 'group',
          fields: [
            { name: 'gaMeasurementId', type: 'text', admin: { description: 'Google Analytics ID (G-XXXXXXXXXX)' } },
          ],
        },
        { name: 'footerCopy', type: 'text', defaultValue: '© 2025 XQube Studio GmbH. All rights reserved.' },
      ],
    },

    // ─── Navigation ──────────────────────────────────────────
    {
      slug: 'navigation',
      fields: [
        {
          name: 'mainNav',
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
      // Supabase requires SSL for all external connections (Vercel, CI, etc.)
      ssl: { rejectUnauthorized: false },
    },
    // Auto-sync schema to DB on startup — creates tables if they don't exist
    push: true,
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
