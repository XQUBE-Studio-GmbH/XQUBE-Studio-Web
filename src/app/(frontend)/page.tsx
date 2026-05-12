import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesPreview } from '@/components/sections/ServicesPreview'
import { PortfolioPreview } from '@/components/sections/PortfolioPreview'
import { ClientLogosStrip } from '@/components/sections/ClientLogosStrip'
import { StatsSection } from '@/components/sections/StatsSection'
import { CtaSection } from '@/components/sections/CtaSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'XQube Studio | Game Art & XR Production Studio',
  description:
    'XQube Studio delivers AAA-quality game art, XR experiences, and digital twins for game studios worldwide. EU-registered. Vienna · Dubai · Dhaka.',
  openGraph: {
    title: 'XQube Studio | Game Art & XR Production',
    description: 'AAA game art, XR production, and digital twins. Production-grade studio with hubs in Vienna, Dubai, and Dhaka.',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ClientLogosStrip />
      <StatsSection />
      <ServicesPreview />
      <PortfolioPreview />
      <CtaSection />
    </>
  )
}
