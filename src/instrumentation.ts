// Next.js instrumentation hook — runs once at server startup.
// Used to apply any pending Payload DB migrations automatically in production
// so deployments never require a manual `payload migrate` step.
//
// Runs inside the full Next.js Node.js environment, so there are no undici
// compatibility issues that arise when running the `payload migrate` CLI
// directly in a Vercel build step.

export async function register() {
  // Only run on the Node.js runtime (not the edge runtime)
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  // In development, the Postgres adapter uses `push: true` to sync the schema
  // directly — running migrations there would conflict with that mechanism.
  if (process.env.NODE_ENV !== 'production') return

  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })

    // 1. Apply any pending DB migrations
    await payload.db.migrate()
    console.log('[XQUBE] DB migrations applied successfully')

    // 2. Clear stale document locks for the users collection.
    //    Payload v3 stores locks in `payload_locked_documents`. When a session
    //    expires or a browser tab is closed without unlocking, the lock record
    //    persists in the DB and blocks other admins from entering edit mode —
    //    even after lockDocuments: false is set. Clearing them on startup is
    //    safe for a small-team admin (nobody edits two user records simultaneously).
    try {
      const { sql } = await import('@payloadcms/db-postgres')
      await (payload.db as any).execute(
        sql`DELETE FROM payload_locked_documents WHERE id IN (
          SELECT parent_id FROM payload_locked_documents_rels WHERE collection = 'users'
        )`
      )
      console.log('[XQUBE] Cleared stale user document locks')
    } catch {
      // Table may not exist yet (pre-migration) or schema may differ — non-fatal.
      // The lockDocuments: false config prevents new locks from being created.
    }
  } catch (err) {
    // Log but do not crash — if migrations already ran, the error is benign.
    // A genuine failure (e.g. broken migration SQL) will surface in the logs.
    console.error('[XQUBE] Startup error:', err)
  }
}
