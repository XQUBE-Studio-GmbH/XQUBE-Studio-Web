import type { Metadata } from 'next'
import ScopingForm from './ScopingForm'

export const metadata: Metadata = {
  title:       'Get a Quote',
  description: 'Tell us what you need. Share your asset brief and we\'ll get back to you within 24 hours.',
}

export default function ScopePage() {
  return <ScopingForm />
}
