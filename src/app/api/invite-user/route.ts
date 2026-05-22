import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'
    const adminUrl = `${siteUrl}/admin`

    const firstName = name?.split(' ')[0] || 'there'
    const roleLabels: Record<string, string> = {
      'super-admin':    'Super Admin',
      'admin':          'Admin',
      'content-editor': 'Content Editor',
      'viewer':         'Viewer',
    }
    const roleLabel = role ? `as <strong style="color:#14CB72;font-weight:700;">${roleLabels[role] ?? role}</strong>` : ''

    await resend.emails.send({
      from:    'XQUBE Studio <noreply@xqubestudio.com>',
      to:      [email],
      subject: "You've been invited to XQUBE Studio Admin Panel",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>You've been invited to XQUBE Studio</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">

  <!-- Full-width background wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:48px 24px 64px;">

        <!-- Content container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-size:22px;font-weight:900;color:#14CB72;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;">XQUBE</span><span style="font-size:22px;font-weight:400;color:#ffffff;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;"> STUDIO</span>
            </td>
          </tr>

          <!-- Green accent divider -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="3" style="background-color:#14CB72;">&nbsp;</td>
                  <td style="padding-left:16px;">
                    <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;font-family:Arial,Helvetica,sans-serif;">You've been invited to<br>XQUBE Studio Admin Panel</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:#b0b8c8;font-family:Arial,Helvetica,sans-serif;">
                Hi ${firstName}, you've been added to the XQUBE Studio admin panel ${roleLabel}. Use the credentials below to log in for the first time.
              </p>
            </td>
          </tr>

          <!-- Credentials box -->
          <tr>
            <td style="padding-bottom:28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Your login credentials</p>

                    <!-- Email row -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
                      <tr>
                        <td width="130" style="font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;padding-bottom:4px;">Email</td>
                        <td style="font-size:13px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;padding-bottom:4px;">${email}</td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
                      <tr><td style="border-top:1px solid #1f1f1f;height:1px;font-size:0;">&nbsp;</td></tr>
                    </table>

                    <!-- Password row -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="130" style="font-size:13px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;vertical-align:top;padding-top:2px;">Temporary Password</td>
                        <td>
                          <span style="display:inline-block;background-color:#0d1117;border:1px solid #2a2a2a;border-radius:4px;padding:4px 10px;font-size:14px;color:#14CB72;letter-spacing:2px;font-family:'Courier New',monospace;">${password}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Password change notice -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#14141a;border:1px solid #1e2d1e;border-radius:6px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#86efac;font-family:Arial,Helvetica,sans-serif;">
                      &#9432;&nbsp; You will be asked to change your password on first login.
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
                    <a href="${adminUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#000000;text-decoration:none;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.3px;">Log in to Admin Panel &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer divider -->
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
    console.error('[invite-user]', error)
    return NextResponse.json({ error: 'Failed to send invitation email.' }, { status: 500 })
  }
}
