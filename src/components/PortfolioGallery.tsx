'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface GalleryItem {
  id: string
  image: { url?: string; alt?: string; width?: number; height?: number }
  caption?: string
}

interface Props {
  items: GalleryItem[]
  title: string
}

export default function PortfolioGallery({ items, title }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const open  = (i: number) => setLightboxIndex(i)
  const close = useCallback(() => setLightboxIndex(null), [])

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length))
  }, [items.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length))
  }, [items.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      close()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, close, prev, next])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null

  return (
    <>
      {/* Gallery grid */}
      <div className={`grid gap-3 ${items.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {items.map((g, i) =>
          g.image?.url ? (
            <button
              key={g.id}
              type="button"
              onClick={() => open(i)}
              className={`relative overflow-hidden rounded-lg border border-xq-border group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-xq-accent ${
                i === 0 && items.length > 2 ? 'sm:col-span-2' : ''
              }`}
              aria-label={`Open image ${i + 1}: ${g.caption || g.image.alt || title}`}
            >
              <div className="relative aspect-video">
                <Image
                  src={g.image.url}
                  alt={g.image.alt || g.caption || `${title} — view ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                {/* Zoom hint overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg"
                    fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0v.01M11 8v3m0 0v3m0-3h3m-3 0H8" />
                  </svg>
                </div>
              </div>
              {g.caption && (
                <div className="px-3 py-2 bg-xq-surface border-t border-xq-border">
                  <p className="text-xq-muted text-xs">{g.caption}</p>
                </div>
              )}
            </button>
          ) : null
        )}
      </div>

      {/* Lightbox */}
      {activeItem?.image?.url && (
        // Outer backdrop — clicking dark area closes
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Top bar — sits above everything, doesn't block backdrop */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
            <span className="text-white/60 text-sm font-medium select-none">
              {lightboxIndex! + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); close() }}
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Centred image — only the image itself stops propagation */}
          <div className="flex flex-col items-center justify-center w-full h-full px-12 md:px-20 pt-12 pb-6 pointer-events-none">
            <div
              className="relative max-w-5xl w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeItem.image.url}
                alt={activeItem.image.alt || activeItem.caption || title}
                width={activeItem.image.width || 1920}
                height={activeItem.image.height || 1080}
                className="w-full h-auto object-contain rounded-lg"
                style={{ maxHeight: 'calc(100vh - 140px)' }}
                priority
              />
            </div>
            {activeItem.caption && (
              <p className="text-white/60 text-sm mt-3 text-center max-w-xl pointer-events-auto">{activeItem.caption}</p>
            )}
          </div>

          {/* Prev / Next arrows */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
