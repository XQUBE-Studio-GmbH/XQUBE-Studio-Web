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
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#060e08] to-[#0a1f13]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(20,203,114,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {heroImage?.url && (
          <div className="absolute inset-0">
            <Image src={heroImage.url} alt={heroImage.alt || heroHeading} fill className="object-cover" priority />
          </div>
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        {/* Text */}
        <div className="xq-container relative z-10">
          <div className="max-w-3xl">
            <div className="xq-label mb-6">{heroLabel}</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6 leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">{heroHeading}</h1>
            {heroSubtitle && (
              <p className="text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">{heroSubtitle}</p>
            )}
          </div>
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
