/**
 * One-time script: convert all existing JPG/PNG images in the Media Library to WebP.
 *
 * What it does:
 *  1. Queries the `media` table for non-WebP images.
 *  2. Downloads each original file from DO Spaces.
 *  3. Converts to WebP at quality 85 using sharp.
 *  4. Uploads the WebP back to DO Spaces with acl: public-read.
 *  5. Updates the DB record in-place (same document ID → all CMS references auto-update).
 *  6. Deletes the old file from DO Spaces.
 *
 * Document IDs are unchanged — every portfolio item, service, etc. that references
 * a media document by ID will automatically serve the WebP URL after the migration.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/migrate-images-to-webp.ts            # dry run
 *   npx tsx --env-file=.env.local scripts/migrate-images-to-webp.ts --execute  # apply changes
 *
 * Skipped automatically: image/webp, image/svg+xml, image/gif, videos.
 * Safe to re-run — already-converted images are skipped.
 */

import { Client } from 'pg'
import sharp from 'sharp'
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'

// ─── Config ───────────────────────────────────────────────────────────────────

const DRY_RUN = !process.argv.includes('--execute')

const DATABASE_URI = process.env.DATABASE_URI
if (!DATABASE_URI) { console.error('❌  DATABASE_URI not set'); process.exit(1) }

const BUCKET   = process.env.DO_SPACES_BUCKET  || 'xqube-web-media'
const REGION   = process.env.DO_SPACES_REGION  || 'fra1'
const KEY      = process.env.DO_SPACES_KEY
const SECRET   = process.env.DO_SPACES_SECRET

if (!KEY || !SECRET) { console.error('❌  DO_SPACES_KEY / DO_SPACES_SECRET not set'); process.exit(1) }

const s3 = new S3Client({
  credentials: { accessKeyId: KEY, secretAccessKey: SECRET },
  endpoint:    `https://${REGION}.digitaloceanspaces.com`,
  region:      REGION,
  forcePathStyle: false,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cleanDatabaseUrl(url: string): string {
  return url
    // Strip doubled prefix that sometimes appears in Supabase pooler URLs
    .replace(/^postgresqlpostgresql:\/\//, 'postgresql://')
    // Strip ?pgbouncer=true — it is a Drizzle/postgres.js hint, not valid for pg
    .replace(/[?&]pgbouncer=true/gi, '')
    // Clean up any trailing ? left after stripping
    .replace(/\?$/, '')
    // Switch from transaction pooler (6543) to session pooler (5432).
    // Port 6543 rejects connections from local machines (PgBouncer tenant lookup
    // behaves differently outside Vercel's network). Port 5432 works fine for a
    // local script running a single connection — no serverless limits apply here.
    .replace(/:6543\//, ':5432/')
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

function newFilename(original: string): string {
  return original.replace(/\.(jpe?g|png|tiff?|bmp|avif|webm)$/i, '.webp')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🖼️  WebP Migration Script')
  console.log('─'.repeat(50))
  console.log(`Mode   : ${DRY_RUN ? '🔍 DRY RUN  (no changes made)' : '⚡ EXECUTE  (changes WILL be applied)'}`)
  console.log(`Bucket : ${BUCKET}`)
  console.log(`Region : ${REGION}\n`)

  // Parse the URL manually and pass individual params to pg.
  // pg's own URL parser mis-handles Supabase's newer username format
  // (postgres.PROJECT_REF contains a dot) and tries to resolve the username
  // as a hostname. Node's built-in URL class parses it correctly.
  const dbUrl = new URL(cleanDatabaseUrl(DATABASE_URI!))
  const db = new Client({
    host:     dbUrl.hostname,
    port:     parseInt(dbUrl.port || '6543'),
    database: dbUrl.pathname.replace(/^\//, ''),
    user:     dbUrl.username,
    password: dbUrl.password,
    ssl:      { rejectUnauthorized: false },
  })
  await db.connect()

  // ── Query non-WebP images ─────────────────────────────────────────────────
  const { rows: images } = await db.query<{
    id: string
    filename: string
    mime_type: string
    filesize: number
    prefix: string | null
  }>(`
    SELECT id, filename, mime_type, filesize, prefix
    FROM   media
    WHERE  mime_type LIKE 'image/%'
      AND  mime_type NOT IN ('image/webp', 'image/svg+xml', 'image/gif')
    ORDER  BY created_at ASC
  `)

  if (images.length === 0) {
    console.log('✅  All images are already WebP or SVG/GIF. Nothing to migrate.')
    await db.end()
    return
  }

  console.log(`Found ${images.length} image(s) to convert:\n`)

  let converted = 0
  let skipped   = 0
  let failed    = 0
  let savedBytes = 0

  for (const img of images) {
    const s3Key  = img.prefix ? `${img.prefix}/${img.filename}` : img.filename
    const webpName = newFilename(img.filename)
    const newKey = img.prefix ? `${img.prefix}/${webpName}` : webpName

    if (webpName === img.filename) {
      // filename already ends in .webp but mimeType was wrong — just fix the mimeType
      console.log(`  ⏭️  SKIP  ${img.filename}  (filename already .webp)`)
      skipped++
      continue
    }

    const originalKb = ((img.filesize || 0) / 1024).toFixed(0)
    process.stdout.write(`  📷  ${img.filename}  (${originalKb} KB)  →  ${webpName} … `)

    if (DRY_RUN) {
      console.log('[DRY RUN]')
      converted++
      continue
    }

    try {
      // 1. Download original from S3
      const getRes = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: s3Key }))
      const original = await streamToBuffer(getRes.Body as Readable)

      // 2. Convert to WebP
      const webp = await sharp(original).webp({ quality: 85 }).toBuffer()
      const meta = await sharp(webp).metadata()

      // 3. Upload WebP
      await s3.send(new PutObjectCommand({
        Bucket:      BUCKET,
        Key:         newKey,
        Body:        webp,
        ContentType: 'image/webp',
        ACL:         'public-read' as const,
      }))

      // 4. Update DB record (same id — all references auto-update)
      await db.query(
        `UPDATE media
            SET filename  = $1,
                mime_type = 'image/webp',
                filesize  = $2,
                width     = $3,
                height    = $4
          WHERE id = $5`,
        [webpName, webp.byteLength, meta.width ?? null, meta.height ?? null, img.id],
      )

      // 5. Delete old file from S3
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key }))

      const newKb  = (webp.byteLength / 1024).toFixed(0)
      const saving = img.filesize ? Math.round((1 - webp.byteLength / img.filesize) * 100) : 0
      savedBytes += (img.filesize || 0) - webp.byteLength
      console.log(`✅  ${originalKb} KB → ${newKb} KB  (${saving}% smaller)`)
      converted++
    } catch (err) {
      console.log(`❌  ${(err as Error).message}`)
      failed++
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(50))
  console.log('📊  Summary')
  console.log(`    Converted : ${converted}`)
  console.log(`    Skipped   : ${skipped}`)
  console.log(`    Failed    : ${failed}`)
  if (!DRY_RUN && savedBytes > 0) {
    console.log(`    Saved     : ${(savedBytes / 1024 / 1024).toFixed(1)} MB`)
  }
  if (DRY_RUN) {
    console.log('\n⚠️   No changes were made — this was a dry run.')
    console.log('    Add --execute to apply: npx tsx --env-file=.env.local scripts/migrate-images-to-webp.ts --execute')
  }

  await db.end()
}

main().catch((err) => {
  console.error('\n💥  Fatal error:', err.message)
  process.exit(1)
})
