import { GlobalConfig } from 'payload/types'

// ─── Site Settings ───────────────────────────────────────────────────────────
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '⚙️ Site Settings',
  admin: {
    group: 'Admin',
  },
  access: {
    read:   () => true,
    update: ({ req: { user } }) => !!user && ['super-admin', 'admin'].includes(user.role),
  },
  fields: [
    // ── Identity ──
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'XQube Studio',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Where Art Meets Precision',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    // ── Contact ──
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email',    type: 'email', defaultValue: 'info@xqubestudio.com' },
        { name: 'calendly', type: 'text',  defaultValue: 'https://calendly.com/tanvirkhandlxqsmgs' },
        { name: 'linkedin', type: 'text',  defaultValue: 'https://www.linkedin.com/company/xqubestudio' },
        { name: 'artstation', type: 'text', defaultValue: 'https://www.artstation.com/xqubestudio' },
      ],
    },
    // ── Global SEO ──
    {
      name: 'defaultSeo',
      label: 'Default SEO (used when page has no custom SEO)',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'XQube Studio | AAA Game Art & XR Production',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'XQube Studio is a GmbH-registered game art and XR production studio with hubs in Vienna, Dubai, and Dhaka. Delivering AAA-quality assets, characters, environments, and immersive experiences for studios worldwide.',
        },
        {
          name: 'ogImage',
          label: 'Default OG Image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Fallback image for social sharing. 1200×630px.' },
        },
      ],
    },
    // ── Analytics ──
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'gaMeasurementId',
          label: 'Google Analytics Measurement ID',
          type: 'text',
          admin: { description: 'Format: G-XXXXXXXXXX' },
        },
      ],
    },
    // ── Footer ──
    {
      name: 'footerCopy',
      type: 'text',
      defaultValue: '© 2024 XQube Studio GmbH. All rights reserved.',
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url',   type: 'text', required: true },
      ],
    },
  ],
}

// ─── Navigation ──────────────────────────────────────────────────────────────
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: '🧭 Navigation',
  admin: {
    group: 'Admin',
  },
  access: {
    read:   () => true,
    update: ({ req: { user } }) => !!user && ['super-admin', 'admin', 'content-editor'].includes(user.role),
  },
  fields: [
    {
      name: 'mainNav',
      label: 'Main Navigation Links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url',   type: 'text', required: true },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      defaultValue: [
        { label: 'Home',      url: '/' },
        { label: 'About',     url: '/about' },
        { label: 'Services',  url: '/services' },
        { label: 'Portfolio', url: '/portfolio' },
        { label: 'Blog',      url: '/blog' },
        { label: 'Contact',   url: '/contact' },
      ],
    },
    {
      name: 'ctaButton',
      label: 'CTA Button in Nav',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Book a Call' },
        { name: 'url',   type: 'text', defaultValue: 'https://calendly.com/tanvirkhandlxqsmgs' },
      ],
    },
  ],
}
