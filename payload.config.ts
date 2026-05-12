import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'
import { Portfolio } from './src/collections/Portfolio'
import { Services } from './src/collections/Services'
import { TeamMembers } from './src/collections/TeamMembers'
import { ClientLogos } from './src/collections/ClientLogos'
import { BlogPosts } from './src/collections/BlogPosts'
import { Inquiries } from './src/collections/Inquiries'
import { SiteSettings } from './src/collections/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— XQube Studio CMS',
      favicon: '/favicon.ico',
    },
    components: {},
  },

  collections: [
    Users,
    Media,
    Pages,
    Portfolio,
    Services,
    TeamMembers,
    ClientLogos,
    BlogPosts,
    Inquiries,
  ],

  globals: [SiteSettings],

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET || 'xqube-secret-change-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  upload: {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  },

  plugins: [],

  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],

  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],
})
