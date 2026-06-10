import { revalidateTag, revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SERVICE_SLUGS = ['uefn-roblox', 'vr-assets', 'environments', 'props', 'weapons', 'hard-surfaces']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag') ?? 'services'

  // Purge Data Cache entries
  revalidateTag(tag)

  // Purge CDN-cached responses for all service detail pages.
  // Needed because notFound() renders a static not-found.tsx whose
  // response can be cached at the edge. revalidatePath sends a CDN purge.
  for (const slug of SERVICE_SLUGS) {
    revalidatePath(`/services/${slug}`, 'page')
  }

  return NextResponse.json({ revalidated: true, tag, paths: SERVICE_SLUGS })
}
