import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Browse XQube Studio\'s portfolio of AAA game art — characters, weapons, vehicles, environments, props, and VR assets.',
}

const categories = ['All', 'Characters', 'Weapons', 'Vehicles', 'Environments', 'Props', 'VR Assets']

export default function PortfolioPage() {
  return (
    <>
      <section className="xq-section">
        <div className="xq-container">
          <div className="xq-label mb-4">Our Work</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Portfolio</h1>
          <p className="text-xq-muted text-lg max-w-xl">
            AAA-quality game art delivered for studios worldwide. Browse by category below.
          </p>
        </div>
      </section>

      <section className="border-t border-xq-border pb-32">
        <div className="xq-container mt-12">
          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button key={cat}
                className={`px-4 py-2 rounded text-sm font-semibold border transition-colors ${
                  cat === 'All'
                    ? 'bg-xq-accent text-black border-xq-accent'
                    : 'border-xq-border text-xq-muted hover:border-xq-accent hover:text-xq-accent'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Portfolio grid placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="xq-card aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xq-muted text-sm mb-2">Portfolio Item {i + 1}</div>
                  <div className="text-xs text-xq-muted/50">Add via Admin Panel</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xq-muted mb-6">Want to see work relevant to your project?</p>
            <Link href="https://calendly.com/tanvirkhandlxqsmgs" target="_blank" rel="noopener noreferrer"
              className="xq-btn-primary text-base px-8 py-4">
              Book a Call to See More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
