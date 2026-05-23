import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPayload } from 'payload'
import config from '../../../../payload/payload.config'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

// ─── Rate limiting (in-memory, per warm serverless instance) ──────────────────
// Limits to 2 submissions per IP per 10 minutes.

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT   = 2
const WINDOW_MS    = 10 * 60 * 1000 // 10 minutes

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

// ─── Input length caps ────────────────────────────────────────────────────────

const MAX = {
  name:        100,
  email:       254,
  company:     100,
  projectType: 100,
  engine:      100,
  budget:      100,
  timeline:    100,
  message:     5000,
}

function truncate(value: unknown, max: number): string {
  const str = typeof value === 'string' ? value : ''
  return str.slice(0, max)
}

// ─── Email helpers ────────────────────────────────────────────────────────────

function detailRow(label: string, value: string): string {
  if (!value?.trim()) return ''
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:10px;">
      <tr>
        <td width="140" style="font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;vertical-align:top;padding-top:2px;">${label}</td>
        <td style="font-size:13px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;vertical-align:top;">${value}</td>
      </tr>
    </table>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit check ──────────────────────────────────────────────────────
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

    // ── Parse & sanitise inputs ───────────────────────────────────────────────
    const body = await req.json()

    const name        = truncate(body.name,        MAX.name)
    const email       = truncate(body.email,       MAX.email)
    const company     = truncate(body.company,     MAX.company)
    const projectType = truncate(body.projectType, MAX.projectType)
    const engine      = truncate(body.engine,      MAX.engine)
    const budget      = truncate(body.budget,      MAX.budget)
    const timeline    = truncate(body.timeline,    MAX.timeline)
    const message     = truncate(body.message,     MAX.message)

    // ── Required field validation ─────────────────────────────────────────────
    if (!name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // ── Save submission to CMS ────────────────────────────────────────────────
    try {
      const payload = await getPayload({ config })
      await payload.create({
        collection:     'contact-submissions',
        overrideAccess: true,
        data: {
          name,
          email,
          company:     company     || undefined,
          projectType: projectType || undefined,
          engine:      engine      || undefined,
          budget:      budget      || undefined,
          timeline:    timeline    || undefined,
          message,
          status: 'new',
        },
      })
    } catch (dbErr) {
      // Don't block the user if DB write fails — log and continue to send emails.
      console.error('[contact] DB write failed:', dbErr)
    }

    // ── Send emails ───────────────────────────────────────────────────────────
    const contactEmail = process.env.CONTACT_EMAIL || 'info@xqubestudio.com'
    const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'
    const firstName    = name.split(' ')[0]

    // Internal notification to the team
    await resend.emails.send({
      from:     'XQUBE Contact Form <noreply@xqubestudio.com>',
      to:       [contactEmail],
      reply_to: email,
      subject:  `New inquiry from ${name}${company ? ` — ${company}` : ''}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Project Brief — XQUBE Studio</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:48px 24px 64px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-size:22px;font-weight:900;color:#14CB72;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;">XQUBE</span><span style="font-size:22px;font-weight:400;color:#ffffff;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;"> STUDIO</span>
            </td>
          </tr>

          <!-- Green accent bar + heading -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="3" style="background-color:#14CB72;">&nbsp;</td>
                  <td style="padding-left:16px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">New Project Brief</h1>
                    <p style="margin:4px 0 0;font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">via xqubestudio.com</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact details card -->
          <tr>
            <td style="padding-bottom:24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Contact Info</p>

                    ${detailRow('Name', name)}
                    ${detailRow('Email', `<a href="mailto:${email}" style="color:#14CB72;text-decoration:none;">${email}</a>`)}
                    ${detailRow('Company', company)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Project details card -->
          <tr>
            <td style="padding-bottom:24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Project Details</p>

                    ${detailRow('Project Type', projectType)}
                    ${detailRow('Engine / Platform', engine)}
                    ${detailRow('Budget Range', budget)}
                    ${detailRow('Timeline', timeline)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Brief -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Message / Brief</p>
                    <p style="margin:0;font-size:14px;color:#e0e6f0;line-height:1.7;font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom:48px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:6px;background-color:#14CB72;">
                    <a href="mailto:${email}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">Reply to ${firstName} &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #1a1a1a;padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#3d3d3d;font-family:Arial,Helvetica,sans-serif;">
                XQUBE Studio GmbH &middot; Vienna, Austria &middot; <a href="mailto:info@xqubestudio.com" style="color:#3d3d3d;text-decoration:none;">info@xqubestudio.com</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#2a2a2a;font-family:Arial,Helvetica,sans-serif;">
                Submission saved to admin panel &middot; <a href="${siteUrl}/admin" style="color:#2a2a2a;text-decoration:none;">View all submissions</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
    })

    // Auto-reply to the sender
    await resend.emails.send({
      from:    'XQUBE Studio <info@xqubestudio.com>',
      to:      [email],
      subject: `We received your brief, ${firstName}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Thanks for reaching out — XQUBE Studio</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:48px 24px 64px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-size:22px;font-weight:900;color:#14CB72;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;">XQUBE</span><span style="font-size:22px;font-weight:400;color:#ffffff;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;"> STUDIO</span>
            </td>
          </tr>

          <!-- Green accent bar + heading -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="3" style="background-color:#14CB72;">&nbsp;</td>
                  <td style="padding-left:16px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">We received your brief.</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:#b0b8c8;font-family:Arial,Helvetica,sans-serif;">
                Hi ${firstName}, thanks for getting in touch. Our team reviews every inquiry and typically responds within 24–48 hours.
              </p>
            </td>
          </tr>

          <!-- What to expect card -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#14141a;border:1px solid #1e2d1e;border-radius:6px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#86efac;font-family:Arial,Helvetica,sans-serif;">
                      &#9432;&nbsp; Want to speak sooner? Book a discovery call — we'll scope your project in 30 minutes.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td style="padding-bottom:48px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:6px;background-color:#14CB72;">
                    <a href="https://calendly.com/tanvirkhandlxqsmgs" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">Book a Discovery Call &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #1a1a1a;padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#3d3d3d;font-family:Arial,Helvetica,sans-serif;">
                XQUBE Studio GmbH &middot; Vienna, Austria &middot; <a href="mailto:info@xqubestudio.com" style="color:#3d3d3d;text-decoration:none;">info@xqubestudio.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please email info@xqubestudio.com directly.' },
      { status: 500 },
    )
  }
}
