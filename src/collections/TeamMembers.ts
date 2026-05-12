import type { CollectionConfig } from 'payload'

const isContentEditor = ({ req: { user } }: any) =>
  ['super-admin', 'admin', 'content-editor'].includes(user?.role)

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'role', 'hub', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: isContentEditor,
    update: isContentEditor,
    delete: ({ req: { user } }) => ['super-admin', 'admin'].includes(user?.role || ''),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    {
      name: 'hub',
      type: 'select',
      options: [
        { label: 'Vienna (HQ)', value: 'vienna' },
        { label: 'Dubai (MENA)', value: 'dubai' },
        { label: 'Dhaka (Production)', value: 'dhaka' },
      ],
    },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'linkedinUrl', type: 'text', label: 'LinkedIn URL' },
    { name: 'artstationUrl', type: 'text', label: 'ArtStation URL' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'showOnSite', type: 'checkbox', defaultValue: true },
  ],
}
