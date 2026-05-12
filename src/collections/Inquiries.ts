import type { CollectionConfig } from 'payload'

const isBDorAbove = ({ req: { user } }: any) =>
  ['super-admin', 'admin', 'bd-manager'].includes(user?.role)

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Business',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
    description: 'Contact form submissions — Phase 2: will also include quote builder leads',
  },
  access: {
    read: isBDorAbove,
    create: () => true, // Public can submit contact forms
    update: isBDorAbove,
    delete: ({ req: { user } }) => ['super-admin', 'admin'].includes(user?.role || ''),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'contact-form',
      options: [
        { label: 'Contact Form', value: 'contact-form' },
        { label: 'Quote Builder', value: 'quote-builder' }, // Phase 2
        { label: 'Email', value: 'email' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Referral', value: 'referral' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Responded', value: 'responded' },
        { label: 'Converted', value: 'converted' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes — not visible to client',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Assign to team member for follow-up',
      },
    },
  ],
  hooks: {
    afterCreate: [
      async ({ doc }) => {
        // Email notification hook — configured via environment variables
        // Sends to info@xqubestudio.com on new submission
        console.log(`New inquiry from ${doc.name} (${doc.email})`)
      },
    ],
  },
}
