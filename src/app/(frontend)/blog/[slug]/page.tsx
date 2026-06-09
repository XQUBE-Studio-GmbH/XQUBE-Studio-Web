import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { buildBreadcrumbList, BASE_URL, LOGO_URL, ORG_REF } from '@/lib/jsonLd'
import { getBlogPostBySlug } from '@/lib/cachedData'

// force-dynamic: prevents build-time DB calls; rendered at request time instead.
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: unknown
  createdAt?: string
  updatedAt?: string
  status?: string
  coverImage?: { url?: string; alt?: string } | null
  seo?: {
    title?: string | null
    description?: string | null
    image?: { url?: string } | null
    noIndex?: boolean | null
  } | null
}

async function getPost(slug: string): Promise<BlogPost | null> {
  return getBlogPostBySlug(slug) as Promise<BlogPost | null>
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not Found' }
  return buildPageMetadata({
    seo: post.seo,
    defaultTitle: `${post.title} | XQUBE Studio Blog`,
    defaultDescription: post.excerpt || `${post.title} — insights from XQUBE Studio.`,
    url: `https://www.xqubestudio.com/blog/${slug}`,
    ogTitle: `${post.title} | XQUBE Studio Blog`,
    ogImage: post.coverImage?.url || undefined,
    ogType: 'article',
  })
}

// generateStaticParams removed: force-dynamic renders all slugs on-demand at
// request time. No pre-rendering happens at build, so no build-time DB call.

// Minimal Lexical-to-HTML serialiser — handles the core node types Payload uses
function serializeLexical(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const node = content as Record<string, unknown>

  if (node.root) return serializeLexical(node.root)

  const children = Array.isArray(node.children)
    ? (node.children as unknown[]).map(serializeLexical).join('')
    : ''

  switch (node.type) {
    case 'root':        return children
    case 'paragraph':   return `<p>${children}</p>`
    case 'heading': {
      const tag = `h${node.tag ?? 2}`
      return `<${tag}>${children}</${tag}>`
    }
    case 'list':        return node.listType === 'bullet' ? `<ul>${children}</ul>` : `<ol>${children}</ol>`
    case 'listitem':    return `<li>${children}</li>`
    case 'quote':       return `<blockquote>${children}</blockquote>`
    case 'code':        return `<pre><code>${children}</code></pre>`
    case 'text': {
      let text = String(node.text ?? '')
      if ((node.format as number) & 1)  text = `<strong>${text}</strong>`
      if ((node.format as number) & 2)  text = `<em>${text}</em>`
      if ((node.format as number) & 8)  text = `<u>${text}</u>`
      if ((node.format as number) & 16) text = `<s>${text}</s>`
      if ((node.format as number) & 32) text = `<code>${text}</code>`
      return text
    }
    case 'link': {
      const url = (node.fields as Record<string, unknown>)?.url ?? node.url ?? '#'
      const target = (node.fields as Record<string, unknown>)?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${url}"${target}>${children}</a>`
    }
    case 'linebreak': return '<br />'
    default: return children
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const htmlContent = post.content ? serializeLexical(post.content) : ''

  const postUrl = `${BASE_URL}/blog/${post.slug}`

  return (
    <>
      {/* BlogPosting structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':       'https://schema.org',
            '@type':          'BlogPosting',
            headline:         post.title,
            description:      post.seo?.description || post.excerpt || undefined,
            image:            post.seo?.image?.url || post.coverImage?.url || undefined,
            datePublished:    post.createdAt,
            dateModified:     post.updatedAt || post.createdAt,
            url:              postUrl,
            mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
            author:           { ...ORG_REF, name: 'XQUBE Studio' },
            publisher: {
              ...ORG_REF,
              name:  'XQUBE Studio',
              logo:  { '@type': 'ImageObject', url: LOGO_URL },
            },
          }),
        }}
      />
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbList([
            { name: 'Home', url: BASE_URL },
            { name: 'Blog', url: `${BASE_URL}/blog` },
            { name: post.title, url: postUrl },
          ])),
        }}
      />

      <section className="xq-section">
        <div className="xq-container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-xq-muted mb-8">
            <Link href="/blog" className="hover:text-xq-accent transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white truncate max-w-[300px]">{post.title}</span>
          </nav>

          <div className="max-w-2xl">
            <div className="xq-label mb-4">Insights</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xq-muted text-lg leading-relaxed mb-6">{post.excerpt}</p>
            )}
            {post.createdAt && (
              <div className="text-xq-muted text-sm border-t border-xq-border pt-4">
                Published {formatDate(post.createdAt)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cover image */}
      {post.coverImage?.url && (
        <section className="border-t border-xq-border">
          <div className="xq-container py-8">
            <div className="relative aspect-video max-w-4xl rounded-xl overflow-hidden border border-xq-border">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 4rem), 896px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Article body */}
      <section className="border-t border-xq-border pb-24">
        <div className="xq-container mt-12">
          <div className="max-w-2xl">
            {htmlContent ? (
              <div
                className="prose prose-invert prose-sm md:prose-base
                  prose-headings:font-black prose-headings:text-white
                  prose-p:text-xq-muted prose-p:leading-relaxed
                  prose-a:text-xq-accent prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-blockquote:border-xq-accent prose-blockquote:text-xq-muted
                  prose-code:text-xq-accent prose-code:bg-xq-surface prose-code:px-1 prose-code:rounded
                  prose-pre:bg-xq-surface prose-pre:border prose-pre:border-xq-border
                  prose-ul:text-xq-muted prose-ol:text-xq-muted
                  max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              <p className="text-xq-muted">No content available for this article.</p>
            )}
          </div>
        </div>
      </section>

      {/* Back / CTA */}
      <section className="xq-section border-t border-xq-border bg-xq-surface">
        <div className="xq-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link href="/blog" className="xq-btn-ghost text-sm px-6 py-3">
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-4">
              <p className="text-xq-muted text-sm">Have a project in mind?</p>
              <Link href="/contact" className="xq-btn-primary text-sm px-6 py-3">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
