/**
 * /dev/email-preview — local-only email template previewer.
 *
 * Returns 404 in production so it is never publicly accessible.
 * Visit http://localhost:3000/dev/email-preview during development.
 */

import { notFound } from 'next/navigation'

export default function EmailPreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const firstName = 'Tanvir'
  const name      = 'Tanvir Khan'
  const email     = 'tanvir@example.com'
  const company   = 'Acme Games Ltd'
  const projectType = 'Characters & Creatures'
  const engine      = 'Unreal Engine 5'
  const budget      = '$25,000 – $50,000'
  const timeline    = '8 weeks'
  const message     = `We are building a third-person action RPG and need a full roster of hero characters — 4 player classes and 12 enemy types — rigged and textured to UE5 Mannequin spec.\n\nDeadline is Q3 2026. Looking for a studio that has done AAA character work at scale.`

  // ─── Logo block ─────────────────────────────────────────────────────────────
  // Uses /logo.svg (white + green, transparent bg) — same file as the site header/footer.
  // Full absolute URL required for email clients to load it.
  const logoUrl = `${siteUrl}/logo.svg`
  const logoHtml = `
    <tr>
      <td style="padding-bottom:40px;">
        <img src="${logoUrl}" alt="XQUBE Studio" width="160" height="auto" style="display:block;border:0;max-width:160px;" />
      </td>
    </tr>`

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

  // ─── 1. Internal notification (to team) — logo update only ──────────────────
  const internalHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Project Brief — XQUBE Studio</title></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:48px 24px 64px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

        ${logoHtml}

        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="3" style="background-color:#14CB72;">&nbsp;</td>
              <td style="padding-left:16px;">
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">New Project Brief</h1>
                <p style="margin:4px 0 0;font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">via xqubestudio.com</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Contact Info</p>
              ${detailRow('Name', name)}
              ${detailRow('Email', `<a href="mailto:${email}" style="color:#14CB72;text-decoration:none;">${email}</a>`)}
              ${detailRow('Company', company)}
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Project Details</p>
              ${detailRow('Project Type', projectType)}
              ${detailRow('Engine / Platform', engine)}
              ${detailRow('Budget Range', budget)}
              ${detailRow('Timeline', timeline)}
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Message / Brief</p>
              <p style="margin:0;font-size:14px;color:#e0e6f0;line-height:1.7;font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">${message}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:48px;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr><td style="border-radius:6px;background-color:#14CB72;">
              <a href="mailto:${email}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">Reply to ${firstName} &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;">
          <p style="margin:0;font-size:11px;color:#3d3d3d;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;">XQUBE Studio GmbH &middot; Rathausstrasse 21/12, 1010 Vienna, Austria &middot; <a href="tel:+436505207329" style="color:#3d3d3d;text-decoration:none;">+43 650 5207329</a> &middot; <a href="mailto:info@xqubestudio.com" style="color:#3d3d3d;text-decoration:none;">info@xqubestudio.com</a></p>
          <p style="margin:8px 0 0;font-size:11px;color:#2a2a2a;font-family:Arial,Helvetica,sans-serif;">Submission saved to admin panel &middot; <a href="${siteUrl}/admin" style="color:#2a2a2a;text-decoration:none;">View all submissions</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  // ─── 2. Auto-reply / confirmation (to form submitter) ───────────────────────
  // Changes applied:
  //   • Headline: "We'll be in touch."
  //   • Body: "we've received your message and will get back to you within One Business Day."
  //   • Info box: "Want to speak sooner? Book a 30-minute call." — no ⓘ icon, plain border only
  //   • CTA: "Book a 30-minute Call"
  const autoReplyHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>We'll be in touch — XQUBE Studio</title></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:48px 24px 64px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

        ${logoHtml}

        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="3" style="background-color:#14CB72;">&nbsp;</td>
              <td style="padding-left:16px;">
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">We'll be in touch.</h1>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:28px;">
          <p style="margin:0;font-size:15px;line-height:1.7;color:#b0b8c8;font-family:Arial,Helvetica,sans-serif;">
            Hi ${firstName}, we've received your message and will get back to you within One Business Day.
          </p>
        </td></tr>

        <!-- Info box — plain bordered box, no icon -->
        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #2a2a2a;border-radius:6px;">
            <tr><td style="padding:14px 16px;">
              <p style="margin:0;font-size:13px;color:#b0b8c8;font-family:Arial,Helvetica,sans-serif;">
                Want to speak sooner? Book a 30-minute call from below.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:48px;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr><td style="border-radius:6px;background-color:#14CB72;">
              <a href="https://calendly.com/tanvirkhandlxqsmgs" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">Book a 30-minute Call &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;">
          <p style="margin:0;font-size:11px;color:#3d3d3d;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;">XQUBE Studio GmbH &middot; Rathausstrasse 21/12, 1010 Vienna, Austria &middot; <a href="tel:+436505207329" style="color:#3d3d3d;text-decoration:none;">+43 650 5207329</a> &middot; <a href="mailto:info@xqubestudio.com" style="color:#3d3d3d;text-decoration:none;">info@xqubestudio.com</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  // ─── 3. Invite email (admin panel) — logo update only ───────────────────────
  const inviteHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You've been invited to XQUBE Studio</title></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:48px 24px 64px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

        ${logoHtml}

        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="3" style="background-color:#14CB72;">&nbsp;</td>
              <td style="padding-left:16px;">
                <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">You've been invited to<br>XQUBE Studio Admin Panel</h1>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:28px;">
          <p style="margin:0;font-size:15px;line-height:1.7;color:#b0b8c8;font-family:Arial,Helvetica,sans-serif;">
            Hi ${firstName}, you've been added to the XQUBE Studio admin panel as <strong style="color:#14CB72;font-weight:700;">Admin</strong>. Use the credentials below to log in for the first time.
          </p>
        </td></tr>

        <tr><td style="padding-bottom:28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Your login credentials</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
                <tr>
                  <td width="130" style="font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;padding-bottom:4px;">Email</td>
                  <td style="font-size:13px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;padding-bottom:4px;">${email}</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
                <tr><td style="border-top:1px solid #1f1f1f;height:1px;font-size:0;">&nbsp;</td></tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="130" style="font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;vertical-align:top;padding-top:2px;">Temporary Password</td>
                  <td><span style="display:inline-block;background-color:#0d1117;border:1px solid #2a2a2a;border-radius:4px;padding:4px 10px;font-size:14px;color:#14CB72;letter-spacing:2px;font-family:'Courier New',monospace;">Xq!Demo2026</span></td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#14141a;border:1px solid #1e2d1e;border-radius:6px;">
            <tr><td style="padding:14px 16px;">
              <p style="margin:0;font-size:13px;color:#86efac;font-family:Arial,Helvetica,sans-serif;">&#9432;&nbsp; You will be asked to change your password on first login.</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:48px;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr><td style="border-radius:6px;background-color:#14CB72;">
              <a href="${siteUrl}/admin" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">Log in to Admin Panel &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;">
          <p style="margin:0;font-size:11px;color:#3d3d3d;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;">XQUBE Studio GmbH &middot; Rathausstrasse 21/12, 1010 Vienna, Austria &middot; <a href="tel:+436505207329" style="color:#3d3d3d;text-decoration:none;">+43 650 5207329</a> &middot; <a href="mailto:info@xqubestudio.com" style="color:#3d3d3d;text-decoration:none;">info@xqubestudio.com</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const templates = [
    { id: 'internal',  label: '📨 Notification email — sent to team (info@xqubestudio.com)',   note: 'Logo update only — no copy changes', html: internalHtml },
    { id: 'autoreply', label: '✉️ Auto-reply / confirmation — sent to form submitter',          note: 'Copy + logo updated', html: autoReplyHtml },
    { id: 'invite',    label: '🔐 Invite email — admin panel invitation',                       note: 'Logo update only — no copy changes', html: inviteHtml },
  ]

  return (
    <div style={{ background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
      {/* Header */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #222', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: '#14CB72', fontWeight: 900, letterSpacing: 3, fontSize: 16 }}>XQUBE</span>
        <span style={{ color: '#fff', letterSpacing: 3, fontSize: 16 }}> STUDIO</span>
        <span style={{ color: '#444', margin: '0 8px' }}>|</span>
        <span style={{ color: '#666', fontSize: 13 }}>Email Template Previewer</span>
        <span style={{ marginLeft: 'auto', background: '#14CB72', color: '#000', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>DEV ONLY</span>
      </div>

      {/* Templates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, padding: '16px 24px 64px', maxWidth: 1400, margin: '0 auto' }}>
        {templates.map((t) => (
          <div key={t.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ color: '#e0e6f0', fontSize: 14, fontWeight: 700 }}>{t.label}</span>
            </div>
            <div style={{ color: '#666', fontSize: 11, marginBottom: 10 }}>{t.note} — rendered at actual email width (560px)</div>
            <div style={{ border: '1px solid #222', borderRadius: 8, overflow: 'hidden' }}>
              <iframe srcDoc={t.html} title={t.id} style={{ width: '100%', height: 700, border: 'none', display: 'block' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '0 0 48px', color: '#333', fontSize: 12 }}>
        This page returns 404 in production.
      </div>
    </div>
  )
}
