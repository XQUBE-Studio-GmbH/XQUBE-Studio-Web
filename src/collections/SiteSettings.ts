import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => ['super-admin', 'admin'].includes(user?.role || ''),
  },
  fields: [
    // Identity
    {
      name: 'studioName',
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

    // Contact
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          defaultValue: 'info@xqubestudio.com',
        },
        {
          name: 'calendlyUrl',
          type: 'text',
          defaultValue: 'https://calendly.com/tanvirkhandlxqsmgs',
        },
        {
          name: 'linkedinUrl',
          type: 'text',
          defaultValue: 'https://www.linkedin.com/company/xqubestudio',
        },
        {
          name: 'artstationUrl',
          type: 'text',
          defaultValue: 'https://www.artstation.com/xqubestudio',
        },
      ],
    },

    // Navigation
    {
      name: 'navLinks',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'isExternal', type: 'checkbox', defaultValue: false },
      ],
    },

    // Footer
    {
      name: 'footer',
      type: 'group',
      fields: [
        {
          name: 'companyDescription',
          type: 'textarea',
          defaultValue: 'Production-grade game art and XR solutions from our studios in Vienna, Dubai, and Dhaka.',
        },
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: '© 2024 XQube Studio GmbH. All rights reserved.',
        },
        {
          name: 'showHubs',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show Vienna / Dubai / Dhaka hub info in footer' },
        },
      ],
    },

    // Analytics
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics',
      fields: [
        {
          name: 'ga4MeasurementId',
          type: 'text',
          label: 'GA4 Measurement ID',
          admin: { description: 'Format: G-XXXXXXXXXX' },
        },
      ],
    },

    // Global SEO Defaults
    {
      name: 'defaultSeo',
      type: 'group',
      label: 'Default SEO',
      fields: [
        { name: 'defaultTitle', type: 'text', defaultValue: 'XQube Studio | Game Art & XR Production' },
        { name: 'defaultDescription', type: 'textarea', defaultValue: 'XQube Studio delivers AAA-quality game art, XR experiences, and digital twins. Studios in Vienna, Dubai, and Dhaka. EU-registered, GDPR-compliant.' },
        { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
        { name: 'twitterHandle', type: 'text' },
      ],
    },
  ],
}
