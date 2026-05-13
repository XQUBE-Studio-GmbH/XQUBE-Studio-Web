import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

export const metadata: Metadata = {
  title: 'Blog & Insights',
  description: 'Insights on game art production, XR development, and studio operations from XQube Studio.',
  openGraph: {
    title: 'Blog & Insights | XQube Studio',
    description: 'Insights on game art production, XR development, and studio operations.',
    url: 'https://www.xqubestudio.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | XQube Studio',
    description: 'Insights on game art production, XR development, and studio operations.',
  },
}

export const revalidate = 60

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  createdAt?: string
  updatedAt?: string
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 100,
    })
    return res.docs as unknown as BlogPost[]
  } catch {
    return []
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function BlogPage() {
  const posts = await getPosts()
  const hasPosts = posts.length > 0

  return (
    <section className="xq-section">
      <div className="xq-container">
        <div className="xq-label mb-4">Insights</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">Blog</h1>
        <p className="text-xq-muted text-lg max-w-xl mb-16">
          Insights on game art production, XR development, and studio operations.
        </p>

        {hasPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group xq-card flex flex-col hover:border-xq-accent/60 transition-colors"
              >
                <div className="text-xq-muted text-xs mb-3">{formatDate(post.createdAt)}</div>
                <h2 className="text-white font-bold leading-snug mb-3 group-hover:text-xq-accent transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-xq-muted text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                )}
                <div className="mt-4 text-xq-accent text-xs font-semibold">Read article →</div>
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
  )
}
