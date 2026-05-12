import { CollectionConfig } from 'payload/types'

// Phase 1: Contact form submissions land in email only.
// This collection is scaffolded for Phase 2 when the admin panel 
// becomes a business ops tool with lead management.

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Business',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    description: '📋 Phase 2: Contact form submissions and leads will appear here. Currently routed to info@xqubestudio.com.',
  },
  access: {
    read:   ({ req: { user } }) => !!user && ['super-admin', 'admin', 'bd-manager'].includes(user.role),
    create: () => true, // Public: form submissions
    update: ({ req: { user } }) => !!user && ['super-admin', 'admin', 'bd-manager'].includes(user.role),
    delete: ({ req: { user } }) => !!user && ['super-admin', 'admin'].includes(user.role),
  },
  fields: [
    { name: 'name',    type: 'text',  required: true },
    { name: 'email',   type: 'email', required: true },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: '🆕 New',         value: 'new' },
        { label: '👀 Reviewed',    value: 'reviewed' },
        { label: '📞 In Contact',  value: 'in-contact' },
        { label: '✅ Converted',   value: 'converted' },
        { label: '❌ Closed',      value: 'closed' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes (not visible to client)' },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Team member responsible for this lead' },
    },
  ],
  timestamps: true,
}
