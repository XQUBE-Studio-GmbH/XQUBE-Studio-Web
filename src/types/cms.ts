// ─── Shared CMS TypeScript Types ─────────────────────────────────────────────
// Single source of truth for all CMS-related interfaces.
// Used by both server page.tsx files and page client components.

// ─── Primitives ───────────────────────────────────────────────────────────────

export interface MediaRef { url?: string; alt?: string }

// ─── Collections ──────────────────────────────────────────────────────────────

export interface ServiceItem {
  id:               string | number
  title:            string
  shortDescription?: string
  icon?:            string
  order?:           number
  image?:           { url?: string; alt?: string } | null
  features?:        { id: string; feature: string }[]
  platforms?:       string
}

export interface ClientItem {
  id:      string | number
  name:    string
  logo?:   { url?: string; alt?: string } | null
  sector?: string
  note?:   string
}

export interface PortfolioItem {
  id:               string
  title:            string
  slug:             string
  category?:        string
  shortDescription?: string
  heroImage?:       { url?: string; alt?: string; width?: number; height?: number }
}

export interface BlogPost {
  id:          string
  title:       string
  slug:        string
  excerpt?:    string
  createdAt?:  string
  coverImage?: { url?: string; alt?: string } | null
}

export interface TeamMember {
  id:    string | number
  name:  string
  role:  string
  bio?:  string
  photo?: { url?: string; alt?: string } | null
}

// ─── Page Global: Home ────────────────────────────────────────────────────────

export interface HeroSlide {
  id?:               string
  eyebrow?:          string
  title?:            string
  subtitle?:         string
  primaryCtaLabel?:  string
  primaryCtaUrl?:    string
  secondaryCtaLabel?: string
  secondaryCtaUrl?:  string
  image?:            { url?: string; alt?: string } | null
}

export interface Stat { id?: string; value: string; label: string }

export interface EngineBadge {
  id?:   string
  name:  string
  logo?: MediaRef | null
}

export interface ProcessStep {
  id?:          string
  icon?:        string
  title:        string
  description:  string
}

export interface Testimonial {
  id?:     string
  quote:   string
  name:    string
  role?:   string
  avatar?: MediaRef | null
}

export interface HomepageGlobal {
  sections?: {
    showStudioIntro?:  boolean
    showEngineBadges?: boolean
    showFeaturedWork?: boolean
    showServices?:     boolean
    showProcess?:      boolean
    showShowreel?:     boolean
    showTestimonials?: boolean
    showBlogPreview?:  boolean
  }
  hero?: {
    mode?:     'slideshow' | 'video'
    videoUrl?: string
    slides?:   HeroSlide[]
  }
  studioIntro?: {
    label?:     string
    heading?:   string
    body1?:     string
    body2?:     string
    image?:     MediaRef | null
    linkLabel?: string
    linkUrl?:   string
  }
  engineBadges?: EngineBadge[]
  process?: {
    label?:  string
    heading?: string
    steps?:  ProcessStep[]
  }
  showreel?: {
    label?:   string
    heading?: string
    tagline?: string
    video?:   MediaRef | null
  }
  testimonials?: {
    label?:   string
    heading?: string
    items?:   Testimonial[]
  }
  blogPreview?: {
    label?:   string
    heading?: string
  }
  stats?: Stat[]
  cta?:  { headline?: string; subtitle?: string; buttonLabel?: string; buttonUrl?: string }
}

// ─── Page Global: About ───────────────────────────────────────────────────────

export interface Credential { id?: string; value: string; label: string; detail?: string }

export interface Hub {
  id?:     string
  flag?:   string
  city:    string
  country: string
  role?:   string
  detail?: string
  image?:  MediaRef | null
}

export interface WhyCard { id?: string; title: string; body: string }

export interface AboutGlobal {
  hero?:        { label?: string; heading?: string; subtitle?: string; image?: MediaRef | null }
  intro?:       { body1?: string; body2?: string; image?: MediaRef | null }
  credentials?: Credential[]
  hubs?:        Hub[]
  whyXqube?:    WhyCard[]
}

// ─── Page Global: Services ────────────────────────────────────────────────────

export interface PipelineStep { id?: string; step: string }

export interface Pipeline {
  id?:         string
  title:       string
  subtitle?:   string
  description?: string
  steps?:      (PipelineStep | string)[]
  toolsUsed?:  string
  image?:      MediaRef | null
  imageLabel?: string
}

export interface ServicesPageGlobal {
  hero?:      { label?: string; heading?: string; subtitle?: string; image?: MediaRef | null }
  cta?:       { heading?: string; subtitle?: string; buttonLabel?: string; buttonUrl?: string }
  pipelines?: Pipeline[]
}

// ─── Page Global: Portfolio ───────────────────────────────────────────────────

export interface PortfolioPageGlobal {
  hero?: {
    label?:    string
    heading?:  string
    subtitle?: string
    image?:    MediaRef | null
    ctaLabel?: string
    ctaUrl?:   string
  }
}

// ─── Page Global: Blog ────────────────────────────────────────────────────────

export interface BlogPageGlobal {
  hero?: { label?: string; heading?: string; subtitle?: string; image?: MediaRef | null }
}

// ─── Page Global: Contact ─────────────────────────────────────────────────────

export interface ContactPageGlobal {
  hero?: {
    label?:         string
    heading?:       string
    subtext?:       string
    calendlyLabel?: string
    image?:         { url?: string; alt?: string } | null
  }
}
