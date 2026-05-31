import type { Metadata } from 'next'
import ScopingForm from './ScopingForm'

export const metadata: Metadata = {
  title:       'Start a Project — XQube Studio',
  description: 'Tell us what you need. Share your asset brief and we\'ll get back to you within 24 hours.',
  robots:      { index: false }, // keep scoping tool out of search results
}

export default function ScopePage() {
  return <ScopingForm />
}
