/**
 * Returns the correct serverURL for useLivePreview.
 *
 * When the page is rendered inside Payload's live-preview iframe,
 * `document.referrer` is the parent admin page URL — we extract
 * its origin so the postMessage target matches the admin's actual
 * origin (works for any domain the admin is accessed from).
 *
 * When NOT in an iframe (normal browser visit), we fall back to
 * the current window origin, which is safe and correct.
 *
 * On the server (SSR), we return the `serverURL` env value so that
 * the hook can initialise without crashing.
 */
export function getLivePreviewServerURL(serverURL: string): string {
  if (typeof window === 'undefined') return serverURL
  if (window !== window.parent && document.referrer) {
    return new URL(document.referrer).origin
  }
  return window.location.origin
}
