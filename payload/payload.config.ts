import { buildConfig } from 'payload/config'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

// Collections
import { Users }      from './collections/Users'
import { Media }      from './collections/Media'
import { Portfolio }  from './collections/Portfolio'
import { Services }   from './collections/Services'
import {
  TeamMembers,
  Clients,
  BlogPosts,
} from './collections/ContentCollections'
import { Inquiries }  from './collections/Inquiries'

// Globals
import { SiteSettings, Navigation } from './globals/Globals'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '— XQube Admin',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
    css: path.resolve(__dirname, './admin.css'),
    components: {
      // Custom branding for admin panel
      graphics: {
        Logo: path.resolve(__dirname, '../src/components/admin/Logo.tsx'),
        Icon: path.resolve(__dirname, '../src/components/admin/Icon.tsx'),
      },
    },
  },

  editor: lexicalEditor({}),

  collections: [
    Users,
    Media,
    Portfolio,
    Services,
    TeamMembers,
    Clients,
    BlogPosts,
    Inquiries,
  ],

  globals: [
    SiteSettings,
    Navigation,
  ],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  typescript: {
    outputFile: path.resolve(__dirname, '../src/payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(__dirname, '../generated-schema.graphql'),
  },

  cors: [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ],

  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ],

  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },

  // Rate limiting for public-facing APIs
  rateLimit: {
    max: 500,
    window: 15 * 60 * 1000, // 15 minutes
  },
})
