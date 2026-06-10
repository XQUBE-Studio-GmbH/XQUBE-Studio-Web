import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'
import ServicesPageClient from '@/components/live-preview/ServicesPageClient'
import type { ServicesPageGlobal } from '@/types/cms'
import { buildPageMetadata } from '@/lib/buildPageMetadata'
import { BASE_URL, ORG_REF } from '@/lib/jsonLd'
import { getServicesListData } from '@/lib/cachedData'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({ slug: 'services-page', depth: 1 }) as ServicesPageGlobal
    return buildPageMetadata({
      seo: page?.seo,
      defaultTitle: 'Services',
      defaultDescription: 'Game art production, VR game assets, interactive development for UEFN and Roblox, and staff augmentation for game studios worldwide.',
      url: 'https://www.xqubestudio.com/services',
      ogTitle: 'Services | XQUBE Studio',
    })
  } catch {
    return { title: 'Services', description: 'Game art production, VR game assets, interactive development for UEFN and Roblox, and staff augmentation for game studios worldwide.' }
  }
}

export default async function ServicesPage() {
  const { services, sp } = await getServicesListData()

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       'XQUBE Studio Services',
    url:        `${BASE_URL}/services`,
    itemListElement: services.map((s, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      item: {
        '@type':      'Service',
        '@id':        s.slug ? `${BASE_URL}/services/${s.slug}` : `${BASE_URL}/services#${s.id || i}`,
        url:           s.slug ? `${BASE_URL}/services/${s.slug}` : undefined,
        name:          s.title,
        description:   s.shortDescription || undefined,
        provider:      ORG_REF,
        ...(s.platforms ? { serviceType: s.platforms } : {}),
      },
    })),
  }

  return (
    <>
      {/* Service + ItemList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicesPageClient
        initialData={sp}
        services={services}
        serverURL={serverURL}
      />
    </>
  )
}
