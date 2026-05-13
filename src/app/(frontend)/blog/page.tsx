import type { Metadata } from 'next'

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

export default function BlogPage() {
  return (
    <section className="xq-section">
      <div className="xq-container">
        <div className="xq-label mb-4">Insights</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">Blog</h1>
        <p className="text-xq-muted text-lg max-w-xl mb-16">
          Insights on game art production, XR development, and studio operations.
          Articles coming soon — powered by Pritom AI.
        </p>
        <div className="xq-card py-16 text-center">
          <p className="text-xq-muted">Articles will appear here once published via the admin panel.</p>
        </div>
      </div>
    </section>
  )
}
