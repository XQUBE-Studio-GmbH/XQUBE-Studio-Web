'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLivePreview } from '@payloadcms/live-preview-react'
import ScrollReveal from '@/components/ScrollReveal'
import PageHero from '@/components/PageHero'
import { getLivePreviewServerURL } from '@/lib/livePreview'
import type { BlogPageGlobal, BlogPost, MediaRef } from '@/types/cms'

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
    serverURL: getLivePreviewServerURL(serverURL),
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
      <PageHero
        label={heroLabel}
        heading={heroHeading}
        subtitle={heroSubtitle}
        image={heroImage}
      />

      {/* ── Blog grid ──────────────────────────────────────────────────────── */}
      <section className="border-t border-xq-border pb-32">
        <div className="xq-container mt-12">
          {hasPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 80}>
                <Link
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
                </ScrollReveal>
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
