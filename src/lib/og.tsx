import { ImageResponse } from 'next/og'

export const ogSize        = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

/**
 * Shared OG image generator for all pages.
 * Renders a branded 1200×630 image using the XQube design system.
 */
export function generateOGImage(title: string, label?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle green grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(20,203,114,0.04) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(20,203,114,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* Left accent bar */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: '5px',
          background: '#14CB72',
          display: 'flex',
        }} />

        {/* Glow blob top-right */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-80px',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(20,203,114,0.08) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* ── Top: Brand mark ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* X icon */}
          <div style={{
            width: '52px',
            height: '52px',
            border: '2px solid #14CB72',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              color: '#14CB72',
              fontSize: '30px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-2px',
            }}>X</span>
          </div>

          {/* Wordmark */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '5px',
              lineHeight: 1,
            }}>XQUBE</span>
            <span style={{
              color: '#8D95A8',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '7px',
            }}>STUDIO</span>
          </div>
        </div>

        {/* ── Middle: Page title ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '920px' }}>
          {label && (
            <span style={{
              color: '#14CB72',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}>
              {label}
            </span>
          )}
          <span style={{
            color: '#ffffff',
            fontSize: title.length > 35 ? '56px' : title.length > 22 ? '66px' : '76px',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-2px',
          }}>
            {title}
          </span>
        </div>

        {/* ── Bottom: Tagline + domain ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid #1A1A1A',
          paddingTop: '24px',
        }}>
          <span style={{
            color: '#8D95A8',
            fontSize: '17px',
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}>
            Game Art · XR Production · Vienna · Dubai · Dhaka
          </span>
          <span style={{
            color: '#14CB72',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}>
            xqubestudio.com
          </span>
        </div>
      </div>
    ),
    ogSize,
  )
}
