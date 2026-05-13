import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch with XQube Studio. Book a discovery call or send us a message — we respond within 24–48 hours.",
  openGraph: {
    title: 'Contact XQube Studio',
    description: "Let's talk about your project. Book a call or send a message.",
    url: 'https://www.xqubestudio.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact XQube Studio',
    description: "Let's talk about your project. Book a call or send a message.",
  },
}

export default function ContactPage() {
  return <ContactForm />
}
