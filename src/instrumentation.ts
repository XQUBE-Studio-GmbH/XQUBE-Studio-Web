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
    await payload.db.migrate()
    console.log('[XQUBE] DB migrations applied successfully')
  } catch (err) {
    // Log but do not crash — if migrations already ran, the error is benign.
    // A genuine failure (e.g. broken migration SQL) will surface in the logs.
    console.error('[XQUBE] DB migration error on startup:', err)
  }
}
