import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    const adminUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
      : 'https://www.xqubestudio.com/admin'

    const firstName = name?.split(' ')[0] || 'there'
    const roleLabels: Record<string, string> = {
      'super-admin':    'Super Admin',
      'admin':          'Admin',
      'content-editor': 'Content Editor',
      'viewer':         'Viewer',
    }
    const roleLabel = role ? ` as <strong style="color:#fff;">${roleLabels[role] ?? role}</strong>` : ''

    await resend.emails.send({
      from:    'XQube Studio <noreply@xqubestudio.com>',
      to:      [email],
      subject: "You've been invited to XQube Studio Admin Panel",
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#0e0e0e;color:#c4cad8;padding:32px;border-radius:8px;">
          <img src="https://www.xqubestudio.com/logo.svg" alt="XQube Studio" width="180" style="display:block;margin-bottom:28px;" />
          <div style="border-left:3px solid #14CB72;padding-left:16px;margin-bottom:28px;">
            <h2 style="color:#fff;margin:0;">You've been invited to XQube Studio Admin Panel</h2>
          </div>

          <p style="color:#c4cad8;line-height:1.6;margin:0 0 20px;">
            Hi ${firstName}, you've been added to the XQube Studio admin panel${roleLabel}. Use the credentials below to log in for the first time.
          </p>

          <div style="background:#111;border:1px solid #222;border-radius:6px;padding:20px;margin-bottom:24px;">
            <p style="color:#8d95a8;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your login credentials</p>
            <p style="margin:0 0 8px;"><strong style="color:#8d95a8;">Email:</strong> <span style="color:#fff;">${email}</span></p>
            <p style="margin:0;"><strong style="color:#8d95a8;">Temporary Password:</strong> <code style="background:#1a1a2e;border:1px solid #333;border-radius:4px;padding:3px 8px;color:#14CB72;font-size:14px;letter-spacing:1px;">${password}</code></p>
          </div>

          <p style="color:#8d95a8;font-size:13px;line-height:1.6;margin:0 0 24px;">
            Please change your password after your first login via your profile settings.
          </p>

          <a href="${adminUrl}" style="display:inline-block;background:#14CB72;color:#000;padding:12px 24px;border-radius:4px;font-weight:700;font-size:14px;text-decoration:none;">
            Log in to Admin Panel →
          </a>

          <p style="color:#555;font-size:12px;margin-top:32px;padding-top:24px;border-top:1px solid #1a1a1a;">
            XQube Studio GmbH · Vienna, Austria · info@xqubestudio.com
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[invite-user]', error)
    return NextResponse.json({ error: 'Failed to send invitation email.' }, { status: 500 })
  }
}
