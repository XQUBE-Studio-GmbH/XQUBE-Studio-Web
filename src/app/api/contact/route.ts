import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const contactEmail = process.env.CONTACT_EMAIL || 'info@xqubestudio.com'

    await resend.emails.send({
      from:    'XQube Contact Form <noreply@xqubestudio.com>',
      to:      [contactEmail],
      reply_to: email,
      subject: `New inquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#0e0e0e;color:#c4cad8;padding:32px;border-radius:8px;">
          <div style="border-left:3px solid #14CB72;padding-left:16px;margin-bottom:24px;">
            <h2 style="color:#fff;margin:0;">New Contact Inquiry</h2>
            <p style="color:#8d95a8;margin:4px 0 0;font-size:14px;">via xqubestudio.com</p>
          </div>
          <p><strong style="color:#8d95a8;">Name:</strong> <span style="color:#fff;">${name}</span></p>
          <p><strong style="color:#8d95a8;">Email:</strong> <a href="mailto:${email}" style="color:#14CB72;">${email}</a></p>
          <div style="margin-top:16px;padding:16px;background:#111;border-radius:4px;border:1px solid #1a1a1a;">
            <p style="color:#8d95a8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em;">Message</p>
            <p style="color:#c4cad8;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <div style="margin-top:24px;">
            <a href="mailto:${email}" style="background:#14CB72;color:#000;padding:10px 20px;border-radius:4px;font-weight:600;font-size:14px;text-decoration:none;">Reply to ${name}</a>
          </div>
        </div>
      `,
    })

    await resend.emails.send({
      from:    'XQube Studio <info@xqubestudio.com>',
      to:      [email],
      subject: `Thanks for reaching out, ${name.split(' ')[0]}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#0e0e0e;color:#c4cad8;padding:32px;border-radius:8px;">
          <h2 style="color:#fff;margin:0 0 16px;">We received your message.</h2>
          <p style="color:#8d95a8;line-height:1.6;">Hi ${name.split(' ')[0]}, thanks for getting in touch. Our team typically responds within 24–48 hours.</p>
          <p style="color:#8d95a8;line-height:1.6;margin-top:16px;">Want to speak sooner? Book a discovery call:</p>
          <a href="https://calendly.com/tanvirkhandlxqsmgs" style="display:inline-block;margin-top:16px;background:#14CB72;color:#000;padding:10px 20px;border-radius:4px;font-weight:600;font-size:14px;text-decoration:none;">Book a Discovery Call</a>
          <p style="color:#8d95a8;font-size:13px;margin-top:32px;padding-top:24px;border-top:1px solid #1a1a1a;">XQube Studio GmbH · Vienna, Austria · info@xqubestudio.com</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact]', error)
    return NextResponse.json({ error: 'Something went wrong. Please email info@xqubestudio.com directly.' }, { status: 500 })
  }
}
