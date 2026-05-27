import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import AboutPageClient from '@/components/live-preview/AboutPageClient'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { BASE_URL, LOGO_URL } from '@/lib/jsonLd'
import { getAboutData } from '@/lib/cachedData'
import type { AboutGlobal } from '@/types/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'about-page', depth: 1 }) as AboutGlobal
    return buildPageMetadata({
      seo: page?.seo,
      defaultTitle: 'About',
      defaultDescription: 'XQube Studio GmbH is a game art and XR production studio registered in Vienna, Austria, with production hubs in Dubai and Dhaka. 15+ years experience, 80+ clients worldwide.',
      url: 'https://www.xqubestudio.com/about',
      ogTitle: 'About XQube Studio | A Studio Built for Precision',
    })
  } catch {
    return { title: 'About', description: 'XQube Studio GmbH — Vienna · Dubai · Dhaka.' }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const { ap, teamMembers } = await getAboutData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return (
    <>
      {/* Organization + team (Person[]) structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'Organization',
            name:        'XQUBE Studio GmbH',
            url:          BASE_URL,
            logo:         LOGO_URL,
            description: 'AAA game art and XR production studio. Vienna · Dubai · Dhaka.',
            ...(teamMembers.length > 0
              ? {
                  employee: teamMembers.map((m) => ({
                    '@type':    'Person',
                    name:        m.name,
                    jobTitle:    m.role || undefined,
                    description: m.bio  || undefined,
                    image:       (m.photo as { url?: string } | null)?.url || undefined,
                  })),
                }
              : {}),
          }),
        }}
      />
      <AboutPageClient
        initialData={ap}
        teamMembers={teamMembers}
        serverURL={serverURL}
      />
    </>
  )
}
