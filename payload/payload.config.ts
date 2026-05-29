import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import { revalidateTag } from 'next/cache'
import sharp from 'sharp'

import path from 'path'
import { fileURLToPath } from 'url'
import { ROLES } from './constants.ts'
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
import * as homepageSectionsMigration         from './migrations/20260520_homepage_sections.ts'
import * as portfolioOrderMigration           from './migrations/20260520_portfolio_order.ts'
import * as featuredWorkCopyMigration         from './migrations/20260520_featured_work_copy.ts'
import * as pipelineCategoriesMigration       from './migrations/20260520_pipeline_categories.ts'
import * as toolsCollectionMigration          from './migrations/20260521_tools_collection.ts'
import * as toolsRelsColumnsMigration         from './migrations/20260522_tools_rels_columns.ts'
import * as homepageBadgesToToolsMigration    from './migrations/20260522_homepage_badges_to_tools.ts'
import * as homepageVersionEngineBadgesMigration from './migrations/20260522_homepage_version_engine_badges.ts'
import * as homepageFeaturedClientsMigration    from './migrations/20260522_homepage_featured_clients.ts'
import * as navLinkVisibilityMigration          from './migrations/20260522_nav_link_visibility.ts'
import * as siteSettingsLegalNoteMigration      from './migrations/20260522_site_settings_legal_note.ts'
import * as siteSettingsSocialLinksMigration    from './migrations/20260522_site_settings_social_links.ts'
import * as mediaFoldersMigration               from './migrations/20260522_media_folders.ts'
import * as seoFieldsMigration                   from './migrations/20260522_seo_fields.ts'
import * as portfolioToolsHasManyMigration        from './migrations/20260522_portfolio_tools_hasMany.ts'
import * as usersMustChangePasswordMigration      from './migrations/20260523_users_must_change_password.ts'
import * as contactSubmissionsMigration           from './migrations/20260523_contact_submissions.ts'
import * as contactSubmissionsRelsMigration       from './migrations/20260524_contact_submissions_rels.ts'
import * as servicesToolsRelMigration             from './migrations/20260524_services_tools_rel.ts'
import * as servicesProcessMigration              from './migrations/20260524_services_process.ts'
import * as homepageEngagementToggleMigration     from './migrations/20260526_homepage_engagement_toggle.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ─── Access helpers ───────────────────────────────────────────────────────────

const isSuperAdmin    = ({ req }: { req: any }) => req.user?.role === ROLES.SUPER_ADMIN
const isAdminOrAbove  = ({ req }: { req: any }) => !!req.user && [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(req.user.role)
const isEditorOrAbove = ({ req }: { req: any }) => !!req.user && [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CONTENT_EDITOR].includes(req.user.role)
const isLoggedIn      = ({ req }: { req: any }) => !!req.user

// Content editors and viewers can only edit their own user record
const canUpdateUser = ({ req }: { req: any }) => {
  if (!req.user) return false
  if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(req.user.role)) return true
  return { id: { equals: req.user.id } }
}

// Non-admin roles can read only their own user document (needed for /admin/account).
// Admins and super-admins can read all users (for the users list).
const canReadUser = ({ req }: { req: any }) => {
  if (!req.user) return false
  if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(req.user.role)) return true
  return { id: { equals: req.user.id } }
}

// ─── Shared access for content collections ────────────────────────────────────
const contentAccess = {
  read:   isLoggedIn,
  create: isEditorOrAbove,
  update: isEditorOrAbove,
  delete: isAdminOrAbove,
}

// ─── Cache revalidation helpers ──────────────────────────────────────────────
// Called from afterChange / afterDelete hooks on every collection and global.
// revalidateTag() is a no-op outside of Next.js server context (e.g. CLI scripts),
// so we wrap in try/catch to keep the admin functional even if it ever throws.

function revalidateTags(...tags: string[]) {
  try {
    tags.forEach((tag) => revalidateTag(tag))
  } catch {
    // Outside Next.js request context — safe to ignore
  }
}

// Hook factories — return Payload hook functions for each content area
const revalidateCollection = (...tags: string[]) => () => { revalidateTags(...tags) }
const revalidateGlobal     = (...tags: string[]) => () => { revalidateTags(...tags) }

// ─── WebP conversion hook ─────────────────────────────────────────────────────
// Payload's `formatOptions` in the upload config works for local storage but is
// bypassed by @payloadcms/storage-s3 — the S3 plugin uploads the original file
// before Payload's sharp processing runs. This beforeOperation hook intercepts
// the file on req before S3 ever sees it, guaranteeing WebP conversion on upload.
async function convertToWebP({ operation, req }: { operation: string; req: any }) {
  if (operation !== 'create' && operation !== 'update') return
  const file = req?.file
  if (!file?.data) return

  const mime: string = file.mimetype ?? ''
  // Skip non-images, already-WebP, SVGs, GIFs, and videos
  if (
    !mime.startsWith('image/') ||
    mime === 'image/webp' ||
    mime === 'image/svg+xml' ||
    mime === 'image/gif'
  ) return

  try {
    const webpBuffer = await sharp(file.data as Buffer).webp({ quality: 85 }).toBuffer()
    const newName = (file.name as string).replace(/\.(jpe?g|png|tiff?|bmp|avif|heic|heif)$/i, '.webp')

    // Mutate req.file in-place — Payload and the S3 plugin both read from this object
    file.data     = webpBuffer
    file.name     = newName
    file.mimetype = 'image/webp'
    file.size     = webpBuffer.byteLength
  } catch (err) {
    // Log but don't block the upload — the original file will still be saved
    console.error('[convertToWebP] sharp conversion failed:', (err as Error).message)
  }
}

// ─── Shared SEO group ─────────────────────────────────────────────────────────
const seoGroup = {
  name: 'seo',
  label: 'SEO & Social',
  type: 'group' as const,
  admin: {
    description: 'Controls how this page appears in Google search results and when shared on social media.',
  },
  fields: [
    {
      name: 'title',
      label: 'Meta Title',
      type: 'text' as const,
      admin: {
        description: 'Overrides the page title in Google search results. 50–60 characters recommended. Leave blank to use the default.',
      },
    },
    {
      name: 'description',
      label: 'Meta Description',
      type: 'textarea' as const,
      admin: {
        description: 'Summary shown below the title in search results. 140–160 characters ideal. Leave blank to use the default.',
      },
    },
    {
      name: 'image',
      label: 'Social Share Image (OG Image)',
      type: 'upload' as const,
      relationTo: 'media' as const,
      admin: {
        description: 'Image shown when sharing on LinkedIn, Twitter/X, Facebook. 1200×630px recommended. Leave blank to use the default branded image.',
      },
    },
    {
      name: 'noIndex',
      label: 'Hide from search engines',
      type: 'checkbox' as const,
      defaultValue: false,
      admin: {
        description: 'When checked, Google will not index this page. Use for drafts or private content.',
      },
    },
  ],
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // ─── Visual folder browser for Media ─────────────────────────────────────────
  // Enables Payload's built-in folder tree inside the Media list and upload pickers.
  // collectionSpecific: false — folders are not scoped per-collection (simpler, one shared tree).
  // collectionOverrides — restricts folder create/rename/delete to Super Admin and Admin only.
  // Content Editors can browse and pick from folders but cannot reorganise the tree.
  folders: {
    collectionSpecific: false,
    collectionOverrides: [
      async ({ collection }) => ({
        ...collection,
        access: {
          create: ({ req }: { req: any }) => isAdminOrAbove({ req }),
          delete: ({ req }: { req: any }) => isAdminOrAbove({ req }),
          read:   () => true,
          update: ({ req }: { req: any }) => isAdminOrAbove({ req }),
        },
      }),
    ],
  },

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
      providers: [
        '@/components/admin/MustChangePasswordGuard#default',
      ],
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
      auth: { maxLoginAttempts: 0 }, // no brute-force lockout for small invited team; removes Force Unlock button from UI
      lockDocuments: false,
      labels: { singular: 'Admin User', plural: 'Admin Users' },
      admin: {
        useAsTitle: 'email',
        group: 'Access',
        description: 'People who can log into this admin panel.',
        hideAPIURL: true,
        components: {
          edit: {
            SaveButton: '@/components/UsersSaveButton#default',
          },
        },
      },
      access: {
        read:   canReadUser,    // non-admins can read their own doc (required for /admin/account)
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
        // Override Payload's auto-generated auth email field to prevent non-admins from changing it.
        // Payload v3 merges this with the built-in auth email field config.
        {
          name: 'email',
          type: 'email',
          access: {
            update: isAdminOrAbove, // non-admins cannot change their email address
          },
        },
        {
          name: 'name',
          type: 'text',
          access: {
            update: isAdminOrAbove, // non-admins cannot change their name
          },
        },
        {
          name: 'role',
          label: 'Access Level',
          type: 'select',
          defaultValue: 'viewer',
          admin: {
            description: 'Controls what this user can see and edit.',
            // No condition — field is always visible so non-admins can see their own role
            // on the account page. access.update: isAdminOrAbove makes it render as
            // a disabled (read-only) input for Viewers and Content Editors.
          },
          access: {
            update: isAdminOrAbove, // non-admins cannot change their role (renders as disabled)
          },
          options: [
            { label: 'Super Admin',    value: ROLES.SUPER_ADMIN },
            { label: 'Admin',          value: ROLES.ADMIN },
            { label: 'Content Editor', value: ROLES.CONTENT_EDITOR },
            { label: 'Viewer',         value: 'viewer' },
          ],
        },
        {
          // Set to true when user is created via invite flow.
          // Triggers the MustChangePasswordGuard overlay in the admin.
          // Cleared automatically by the beforeChange hook when a new password is saved.
          name: 'mustChangePassword',
          type: 'checkbox',
          defaultValue: false,
          saveToJWT: true,
          admin: { hidden: true },
          access: {
            read:   () => true,
            create: isAdminOrAbove,
            update: isAdminOrAbove,
          },
        },
      ],
      hooks: {
        beforeChange: [
          ({ data, operation, req, originalDoc }: { data: any; operation: string; req: any; originalDoc?: any }) => {
            // Clear mustChangePassword ONLY when a user changes their OWN password.
            // When an admin resets another user's password (via resetAndSendInvite), we
            // preserve the mustChangePassword: true flag that was explicitly sent in the request.
            if (operation === 'update' && data.password) {
              const isOwnUpdate =
                req?.user?.id &&
                originalDoc?.id &&
                String(req.user.id) === String(originalDoc.id)
              if (isOwnUpdate) {
                data.mustChangePassword = false
              }
            }
            return data
          },
        ],
      },
    },

    // ─── Media Library ───────────────────────────────────────
    {
      slug: 'media',
      hooks: {
        beforeOperation: [convertToWebP],
        afterChange:  [revalidateCollection('home', 'about', 'services', 'portfolio', 'blog', 'layout', 'contact')],
        afterDelete:  [revalidateCollection('home', 'about', 'services', 'portfolio', 'blog', 'layout', 'contact')],
      },
      folders: true,
      upload: {
        // Accept images and common video formats. Videos are stored as-is (no transcoding).
        // Pre-optimise videos before uploading — max 100 MB after limit increase below.
        mimeTypes: [
          'image/*',
          'video/mp4',
          'video/webm',
          'video/quicktime', // .mov
        ],
        // Convert every uploaded image to WebP at source.
        // sharp handles this at upload time so DO Spaces only ever receives WebP files.
        // Videos bypass sharp entirely and are stored unchanged.
        // Existing uploads are unaffected — only new uploads going forward are converted.
        formatOptions: {
          format: 'webp' as const,
          options: { quality: 85 },
        },
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
        hideAPIURL: true,
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

    // ─── Tools / Software Library ───────────────────────────
    {
      slug: 'tools',
      labels: { singular: 'Tool', plural: 'Tools' },
      hooks: { afterChange: [revalidateCollection('portfolio', 'services', 'home')], afterDelete: [revalidateCollection('portfolio', 'services', 'home')] },
      admin: {
        useAsTitle: 'name',
        description: 'Software and tools used in production. Add tools here first, then assign them to portfolio items.',
        hideAPIURL: true,
        defaultColumns: ['name', 'category', 'logo'],
      },
      access: {
        read:   () => true,
        create: isEditorOrAbove,
        update: isEditorOrAbove,
        delete: isAdminOrAbove,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Blender", "ZBrush", "Unreal Engine 5"' },
        },
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Square or transparent PNG/SVG logo, shown on portfolio detail pages.' },
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { label: '3D Modelling',        value: '3d-modelling' },
            { label: 'Sculpting',           value: 'sculpting' },
            { label: 'Retopology',          value: 'retopology' },
            { label: 'UV & Unwrapping',     value: 'uv-unwrapping' },
            { label: 'Texturing',           value: 'texturing' },
            { label: 'Photogrammetry',      value: 'photogrammetry' },
            { label: 'Rigging & Animation', value: 'rigging-animation' },
            { label: 'Game Engines',        value: 'game-engines' },
            { label: 'Rendering',           value: 'rendering' },
            { label: 'Concepting',          value: 'concepting' },
            { label: 'Generative 3D',       value: 'generative-3d' },
            { label: 'Version Control',     value: 'version-control' },
            { label: 'Project Management',  value: 'project-management' },
          ],
        },
      ],
    },

    // ─── Portfolio Items ─────────────────────────────────────
    {
      slug: 'portfolio',
      labels: { singular: 'Portfolio Item', plural: 'Portfolio Items' },
      hooks: { afterChange: [revalidateCollection('portfolio', 'home')], afterDelete: [revalidateCollection('portfolio', 'home')] },
      admin: {
        useAsTitle: 'title',
        group: 'Portfolio',
        description: 'Work samples shown in the Portfolio section.',
        hideAPIURL: true,
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
          admin: {
            description: 'Auto-generated from the title as you type. Lowercase, hyphens only — e.g. unreal-engine-lighting-showcase.',
            components: { Field: '@/components/admin/SlugField#SlugField' },
          },
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
                // Always strip leading/trailing slashes and spaces from manually typed slugs
                if (typeof value === 'string') {
                  return value.trim().replace(/^\/+|\/+$/g, '')
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
          name: 'toolsUsed',
          label: 'Tools Used',
          type: 'relationship',
          relationTo: 'tools',
          hasMany: true,
          admin: { description: 'Tag the tools used on this project. Select multiple — tools are managed in the Tools collection.' },
        },
        {
          name: 'software',
          label: 'Software Used (Legacy)',
          type: 'array',
          admin: { hidden: true },
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
            { label: 'Archived',  value: 'archived' },
          ],
          admin: {
            description: 'Published — visible on site. Draft — hidden. Archived — hidden, kept for reference. Only admins can permanently delete.',
          },
        },
        seoGroup,
      ],
    },

    // ─── Services ────────────────────────────────────────────
    {
      slug: 'services',
      hooks: { afterChange: [revalidateCollection('services', 'home')], afterDelete: [revalidateCollection('services', 'home')] },
      admin: {
        useAsTitle: 'title',
        group: 'Services',
        description: 'Services listed on the Services page.',
        hideAPIURL: true,
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
          admin: {
            description: 'Auto-generated from the title as you type. Lowercase, hyphens only — e.g. game-art-production.',
            components: { Field: '@/components/admin/SlugField#SlugField' },
          },
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
        {
          name: 'toolsUsed',
          label: 'Tools Used',
          type: 'relationship',
          relationTo: 'tools',
          hasMany: true,
          admin: { description: 'Tools shown with logos on the service detail page. Select from the Tools collection.' },
        },
        {
          name: 'process',
          label: 'Working Process',
          type: 'array',
          admin: { description: 'Step-by-step delivery process shown on the service detail page.' },
          fields: [
            { name: 'step', label: 'Step Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
          ],
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
      hooks: { afterChange: [revalidateCollection('about')], afterDelete: [revalidateCollection('about')] },
      admin: {
        useAsTitle: 'name',
        group: 'Pages',
        description: 'Team profiles shown on the About page.',
        hideAPIURL: true,
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
      hooks: { afterChange: [revalidateCollection('home')], afterDelete: [revalidateCollection('home')] },
      admin: {
        useAsTitle: 'name',
        hidden: true,
        description: 'Client logos. Managed via Homepage → Client Logo Strip. Sector and note fields retained for future use.',
        hideAPIURL: true,
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
      hooks: { afterChange: [revalidateCollection('blog', 'home')], afterDelete: [revalidateCollection('blog', 'home')] },
      admin: {
        useAsTitle: 'title',
        group: 'Blog',
        description: 'Articles published in the Blog section.',
        hideAPIURL: true,
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
          admin: {
            description: 'Auto-generated from the title as you type. Lowercase, hyphens only — e.g. ue5-lighting-breakdown.',
            components: { Field: '@/components/admin/SlugField#SlugField' },
          },
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
                // Always strip leading/trailing slashes and spaces from manually typed slugs
                if (typeof value === 'string') {
                  return value.trim().replace(/^\/+|\/+$/g, '')
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
        seoGroup,
      ],
    },

    // ─── Contact Submissions ─────────────────────────────────
    {
      slug:   'contact-submissions',
      labels: { singular: 'Contact Submission', plural: 'Contact Submissions' },
      admin: {
        useAsTitle:     'name',
        group:          'Inquiries',
        description:    'Project briefs submitted via the website contact form.',
        defaultColumns: ['name', 'email', 'company', 'projectType', 'status', 'createdAt'],
      },
      access: {
        read:   isAdminOrAbove,
        create: () => false,    // form API uses overrideAccess: true — no manual creation
        update: isAdminOrAbove,
        delete: isSuperAdmin,
      },
      fields: [
        { name: 'name',        type: 'text',     required: true },
        { name: 'email',       type: 'email',    required: true },
        { name: 'company',     type: 'text',     label: 'Company' },
        { name: 'projectType', type: 'text',     label: 'Project Type' },
        { name: 'engine',      type: 'text',     label: 'Engine / Platform' },
        { name: 'budget',      type: 'text',     label: 'Budget Range' },
        { name: 'timeline',    type: 'text',     label: 'Timeline' },
        { name: 'message',     type: 'textarea', required: true, label: 'Message / Brief' },
        {
          name:         'status',
          type:         'select',
          defaultValue: 'new',
          options: [
            { label: 'New',      value: 'new' },
            { label: 'Reviewed', value: 'reviewed' },
            { label: 'Replied',  value: 'replied' },
            { label: 'Closed',   value: 'closed' },
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
      hooks: { afterChange: [revalidateGlobal('layout', 'home', 'contact')] },
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Settings',
        description: 'Global settings that apply across the entire website.',
        hideAPIURL: true,
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
            { name: 'email',    type: 'email', defaultValue: 'info@xqubestudio.com' },
            { name: 'phone',    type: 'text',  defaultValue: '+43 650 5207329' },
            { name: 'address',  type: 'text',  defaultValue: 'Rathausstrasse 21/12, 1010 Vienna, Austria' },
            { name: 'calendly', type: 'text',  defaultValue: 'https://calendly.com/tanvirkhandlxqsmgs' },
            {
              name: 'socialLinks',
              label: 'Social Links',
              type: 'array',
              admin: { description: 'Add, remove or reorder social handles. Each entry needs a label, URL and optionally an icon image.' },
              fields: [
                { name: 'label', label: 'Platform Name', type: 'text', required: true, admin: { description: 'e.g. LinkedIn, Facebook, ArtStation — used as icon alt text.' } },
                { name: 'url',   label: 'URL',            type: 'text', required: true },
                { name: 'icon',  label: 'Icon',           type: 'upload', relationTo: 'media', admin: { description: 'Square SVG or PNG logo. If omitted, first two letters of the platform name are shown.' } },
              ],
              defaultValue: [
                { label: 'LinkedIn',   url: 'https://www.linkedin.com/company/xqubestudio' },
                { label: 'ArtStation', url: 'https://www.artstation.com/xqubestudio' },
              ],
            },
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
          label: 'Footer Copyright Text',
          type: 'text',
          defaultValue: '© 2025 XQube Studio GmbH. All rights reserved.',
        },
        {
          name: 'legalNote',
          label: 'Footer Legal Note',
          type: 'text',
          defaultValue: 'GmbH registered in Vienna, Austria. GDPR compliant.',
          admin: { description: 'Small legal line shown under the contact details in the footer.' },
        },
      ],
    },

    // ─── Homepage ────────────────────────────────────────────
    {
      slug: 'home-page',
      label: 'Homepage',
      hooks: { afterChange: [revalidateGlobal('home')] },
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Pages',
        description: 'Edit the homepage sections, visibility toggles, hero, and bottom CTA.',
        hideAPIURL: true,
      },
      access: { read: isLoggedIn, update: isEditorOrAbove },
      fields: [
        // ── Section Visibility ───────────────────────────────────────────────────
        {
          name: 'sections',
          label: 'Section Visibility',
          type: 'group',
          admin: { description: 'Toggle sections on/off. Content is preserved when hidden — safe to re-enable at any time.' },
          fields: [
            { name: 'showStudioIntro',  label: 'Studio Intro',          type: 'checkbox', defaultValue: true },
            { name: 'showEngineBadges', label: 'Engine / Tech Badges',  type: 'checkbox', defaultValue: true },
            { name: 'showFeaturedWork', label: 'Featured Work',         type: 'checkbox', defaultValue: true },
            { name: 'showServices',     label: 'Services',              type: 'checkbox', defaultValue: true },
            { name: 'showProcess',      label: 'Process / How We Work', type: 'checkbox', defaultValue: true },
            { name: 'showShowreel',          label: 'Showreel',              type: 'checkbox', defaultValue: false },
            { name: 'showEngagementModels', label: 'Engagement Models',    type: 'checkbox', defaultValue: true },
            { name: 'showTestimonials',     label: 'Testimonials',          type: 'checkbox', defaultValue: false },
            { name: 'showBlogPreview',      label: 'Blog Preview',          type: 'checkbox', defaultValue: false },
          ],
        },

        // ── Hero ─────────────────────────────────────────────────────────────────
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
        // ── Studio Intro ──────────────────────────────────────────────────────────
        {
          name: 'studioIntro',
          label: 'Studio Intro',
          type: 'group',
          admin: { description: 'Short "who we are" block — text left, studio photo right.' },
          fields: [
            { name: 'label',     label: 'Eyebrow Label', type: 'text',     defaultValue: 'Who We Are' },
            { name: 'heading',   label: 'Heading',        type: 'text',     defaultValue: 'Built for precision. Scaled for production.' },
            { name: 'body1',     label: 'Paragraph 1',    type: 'textarea', defaultValue: 'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria. With 15+ years of hands-on delivery across gaming, XR, simulation, and AI — we work with studios worldwide to deliver AAA-quality assets at scale.' },
            { name: 'body2',     label: 'Paragraph 2',    type: 'textarea', defaultValue: 'Our three-hub model combines European business standards with world-class production capability — giving clients the reliability of a Vienna GmbH with the speed and depth of a Dhaka production team.' },
            { name: 'image',     label: 'Studio Photo',   type: 'upload',   relationTo: 'media', admin: { description: 'Landscape or 4:3 image works best.' } },
            { name: 'linkLabel', label: 'Link Text',       type: 'text',     defaultValue: 'Learn more about us' },
            { name: 'linkUrl',   label: 'Link URL',        type: 'text',     defaultValue: '/about' },
          ],
        },

        // ── Client Logo Strip ─────────────────────────────────────────────────────
        {
          name: 'featuredClients',
          label: 'Client Logo Strip',
          type: 'array',
          admin: { description: 'Logos shown in the "Trusted by studios worldwide" strip. Drag to reorder. New clients can be created inline via the picker.' },
          fields: [
            { name: 'client', label: 'Client', type: 'relationship', relationTo: 'clients', required: true },
          ],
        },

        // ── Engine / Tech Badges ──────────────────────────────────────────────────
        {
          name: 'engineBadges',
          label: 'Engine / Tech Badges',
          type: 'array',
          admin: { description: 'Tech stack chips shown on the homepage. 8–10 is the sweet spot — beyond 12 it looks cluttered. Add tools via the relationship picker — new tools can be created inline.' },
          fields: [
            { name: 'tool', label: 'Tool', type: 'relationship', relationTo: 'tools', required: true },
          ],
        },

        // ── Featured Work ─────────────────────────────────────────────────────────
        {
          name: 'featuredWork',
          label: 'Featured Work Section',
          type: 'group',
          admin: { description: 'Label and heading shown above the featured portfolio grid on the homepage.' },
          fields: [
            { name: 'label',   label: 'Eyebrow Label', type: 'text', defaultValue: 'Featured Work' },
            { name: 'heading', label: 'Heading',        type: 'text', defaultValue: 'Built for production pipelines' },
          ],
        },

        // ── Process / How We Work ─────────────────────────────────────────────────
        {
          name: 'process',
          label: 'Process / How We Work',
          type: 'group',
          fields: [
            { name: 'label',   label: 'Eyebrow Label', type: 'text', defaultValue: 'How We Work' },
            { name: 'heading', label: 'Heading',        type: 'text', defaultValue: 'From brief to delivery — every time.' },
            {
              name: 'steps',
              label: 'Process Steps',
              type: 'array',
              admin: { description: 'Add, remove, or reorder steps. 4 steps fits cleanest in the grid layout.' },
              fields: [
                { name: 'icon',        label: 'Icon (emoji)',  type: 'text',     admin: { description: 'Single emoji e.g. 📋 — shown if no step number is preferred.' } },
                { name: 'title',       label: 'Step Title',    type: 'text',     required: true },
                { name: 'description', label: 'Description',   type: 'textarea', required: true },
              ],
              defaultValue: [
                { icon: '📋', title: 'Brief & Scope',      description: 'You share references, specs, and deadline. We ask the right questions and confirm scope in writing.' },
                { icon: '🎨', title: 'Concepting',          description: 'Our artists produce blockouts, style references, and approval sketches before committing to production.' },
                { icon: '⚙️', title: 'Production',          description: 'High-poly sculpt → retopo → UV → bake → texture → rig. Weekly progress updates throughout.' },
                { icon: '✅', title: 'Delivery & Handoff',  description: 'Final assets in your target format, optimised for your engine. Full IP transfer on completion.' },
              ],
            },
          ],
        },

        // ── Showreel ──────────────────────────────────────────────────────────────
        {
          name: 'showreel',
          label: 'Showreel',
          type: 'group',
          admin: { description: 'Autoplays muted. Visitors can unmute with a single click.' },
          fields: [
            { name: 'label',   label: 'Eyebrow Label', type: 'text',   defaultValue: 'SHOWREEL 2025' },
            { name: 'heading', label: 'Heading',        type: 'text',   defaultValue: 'See the work in motion.' },
            { name: 'tagline', label: 'Tagline',        type: 'text',   defaultValue: 'AAA game art and XR production — delivered at scale.' },
            { name: 'video',   label: 'Showreel Video', type: 'upload', relationTo: 'media', admin: { description: 'Upload mp4 or webm to the Media Library. Pre-optimise to 720p–1080p H.264 before upload.' } },
          ],
        },

        // ── Testimonials ──────────────────────────────────────────────────────────
        {
          name: 'testimonials',
          label: 'Testimonials',
          type: 'group',
          fields: [
            { name: 'label',   label: 'Eyebrow Label', type: 'text', defaultValue: 'Client Voices' },
            { name: 'heading', label: 'Heading',        type: 'text', defaultValue: 'Trusted by studios that ship.' },
            {
              name: 'items',
              label: 'Testimonials',
              type: 'array',
              fields: [
                { name: 'quote',  label: 'Quote',          type: 'textarea', required: true, admin: { description: 'Do not include opening/closing quote marks — the design adds them.' } },
                { name: 'name',   label: 'Client Name',    type: 'text',     required: true },
                { name: 'role',   label: 'Role / Company', type: 'text',     admin: { description: 'e.g. Art Director · Ubisoft' } },
                { name: 'avatar', label: 'Photo',           type: 'upload',   relationTo: 'media', admin: { description: 'Optional headshot. Square images work best.' } },
              ],
            },
          ],
        },

        // ── Blog Preview ──────────────────────────────────────────────────────────
        {
          name: 'blogPreview',
          label: 'Blog Preview',
          type: 'group',
          admin: { description: 'Automatically pulls the 3 latest published blog posts. No content to edit here — just the section heading.' },
          fields: [
            { name: 'label',   label: 'Eyebrow Label', type: 'text', defaultValue: 'From the Studio' },
            { name: 'heading', label: 'Heading',        type: 'text', defaultValue: 'Latest insights.' },
          ],
        },

        // ── Stats ─────────────────────────────────────────────────────────────────
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
        seoGroup,
      ],
    },

    // ─── About Page ──────────────────────────────────────────
    {
      slug: 'about-page',
      label: 'About Page',
      hooks: { afterChange: [revalidateGlobal('about')] },
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Pages',
        description: 'Edit the About page hero banner, intro, credentials, hubs, and Why XQube cards.',
        hideAPIURL: true,
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
        seoGroup,
      ],
    },

    // ─── Contact Page ────────────────────────────────────────
    {
      slug: 'contact-page',
      label: 'Contact Page',
      hooks: { afterChange: [revalidateGlobal('contact')] },
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Pages',
        description: 'Edit the Contact page headline, subtext, and Calendly button label.',
        hideAPIURL: true,
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
        seoGroup,
      ],
    },

    // ─── Services Page ───────────────────────────────────────
    {
      slug: 'services-page',
      label: 'Services Page',
      hooks: { afterChange: [revalidateGlobal('services')] },
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Services',
        description: 'Edit the Services page hero text and bottom CTA.',
        hideAPIURL: true,
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
              name: 'categoryLabel',
              label: 'Tab Category',
              type: 'text',
              admin: {
                description: 'Groups this pipeline under a tab — e.g. "Modeling", "Texturing", "Rigging". Must match exactly (case-sensitive) across all pipelines in the same tab. Leave blank and it will appear under "Uncategorized".',
              },
            },
            {
              name: 'categoryOrder',
              label: 'Tab Order',
              type: 'number',
              admin: {
                description: 'Controls which tab appears first. Set the same number on every pipeline in a tab — e.g. Modeling=1, Texturing=2, Rigging=3. Lower number = earlier tab.',
              },
            },
            {
              name: 'image',
              label: 'Pipeline Image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional showcase image for this pipeline (e.g. a rendered asset).' },
            },
          ],
        },
        seoGroup,
      ],
    },

    // ─── Portfolio Page ──────────────────────────────────────
    {
      slug: 'portfolio-page',
      label: 'Portfolio Page',
      hooks: { afterChange: [revalidateGlobal('portfolio')] },
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Portfolio',
        description: 'Edit the Portfolio listing page hero section and control the display order of portfolio items.',
        hideAPIURL: true,
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
        {
          name: 'portfolioOrder',
          label: 'Portfolio Display Order',
          type: 'array',
          admin: {
            description: 'Drag the ⠿ handle on each row to set the display order on the Portfolio page and homepage. After publishing a new item, add it here. Items not listed appear at the end sorted by newest first.',
            initCollapsed: false,
          },
          fields: [
            {
              name: 'item',
              label: 'Portfolio Item',
              type: 'relationship',
              relationTo: 'portfolio',
              required: true,
            },
          ],
        },
        seoGroup,
      ],
    },

    // ─── Blog Page ───────────────────────────────────────────
    {
      slug: 'blog-page',
      label: 'Blog Page',
      hooks: { afterChange: [revalidateGlobal('blog')] },
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Blog',
        description: 'Edit the Blog listing page hero section.',
        hideAPIURL: true,
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
        seoGroup,
      ],
    },

    // ─── Navigation ──────────────────────────────────────────
    {
      slug: 'navigation',
      label: 'Navigation',
      hooks: { afterChange: [revalidateGlobal('layout')] },
      versions: { drafts: { autosave: { interval: 800 } } },
      admin: {
        group: 'Settings',
        description: 'Manage the header menu links and call-to-action button.',
        hideAPIURL: true,
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
            { name: 'label',   type: 'text',     required: true },
            { name: 'url',     type: 'text',     required: true },
            { name: 'visible', type: 'checkbox', defaultValue: true, admin: { description: 'Uncheck to hide this link from the nav without deleting it.' } },
          ],
          defaultValue: [
            { label: 'Home',      url: '/',          visible: true },
            { label: 'About',     url: '/about',     visible: true },
            { label: 'Services',  url: '/services',  visible: true },
            { label: 'Portfolio', url: '/portfolio', visible: true },
            { label: 'Blog',      url: '/blog',      visible: false },
            { label: 'Contact',   url: '/contact',   visible: true },
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
      {
        name: '20260520_homepage_sections',
        up: homepageSectionsMigration.up,
        down: homepageSectionsMigration.down,
      },
      {
        name: '20260520_portfolio_order',
        up: portfolioOrderMigration.up,
        down: portfolioOrderMigration.down,
      },
      {
        name: '20260520_featured_work_copy',
        up: featuredWorkCopyMigration.up,
        down: featuredWorkCopyMigration.down,
      },
      {
        name: '20260520_pipeline_categories',
        up: pipelineCategoriesMigration.up,
        down: pipelineCategoriesMigration.down,
      },
      {
        name: '20260521_tools_collection',
        up: toolsCollectionMigration.up,
        down: toolsCollectionMigration.down,
      },
      {
        name: '20260522_tools_rels_columns',
        up: toolsRelsColumnsMigration.up,
        down: toolsRelsColumnsMigration.down,
      },
      {
        name: '20260522_homepage_badges_to_tools',
        up: homepageBadgesToToolsMigration.up,
        down: homepageBadgesToToolsMigration.down,
      },
      {
        name: '20260522_homepage_version_engine_badges',
        up: homepageVersionEngineBadgesMigration.up,
        down: homepageVersionEngineBadgesMigration.down,
      },
      {
        name: '20260522_homepage_featured_clients',
        up: homepageFeaturedClientsMigration.up,
        down: homepageFeaturedClientsMigration.down,
      },
      {
        name: '20260522_nav_link_visibility',
        up: navLinkVisibilityMigration.up,
        down: navLinkVisibilityMigration.down,
      },
      {
        name: '20260522_site_settings_legal_note',
        up: siteSettingsLegalNoteMigration.up,
        down: siteSettingsLegalNoteMigration.down,
      },
      {
        name: '20260522_site_settings_social_links',
        up: siteSettingsSocialLinksMigration.up,
        down: siteSettingsSocialLinksMigration.down,
      },
      {
        name: '20260522_media_folders',
        up: mediaFoldersMigration.up,
        down: mediaFoldersMigration.down,
      },
      {
        name: '20260522_seo_fields',
        up: seoFieldsMigration.up,
        down: seoFieldsMigration.down,
      },
      {
        name: '20260522_portfolio_tools_hasMany',
        up: portfolioToolsHasManyMigration.up,
        down: portfolioToolsHasManyMigration.down,
      },
      {
        name: '20260523_users_must_change_password',
        up: usersMustChangePasswordMigration.up,
        down: usersMustChangePasswordMigration.down,
      },
      {
        name: '20260523_contact_submissions',
        up: contactSubmissionsMigration.up,
        down: contactSubmissionsMigration.down,
      },
      {
        name: '20260524_contact_submissions_rels',
        up: contactSubmissionsRelsMigration.up,
        down: contactSubmissionsRelsMigration.down,
      },
      {
        name: '20260524_services_tools_rel',
        up: servicesToolsRelMigration.up,
        down: servicesToolsRelMigration.down,
      },
      {
        name: '20260524_services_process',
        up: servicesProcessMigration.up,
        down: servicesProcessMigration.down,
      },
      {
        name: '20260526_homepage_engagement_toggle',
        up: homepageEngagementToggleMigration.up,
        down: homepageEngagementToggleMigration.down,
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
