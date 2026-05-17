'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLivePreview } from '@payloadcms/live-preview-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaRef { url?: string; alt?: string }

interface BlogPageGlobal {
  hero?: {
    label?:    string
    heading?:  string
    subtitle?: string
    image?:    MediaRef | null
  }
}

interface BlogPost {
  id:          string
  title:       string
  slug:        string
  excerpt?:    string
  createdAt?:  string
  coverImage?: { url?: string; alt?: string } | null
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

const FB = {
  label:    'Insights',
  heading:  'Behind the Studio',
  subtitle: 'Thoughts on game art production, XR development, and studio operations from the XQube team.',
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialData: BlogPageGlobal
  posts:       BlogPost[]
  serverURL:   string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BlogPageClient({ initialData, posts, serverURL }: Props) {
  const { data: bp } = useLivePreview<BlogPageGlobal>({
    initialData,
    serverURL: typeof window !== 'undefined'
      ? (window !== window.parent && document.referrer
        ? new URL(document.referrer).origin
        : window.location.origin)
      : serverURL,
    depth: 2,
  })

  const heroLabel    = bp.hero?.label    ?? FB.label
  const heroHeading  = bp.hero?.heading  ?? FB.heading
  const heroSubtitle = bp.hero?.subtitle ?? FB.subtitle
  const heroImage    = bp.hero?.image as MediaRef | null | undefined

  const hasPosts = posts.length > 0

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="xq-section">
        <div className="xq-container">
          {heroImage?.url ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="xq-label mb-4">{heroLabel}</div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">{heroHeading}</h1>
                <p className="text-xq-muted text-lg leading-relaxed">{heroSubtitle}</p>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-xq-border hidden lg:block">
                <Image src={heroImage.url} alt={heroImage.alt || heroHeading} fill className="object-cover" priority />
              </div>
            </div>
          ) : (
            <>
              <div className="xq-label mb-4">{heroLabel}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6 max-w-2xl">{heroHeading}</h1>
              <p className="text-xq-muted text-lg max-w-2xl leading-relaxed">{heroSubtitle}</p>
            </>
          )}
        </div>
      </section>

      {/* ── Blog grid ──────────────────────────────────────────────────────── */}
      <section className="border-t border-xq-border pb-32">
        <div className="xq-container mt-12">
          {hasPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`group xq-card flex flex-col hover:border-xq-accent/60 transition-colors ${post.coverImage?.url ? 'p-0 overflow-hidden' : ''}`}
                >
                  {post.coverImage?.url && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className={post.coverImage?.url ? 'p-6 flex flex-col flex-1' : 'flex flex-col flex-1'}>
                    <div className="text-xq-muted text-xs mb-3">{formatDate(post.createdAt)}</div>
                    <h2 className="text-white font-bold leading-snug mb-3 group-hover:text-xq-accent transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-xq-muted text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                    )}
                    <div className="mt-4 text-xq-accent text-xs font-semibold">Read article →</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="xq-card py-16 text-center">
              <div className="text-xq-accent text-xs font-semibold tracking-widest uppercase mb-3">Coming Soon</div>
              <h2 className="text-white font-black text-xl mb-2">Articles on the way</h2>
              <p className="text-xq-muted text-sm max-w-sm mx-auto">
                Articles will appear here once published via the admin panel.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
