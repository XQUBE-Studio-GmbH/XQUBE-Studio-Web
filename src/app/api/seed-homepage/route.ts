/**
 * One-time seed route — pre-fills the home-page global with the copy
 * that the frontend already shows as hardcoded fallbacks.
 *
 * DELETE THIS FILE after running.
 *
 * Usage (dev server running):
 *   curl -X POST http://localhost:3000/api/seed-homepage \
 *     -H "x-seed-token: SEED_HOMEPAGE"
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

export async function POST(req: NextRequest) {
  if (req.headers.get('x-seed-token') !== 'SEED_HOMEPAGE') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        sections: {
          showStudioIntro:  true,
          showEngineBadges: true,
          showFeaturedWork: true,
          showServices:     true,
          showProcess:      true,
          showShowreel:     false,
          showTestimonials: false,
          showBlogPreview:  false,
        },
        studioIntro: {
          label:     'Who We Are',
          heading:   'Built for precision. Scaled for production.',
          body1:     'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria. With 15+ years of hands-on delivery across gaming, XR, simulation, and AI — we work with studios worldwide to deliver AAA-quality assets at scale.',
          body2:     'Our three-hub model combines European business standards with world-class production capability — giving clients the reliability of a Vienna GmbH with the speed and depth of a Dhaka production team.',
          linkLabel: 'Learn more about us',
          linkUrl:   '/about',
        },
        engineBadges: [
          { name: 'Unreal Engine 5' },
          { name: 'Unity' },
          { name: 'UEFN' },
          { name: 'Roblox' },
          { name: 'Blender' },
          { name: 'Maya' },
          { name: 'ZBrush' },
          { name: 'Substance Painter' },
        ],
        process: {
          label:   'How We Work',
          heading: 'From brief to delivery — every time.',
          steps: [
            { icon: '📋', title: 'Brief & Scope',     description: 'You share references, specs, and deadline. We ask the right questions and confirm scope in writing.' },
            { icon: '🎨', title: 'Concepting',         description: 'Our artists produce blockouts, style references, and approval sketches before committing to production.' },
            { icon: '⚙️', title: 'Production',         description: 'High-poly sculpt → retopo → UV → bake → texture → rig. Weekly progress updates throughout.' },
            { icon: '✅', title: 'Delivery & Handoff', description: 'Final assets in your target format, optimised for your engine. Full IP transfer on completion.' },
          ],
        },
        showreel: {
          label:   'SHOWREEL 2025',
          heading: 'See the work in motion.',
          tagline: 'AAA game art and XR production — delivered at scale.',
        },
        testimonials: {
          label:   'Client Voices',
          heading: 'Trusted by studios that ship.',
          items:   [],
        },
        blogPreview: {
          label:   'From the Studio',
          heading: 'Latest insights.',
        },
        stats: [
          { value: '15+', label: 'Years Experience' },
          { value: '80+', label: 'Clients Worldwide' },
          { value: '20+', label: 'Core Team Members' },
          { value: '3',   label: 'Global Hubs' },
        ],
        cta: {
          headline:    'Looking for a long-term art partner?',
          subtitle:    'We might be the right fit.',
          buttonLabel: 'Start a Conversation',
          buttonUrl:   '/contact',
        },
      } as any,
    })

    return NextResponse.json({ success: true, message: 'Home page seeded. Delete src/app/api/seed-homepage/ now.' })
  } catch (err) {
    console.error('[seed-homepage]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
