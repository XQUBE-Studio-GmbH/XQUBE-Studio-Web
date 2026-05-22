import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import AboutPageClient from '@/components/live-preview/AboutPageClient'
import type { AboutGlobal, TeamMember } from '@/types/cms'
import { buildPageMetadata } from '@/lib/buildPageMetadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'about-page', depth: 1 }) as any
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

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [ap, teamRes] = await Promise.all([
      payload.findGlobal({ slug: 'about-page' }) as Promise<AboutGlobal>,
      payload.find({ collection: 'team-members', sort: 'order', limit: 50, depth: 1 }),
    ])
    return {
      ap:          ap as AboutGlobal,
      teamMembers: teamRes.docs as unknown as TeamMember[],
    }
  } catch {
    return { ap: {} as AboutGlobal, teamMembers: [] }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const { ap, teamMembers } = await getData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return (
    <AboutPageClient
      initialData={ap}
      teamMembers={teamMembers}
      serverURL={serverURL}
    />
  )
}
