import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'

import path from 'path'
import { fileURLToPath } from 'url'
import * as initialMigration from './migrations/20250513_initial.ts'
import * as portfolioEnhancedMigration from './migrations/20250515_portfolio_enhanced.ts'
import * as pageGlobalsMigration from './migrations/20250515_page_globals.ts'
import * as contactServicesGlobalsMigration from './migrations/20250515_contact_services_globals.ts'
import * as imageFieldsMigration from './migrations/20250515_image_fields.ts'
import * as mediaImageSizesMigration from './migrations/20250516_media_image_sizes.ts'
import * as globalVersionsMigration      from './migrations/20250517_global_versions.ts'
import * as globalStatusColumnMigration  from './migrations/20250517_global_status_column.ts'
import * as recreateGlobalVersionsMigration from './migrations/20250518_recreate_global_versions.ts'
import * as addVersionTimestampsMigration   from './migrations/20250519_add_version_timestamps.ts'
import * as fixVersionChildTablesMigration  from './migrations/20250520_fix_version_child_tables.ts'
import * as portfolioBlogPageGlobalsMigration from './migrations/20250521_portfolio_blog_page_globals.ts'
import * as homepageHeroRedesignMigration     from './migrations/20250522_homepage_hero_redesign.ts'

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
    livePreview: {
      // Opens an iframe inside the admin showing the live site.
      // The iframe receives postMessage updates on every field change —
      // the client component uses useLivePreview() to re-render in real-time.
      url: ({ globalConfig }: { globalConfig?: { slug?: string } }) => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const pathMap: Record<string, string> = {
          'home-page':      '/',
          'about-page':     '/about',
          'contact-page':   '/contact',
          'services-page':  '/services',
          'portfolio-page': '/portfolio',
          'blog-page':      '/blog',
          // Navigation and Site Settings preview on the homepage
          // (nav/footer are not yet wired to Payload — hardcoded in Navbar/Footer)
          'navigation':    '/',
          'site-settings': '/',
        }
        const slug = globalConfig?.slug ?? ''
        return `${siteUrl}${pathMap[slug] ?? '/'}`
      },
      globals: ['home-page', 'about-page', 'contact-page', 'services-page', 'portfolio-page', 'blog-page', 'navigation', 'site-settings'],
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 667  },
        { label: 'Tablet',  name: 'tablet',  width: 768,  height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900  },
      ],
    },
  },

  // Resend throws immediately if apiKey is empty — guard so builds don't crash
  // when RESEND_API_KEY is not set (e.g. preview environments).
  // The contact form API route checks for the key at request time and returns
  // a graceful error if email cannot be sent.
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          defaultFromAddress: 'noreply@xqubestudio.com',
          defaultFromName: 'XQube Studio',
          apiKey: process.env.RESEND_API_KEY,
        }),
      }
    : {}),

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
            disableListColumn: true,
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
      upload: {
        // Accept images and common video formats. Videos are stored as-is (no transcoding).
        // Pre-optimise videos before uploading — max 100 MB after limit increase below.
        mimeTypes: [
          'image/*',
          'video/mp4',
          'video/webm',
          'video/quicktime', // .mov
        ],
        imageSizes: [
          {
            name: 'thumbnail', width: 400,  height: 300,  position: 'centre',
            formatOptions: { format: 'webp', options: { quality: 85 } },
          },
          {
            name: 'card',      width: 800,  height: 600,  position: 'centre',
            formatOptions: { format: 'webp', options: { quality: 85 } },
          },
          {
            name: 'hero',      width: 1600, height: 900,  position: 'centre',
            formatOptions: { format: 'webp', options: { quality: 85 } },
          },
        ],
      },
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
        group: 'Portfolio',
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
          admin: { description: 'Auto-generated from the title on creation. Lowercase, hyphens only — e.g. unreal-engine-lighting-showcase.' },
          hooks: {
            beforeValidate: [
              ({ value, data, operation }) => {
                // Auto-generate slug from title on creation only
                if (operation === 'create' && !value && data?.title) {
                  return (data.title as string)
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                }
                return value
              },
            ],
          },
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
        { name: 'client', label: 'Client / Project', type: 'text' },
        { name: 'year',   label: 'Year',             type: 'number' },
        { name: 'videoUrl', label: 'Video / Reel URL', type: 'text', admin: { description: 'YouTube or Vimeo embed URL.' } },
        {
          name: 'gallery',
          label: 'Image Gallery',
          type: 'array',
          admin: { description: 'Wireframes, clay renders, process shots, in-engine screenshots.' },
          fields: [
            { name: 'image',   type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
        { name: 'overview', label: 'Project Overview', type: 'richText' },
        {
          name: 'software',
          label: 'Software Used',
          type: 'array',
          fields: [{ name: 'tool', type: 'text', required: true }],
        },
        { name: 'polyCount',     label: 'Poly Count',         type: 'text' },
        { name: 'textureRes',    label: 'Texture Resolution', type: 'text' },
        { name: 'deliveryTime',  label: 'Delivery Time',      type: 'text' },
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
        group: 'Services',
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
          admin: { description: 'Auto-generated from the title on creation. Lowercase, hyphens only — e.g. game-art-production.' },
          hooks: {
            beforeValidate: [
              ({ value, data, operation }) => {
                if (operation === 'create' && !value && data?.title) {
                  return (data.title as string)
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                }
                return value
              },
            ],
          },
        },
        {
          name: 'icon',
          label: 'Icon (emoji)',
          type: 'text',
          admin: { description: 'Single emoji shown on homepage card, e.g. 🎮' },
        },
        {
          name: 'image',
          label: 'Service Image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Thumbnail shown at the top of the service card on the Services page.' },
        },
        {
          name: 'shortDescription',
          label: 'Summary',
          type: 'textarea',
          admin: { description: 'Short description shown on the homepage services card.' },
        },
        { name: 'description', type: 'richText', admin: { description: 'Full description shown on the Services page.' } },
        {
          name: 'features',
          label: 'Feature Bullets',
          type: 'array',
          admin: { description: 'Bullet points shown on the Services page.' },
          fields: [{ name: 'feature', type: 'text', required: true }],
        },
        {
          name: 'platforms',
          label: 'Platforms & Engines',
          type: 'text',
          admin: { description: 'e.g. Unreal Engine 5 · Unity · UEFN · Roblox' },
        },
        { name: 'featured', type: 'checkbox', defaultValue: false, admin: { description: 'Show on homepage services section.' } },
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
        group: 'Pages',
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
        group: 'Pages',
        description: 'Client logos shown in the homepage logo strip.',
      },
      access: contentAccess,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'sector',
          label: 'Industry Sector',
          type: 'text',
          admin: { description: 'e.g. Game Studio, Automotive, Media & TV — shown on About page.' },
        },
        {
          name: 'note',
          label: 'Project Note',
          type: 'text',
          admin: { description: 'One-line description of the work done — shown on About page.' },
        },
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
        group: 'Blog',
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
          admin: { description: 'Auto-generated from the title on creation. Lowercase, hyphens only — e.g. ue5-lighting-breakdown.' },
          hooks: {
            beforeValidate: [
              ({ value, data, operation }) => {
                if (operation === 'create' && !value && data?.title) {
                  return (data.title as string)
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                }
                return value
              },
            ],
          },
        },
        {
          name: 'coverImage',
          label: 'Cover Image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Featured image shown on the blog listing card and at the top of the post.' },
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
      versions: { drafts: { autosave: { interval: 800 } } },
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
            { name: 'phone',      type: 'text',  defaultValue: '+43 650 5207329' },
            { name: 'address',    type: 'text',  defaultValue: 'Rathausstrasse 21/12, 1010 Vienna, Austria' },
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

    // ─── Homepage ────────────────────────────────────────────
    {
      slug: 'home-page',
      label: 'Homepage',
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Pages',
        description: 'Edit the homepage cinematic hero (slideshow or video), stats, and bottom CTA.',
      },
      access: { read: isLoggedIn, update: isEditorOrAbove },
      fields: [
        {
          name: 'hero',
          label: 'Hero Section',
          type: 'group',
          admin: { description: 'Cinematic full-width hero. Choose Slideshow (multiple images with Ken Burns zoom) or Video (looping mp4 background). In both modes, Slides define the text that appears.' },
          fields: [
            {
              name: 'mode',
              label: 'Hero Type',
              type: 'select',
              defaultValue: 'slideshow',
              options: [
                { label: 'Slideshow — multiple images with Ken Burns zoom', value: 'slideshow' },
                { label: 'Video — looping video background with text slides', value: 'video' },
              ],
            },
            {
              name: 'videoUrl',
              label: 'Video URL',
              type: 'text',
              admin: {
                description: 'Upload an mp4 or webm to the Media Library, then paste the CDN URL here. Only used when Hero Type = Video. Pre-optimise video before upload (720p–1080p, H.264).',
                condition: (data) => data?.hero?.mode === 'video',
              },
            },
            {
              name: 'slides',
              label: 'Slides',
              type: 'array',
              admin: {
                description: 'Each slide defines the text overlay. In Slideshow mode, each slide also has its own background image. In Video mode, the image is ignored and all slides cycle over the video. Leave empty to use the built-in default slide.',
              },
              fields: [
                { name: 'eyebrow',           label: 'Eyebrow Label',       type: 'text',     admin: { description: 'Small uppercase label above the heading, e.g. Vienna · Dubai · Dhaka' } },
                { name: 'title',             label: 'Heading',              type: 'text',     required: true, admin: { description: 'Main hero headline. Last word highlights in green automatically.' } },
                { name: 'subtitle',          label: 'Subtitle',             type: 'textarea', admin: { description: 'Short supporting text below the heading.' } },
                { name: 'primaryCtaLabel',   label: 'Primary CTA Text',     type: 'text',     required: true, defaultValue: 'Book a Discovery Call' },
                { name: 'primaryCtaUrl',     label: 'Primary CTA URL',      type: 'text',     required: true, defaultValue: 'https://calendly.com/tanvirkhandlxqsmgs' },
                { name: 'secondaryCtaLabel', label: 'Secondary CTA Text',   type: 'text',     admin: { description: 'Optional. Leave blank to hide the secondary button.' } },
                { name: 'secondaryCtaUrl',   label: 'Secondary CTA URL',    type: 'text',     admin: { description: 'Required if Secondary CTA Text is filled.' } },
                {
                  name: 'image',
                  label: 'Slide Background Image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Background image for this slide. Used in Slideshow mode — ignored in Video mode.' },
                },
              ],
            },
          ],
        },
        {
          name: 'stats',
          label: 'Stats Bar',
          type: 'array',
          admin: { description: 'Numbers shown below the hero. Leave empty to hide the stats bar.' },
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'e.g. 15+' } },
            { name: 'label', type: 'text', required: true, admin: { description: 'e.g. Years Experience' } },
          ],
        },
        {
          name: 'cta',
          label: 'Bottom CTA Section',
          type: 'group',
          fields: [
            { name: 'headline',    label: 'Headline',    type: 'text', defaultValue: 'Looking for a long-term art partner?' },
            { name: 'subtitle',    label: 'Subtitle',    type: 'text', defaultValue: 'We might be the right fit.' },
            { name: 'buttonLabel', label: 'Button Text', type: 'text', defaultValue: 'Start a Conversation' },
            { name: 'buttonUrl',   label: 'Button URL',  type: 'text', defaultValue: '/contact' },
          ],
        },
      ],
    },

    // ─── About Page ──────────────────────────────────────────
    {
      slug: 'about-page',
      label: 'About Page',
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Pages',
        description: 'Edit the About page hero banner, intro, credentials, hubs, and Why XQube cards.',
      },
      access: { read: isLoggedIn, update: isEditorOrAbove },
      fields: [
        {
          name: 'hero',
          label: 'Hero Banner',
          type: 'group',
          admin: { description: 'Full-width banner shown at the top of the About page.' },
          fields: [
            { name: 'label',    label: 'Eyebrow Label', type: 'text',     defaultValue: 'About Us' },
            { name: 'heading',  label: 'Heading',        type: 'text',     defaultValue: 'A studio built for precision' },
            { name: 'subtitle', label: 'Subtitle',       type: 'textarea', defaultValue: 'XQube Studio GmbH — Vienna · Dubai · Dhaka. 15+ years delivering AAA-quality game art and XR production for studios worldwide.' },
            {
              name: 'image',
              label: 'Banner Background Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. Dark overlay is applied automatically. Landscape/cinematic images work best.' },
            },
          ],
        },
        {
          name: 'intro',
          label: 'Intro Text',
          type: 'group',
          fields: [
            { name: 'body1', label: 'Paragraph 1', type: 'textarea', defaultValue: 'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria. With 15+ years of hands-on delivery across gaming, XR, simulation, and AI — we work with studios worldwide to deliver AAA-quality assets at scale.' },
            { name: 'body2', label: 'Paragraph 2', type: 'textarea', defaultValue: 'Our three-hub model combines European business standards with world-class production capability — giving clients the reliability of a Vienna GmbH with the speed and depth of a Dhaka production team.' },
            {
              name: 'image',
              label: 'Studio Photo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. A studio or team photo shown beside the intro text.' },
            },
          ],
        },
        {
          name: 'credentials',
          label: 'Credentials / Stats',
          type: 'array',
          admin: { description: 'The 4 stat numbers shown below the intro. Leave empty to use defaults.' },
          fields: [
            { name: 'value',  type: 'text', required: true, admin: { description: 'e.g. 15+' } },
            { name: 'label',  type: 'text', required: true, admin: { description: 'e.g. Years Experience' } },
            { name: 'detail', type: 'text', admin: { description: 'e.g. XR · game art · delivered across 3 continents' } },
          ],
        },
        {
          name: 'hubs',
          label: 'Global Hubs',
          type: 'array',
          admin: { description: 'The three office/hub cards. Leave empty to use defaults.' },
          fields: [
            { name: 'flag',    type: 'text', admin: { description: 'Flag emoji, e.g. 🇦🇹' } },
            { name: 'city',    type: 'text', required: true },
            { name: 'country', type: 'text', required: true },
            { name: 'role',    type: 'text', admin: { description: 'One-line hub role description.' } },
            { name: 'detail',  type: 'text', admin: { description: 'Secondary detail line.' } },
            {
              name: 'image',
              label: 'Hub Photo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. Photo shown at the top of the hub card.' },
            },
          ],
        },
        {
          name: 'whyXqube',
          label: 'Why XQube Cards',
          type: 'array',
          admin: { description: 'The 6 cards in the "Why XQube" section.' },
          fields: [
            { name: 'title', type: 'text',     required: true },
            { name: 'body',  type: 'textarea', required: true },
          ],
        },
      ],
    },

    // ─── Contact Page ────────────────────────────────────────
    {
      slug: 'contact-page',
      label: 'Contact Page',
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Pages',
        description: 'Edit the Contact page headline, subtext, and Calendly button label.',
      },
      access: { read: isLoggedIn, update: isEditorOrAbove },
      fields: [
        {
          name: 'hero',
          label: 'Hero Section',
          type: 'group',
          fields: [
            { name: 'label',        label: 'Eyebrow Label',        type: 'text',     defaultValue: 'Get in Touch' },
            { name: 'heading',      label: 'Heading',              type: 'text',     defaultValue: "Let's talk about your project" },
            { name: 'subtext',      label: 'Subtext',              type: 'textarea', defaultValue: "Book a discovery call for a scoped conversation, or fill out the brief and we'll respond within 24–48 hours." },
            { name: 'calendlyLabel', label: 'Calendly Button Text', type: 'text',    defaultValue: 'Book a Discovery Call' },
            {
              name: 'image',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. An image shown in the contact page left column.' },
            },
          ],
        },
      ],
    },

    // ─── Services Page ───────────────────────────────────────
    {
      slug: 'services-page',
      label: 'Services Page',
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Services',
        description: 'Edit the Services page hero text and bottom CTA.',
      },
      access: { read: isLoggedIn, update: isEditorOrAbove },
      fields: [
        {
          name: 'hero',
          label: 'Hero Section',
          type: 'group',
          fields: [
            { name: 'label',    label: 'Eyebrow Label', type: 'text',     defaultValue: 'What We Offer' },
            { name: 'heading',  label: 'Heading',        type: 'text',     defaultValue: 'Production-grade services for serious studios' },
            { name: 'subtitle', label: 'Subtitle',       type: 'textarea', defaultValue: 'From a single asset to a fully embedded team — we scale to your needs.' },
            {
              name: 'image',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. A showcase image displayed beside the hero text.' },
            },
          ],
        },
        {
          name: 'cta',
          label: 'Bottom CTA Section',
          type: 'group',
          fields: [
            { name: 'heading',     label: 'Heading',     type: 'text', defaultValue: 'Looking for a long-term art partner?' },
            { name: 'subtitle',    label: 'Subtitle',    type: 'text', defaultValue: 'We might be the right fit.' },
            { name: 'buttonLabel', label: 'Button Text', type: 'text', defaultValue: 'Start a Conversation' },
            { name: 'buttonUrl',   label: 'Button URL',  type: 'text', defaultValue: '/contact' },
          ],
        },
        {
          name: 'pipelines',
          label: 'Production Pipelines',
          type: 'array',
          admin: { description: 'Cards in the "How We Work" section. Leave empty to use built-in defaults.' },
          fields: [
            { name: 'title',       type: 'text',     required: true },
            { name: 'subtitle',    label: 'Subtitle / Workflow Type', type: 'text' },
            { name: 'description', type: 'textarea' },
            {
              name: 'steps',
              label: 'Pipeline Steps',
              type: 'array',
              fields: [{ name: 'step', type: 'text', required: true }],
            },
            { name: 'toolsUsed', label: 'Tools Used', type: 'text' },
            {
              name: 'image',
              label: 'Pipeline Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Showcase image for this pipeline step (e.g. a rendered asset).' },
            },
          ],
        },
      ],
    },

    // ─── Portfolio Page ──────────────────────────────────────
    {
      slug: 'portfolio-page',
      label: 'Portfolio Page',
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Portfolio',
        description: 'Edit the Portfolio listing page hero section.',
      },
      access: { read: isLoggedIn, update: isEditorOrAbove },
      fields: [
        {
          name: 'hero',
          label: 'Hero Section',
          type: 'group',
          fields: [
            { name: 'label',    label: 'Eyebrow Label', type: 'text',     defaultValue: 'Our Work' },
            { name: 'heading',  label: 'Heading',        type: 'text',     defaultValue: 'AAA Game Art. Delivered.' },
            { name: 'subtitle', label: 'Subtitle',       type: 'textarea', defaultValue: 'Browse our portfolio of AAA-quality game art produced for studios worldwide — characters, weapons, environments, and XR assets.' },
            {
              name: 'image',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. Displayed beside the hero text on large screens.' },
            },
            { name: 'ctaLabel', label: 'CTA Button Text', type: 'text', defaultValue: 'Start a Project' },
            { name: 'ctaUrl',   label: 'CTA Button URL',  type: 'text', defaultValue: '/contact' },
          ],
        },
      ],
    },

    // ─── Blog Page ───────────────────────────────────────────
    {
      slug: 'blog-page',
      label: 'Blog Page',
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Blog',
        description: 'Edit the Blog listing page hero section.',
      },
      access: { read: isLoggedIn, update: isEditorOrAbove },
      fields: [
        {
          name: 'hero',
          label: 'Hero Section',
          type: 'group',
          fields: [
            { name: 'label',    label: 'Eyebrow Label', type: 'text',     defaultValue: 'Insights' },
            { name: 'heading',  label: 'Heading',        type: 'text',     defaultValue: 'Behind the Studio' },
            { name: 'subtitle', label: 'Subtitle',       type: 'textarea', defaultValue: 'Thoughts on game art production, XR development, and studio operations from the XQube team.' },
            {
              name: 'image',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. Displayed beside the hero text on large screens.' },
            },
          ],
        },
      ],
    },

    // ─── Navigation ──────────────────────────────────────────
    {
      slug: 'navigation',
      label: 'Navigation',
      versions: { drafts: { autosave: { interval: 800 } } },
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
      {
        name: '20250515_portfolio_enhanced',
        up: portfolioEnhancedMigration.up,
        down: portfolioEnhancedMigration.down,
      },
      {
        name: '20250515_page_globals',
        up: pageGlobalsMigration.up,
        down: pageGlobalsMigration.down,
      },
      {
        name: '20250515_contact_services_globals',
        up: contactServicesGlobalsMigration.up,
        down: contactServicesGlobalsMigration.down,
      },
      {
        name: '20250515_image_fields',
        up: imageFieldsMigration.up,
        down: imageFieldsMigration.down,
      },
      {
        name: '20250516_media_image_sizes',
        up: mediaImageSizesMigration.up,
        down: mediaImageSizesMigration.down,
      },
      {
        name: '20250517_global_versions',
        up: globalVersionsMigration.up,
        down: globalVersionsMigration.down,
      },
      {
        name: '20250517_global_status_column',
        up: globalStatusColumnMigration.up,
        down: globalStatusColumnMigration.down,
      },
      {
        name: '20250518_recreate_global_versions',
        up: recreateGlobalVersionsMigration.up,
        down: recreateGlobalVersionsMigration.down,
      },
      {
        name: '20250519_add_version_timestamps',
        up: addVersionTimestampsMigration.up,
        down: addVersionTimestampsMigration.down,
      },
      {
        name: '20250520_fix_version_child_tables',
        up: fixVersionChildTablesMigration.up,
        down: fixVersionChildTablesMigration.down,
      },
      {
        name: '20250521_portfolio_blog_page_globals',
        up: portfolioBlogPageGlobalsMigration.up,
        down: portfolioBlogPageGlobalsMigration.down,
      },
      {
        name: '20250522_homepage_hero_redesign',
        up: homepageHeroRedesignMigration.up,
        down: homepageHeroRedesignMigration.down,
      },
    ],
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  upload: {
    limits: {
      // 100 MB — increased from 10 MB to support video uploads (pre-optimised mp4/webm).
      fileSize: 100_000_000,
    },
  },

  plugins: [
    s3Storage({
      // acl: public-read ensures every uploaded file is individually accessible.
      // "Enable File Listing" in DO Spaces only controls directory listing, NOT per-file access.
      acl: 'public-read',
      collections: {
        media: {
          // generateFileURL: returns the public CDN URL stored in the `url` field.
          // Without this, Payload serves files through /api/media (auth-gated → 403 for public visitors).
          // CDN is enabled on this bucket — use CDN endpoint for performance.
          // Set DO_SPACES_CDN_URL env var in Vercel to override (e.g. custom domain later).
          generateFileURL: ({ filename, prefix }) => {
            const cdnBase = process.env.DO_SPACES_CDN_URL
              || `https://${process.env.DO_SPACES_BUCKET || 'xqube-web-media'}.${process.env.DO_SPACES_REGION || 'fra1'}.cdn.digitaloceanspaces.com`
            return `${cdnBase}${prefix ? `/${prefix}` : ''}/${filename}`
          },
        },
      },
      bucket: process.env.DO_SPACES_BUCKET || 'xqube-web-media',
      config: {
        credentials: {
          accessKeyId: process.env.DO_SPACES_KEY || '',
          secretAccessKey: process.env.DO_SPACES_SECRET || '',
        },
        endpoint: `https://${process.env.DO_SPACES_REGION || 'fra1'}.digitaloceanspaces.com`,
        region: process.env.DO_SPACES_REGION || 'fra1',
        forcePathStyle: false,
      },
    }),
  ],
})
