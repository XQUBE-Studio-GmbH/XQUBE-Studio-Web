/**
 * Top-level loading state for all frontend routes.
 * Shown while a server component is streaming / fetching data.
 * Keeps the navbar/footer visible (they're in the layout) while
 * the page content loads — this placeholder fills the content area only.
 */
export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated accent bar */}
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1.5 h-8 bg-xq-accent rounded-full animate-pulse"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
        <p className="text-xq-muted text-sm tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  )
}
