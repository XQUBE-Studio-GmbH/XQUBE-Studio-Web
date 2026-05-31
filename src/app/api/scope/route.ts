import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

export const dynamic = 'force-dynamic'

// ─── Rate limiting ────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const WINDOW_MS  = 10 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now   = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncate(value: unknown, max: number): string {
  const str = typeof value === 'string' ? value : ''
  return str.slice(0, max)
}

function detailRow(label: string, value: string): string {
  if (!value?.trim()) return ''
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:10px;">
      <tr>
        <td width="160" style="font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;vertical-align:top;padding-top:2px;">${label}</td>
        <td style="font-size:13px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;vertical-align:top;">${value}</td>
      </tr>
    </table>`
}

const CALENDLY = 'https://calendly.com/tanvirkhandlxqsmgs'

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few minutes before trying again.' },
        { status: 429 },
      )
    }

    const body = await req.json()

    // ── Destructure & sanitise ────────────────────────────────────────────────
    const assetTypes: Array<{ assetType: string; quantity: number }> = Array.isArray(body.assetTypes)
      ? body.assetTypes.map((a: { assetType: string; quantity: number }) => ({
          assetType: truncate(a.assetType, 100),
          quantity:  Math.max(1, Math.min(50, Number(a.quantity) || 1)),
        }))
      : []

    const engine            = truncate(body.engine,            150)
    const timeline          = truncate(body.timeline,          100)
    const referenceGame     = truncate(body.referenceGame,     300)
    const additionalContext = truncate(body.additionalContext, 3000)
    const name              = truncate(body.name,              100)
    const email             = truncate(body.email,             254)

    // ── Validation ────────────────────────────────────────────────────────────
    if (!name.trim() || !email.trim()) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }
    if (assetTypes.length === 0) {
      return NextResponse.json({ error: 'At least one asset type is required.' }, { status: 400 })
    }
    if (!engine.trim()) {
      return NextResponse.json({ error: 'Engine / Platform is required.' }, { status: 400 })
    }
    if (!timeline.trim()) {
      return NextResponse.json({ error: 'Timeline is required.' }, { status: 400 })
    }

    // ── Save to Payload CMS ───────────────────────────────────────────────────
    try {
      const payload = await getPayload({ config })
      await payload.create({
        collection:     'contact-submissions',
        overrideAccess: true,
        data: {
          name,
          email,
          engine:            engine     || undefined,
          timeline:          timeline   || undefined,
          assetTypes,
          referenceGame:     referenceGame     || undefined,
          additionalContext: additionalContext || undefined,
          briefSource:       'scoping-tool',
          callBooked:        false,
          status:            'brief-submitted',
          message:           `[Scoping Tool] ${assetTypes.map(a => `${a.assetType} ×${a.quantity}`).join(', ')}`,
        },
      })
    } catch (dbErr) {
      console.error('[scope] DB write failed:', dbErr)
    }

    // ── Build human-readable asset summary ───────────────────────────────────
    const assetSummary = assetTypes
      .map(a => `${a.assetType}: ${a.quantity}`)
      .join(', ')

    const firstName    = name.split(' ')[0]
    const contactEmail = process.env.CONTACT_EMAIL || 'info@xqubestudio.com'
    const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'

    // ── Internal notification ─────────────────────────────────────────────────
    await resend.emails.send({
      from:     'XQUBE Scoping Tool <noreply@xqubestudio.com>',
      to:       [contactEmail],
      reply_to: email,
      subject:  `New Project Brief — ${name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:48px 24px 64px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

        <tr><td style="padding-bottom:40px;">
          <span style="font-size:22px;font-weight:900;color:#14CB72;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;">XQUBE</span><span style="font-size:22px;font-weight:400;color:#ffffff;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;"> STUDIO</span>
        </td></tr>

        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="3" style="background-color:#14CB72;">&nbsp;</td>
              <td style="padding-left:16px;">
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">New Project Brief</h1>
                <p style="margin:4px 0 0;font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Submitted via the Scoping Tool &middot; xqubestudio.com/scope</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Contact</p>
              ${detailRow('Name', name)}
              ${detailRow('Email', `<a href="mailto:${email}" style="color:#14CB72;text-decoration:none;">${email}</a>`)}
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Project Scope</p>
              ${detailRow('Asset Types', assetSummary)}
              ${detailRow('Engine / Platform', engine)}
              ${detailRow('Timeline', timeline)}
              ${detailRow('Art Style Reference', referenceGame)}
            </td></tr>
          </table>
        </td></tr>

        ${additionalContext ? `
        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Additional Context</p>
              <p style="margin:0;font-size:14px;color:#e0e6f0;line-height:1.7;font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">${additionalContext}</p>
            </td></tr>
          </table>
        </td></tr>` : ''}

        <tr><td style="padding-bottom:48px;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr><td style="border-radius:6px;background-color:#14CB72;">
              <a href="mailto:${email}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">Reply to ${firstName} &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;">
          <p style="margin:0;font-size:12px;color:#3d3d3d;font-family:Arial,Helvetica,sans-serif;">
            XQUBE Studio GmbH &middot; Vienna, Austria &middot; <a href="mailto:info@xqubestudio.com" style="color:#3d3d3d;text-decoration:none;">info@xqubestudio.com</a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#2a2a2a;font-family:Arial,Helvetica,sans-serif;">
            Saved to admin &middot; <a href="${siteUrl}/admin/collections/contact-submissions" style="color:#2a2a2a;text-decoration:none;">View in admin &rarr;</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })

    // ── Auto-reply to client ───────────────────────────────────────────────────
    await resend.emails.send({
      from:    'XQube Studio <info@xqubestudio.com>',
      to:      [email],
      subject: 'Got your brief — XQube Studio',
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:48px 24px 64px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

        <tr><td style="padding-bottom:40px;">
          <span style="font-size:22px;font-weight:900;color:#14CB72;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;">XQUBE</span><span style="font-size:22px;font-weight:400;color:#ffffff;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;"> STUDIO</span>
        </td></tr>

        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="3" style="background-color:#14CB72;">&nbsp;</td>
              <td style="padding-left:16px;">
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">Got your brief.</h1>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:28px;">
          <p style="margin:0;font-size:15px;line-height:1.7;color:#b0b8c8;font-family:Arial,Helvetica,sans-serif;">
            Hi ${firstName}, we have your project brief and will be in touch within 24 hours. Want to speak sooner? Book a 30-minute call below.
          </p>
        </td></tr>

        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#14141a;border:1px solid #1e2d1e;border-radius:6px;">
            <tr><td style="padding:14px 16px;">
              <p style="margin:0;font-size:13px;color:#86efac;font-family:Arial,Helvetica,sans-serif;">
                &#9432;&nbsp; Want to speak sooner? Book a 30-minute call and we&apos;ll scope your project together.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:48px;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr><td style="border-radius:6px;background-color:#14CB72;">
              <a href="${CALENDLY}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">Book a 30-Minute Call &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;">
          <p style="margin:0;font-size:12px;color:#3d3d3d;font-family:Arial,Helvetica,sans-serif;">
            XQUBE Studio GmbH &middot; Vienna, Austria &middot; <a href="mailto:info@xqubestudio.com" style="color:#3d3d3d;text-decoration:none;">info@xqubestudio.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[scope]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please email info@xqubestudio.com directly.' },
      { status: 500 },
    )
  }
}
