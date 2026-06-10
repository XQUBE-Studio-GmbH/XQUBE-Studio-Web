import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') ?? 'uefn-roblox'

  try {
    const payload = await getPayload({ config })

    // depth:0 — no relation joins, pure row lookup
    const res0 = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    // depth:2 — the same call the page makes
    let res2: { totalDocs: number; docs: unknown[] } = { totalDocs: -1, docs: [] }
    let depth2Error: string | null = null
    try {
      const r = await payload.find({
        collection: 'services',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      })
      res2 = { totalDocs: r.totalDocs, docs: r.docs }
    } catch (e2) {
      depth2Error = String(e2)
    }

    // list all service slugs so we can see what's actually in the DB
    const allRes = await payload.find({
      collection: 'services',
      limit: 50,
      depth: 0,
    })

    return NextResponse.json({
      queriedSlug: slug,
      depth0: { totalDocs: res0.totalDocs, doc: res0.docs[0] ?? null },
      depth2: { totalDocs: res2.totalDocs, depth2Error },
      allServices: {
        totalDocs: allRes.totalDocs,
        slugs: (allRes.docs as { slug: string; id: number }[]).map((d) => ({ id: d.id, slug: d.slug })),
      },
    })
  } catch (e) {
    return NextResponse.json(
      { error: String(e), stack: (e as Error).stack },
      { status: 500 },
    )
  }
}
