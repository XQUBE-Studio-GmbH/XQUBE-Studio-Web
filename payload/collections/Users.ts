import { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
  },
  access: {
    read:   ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => user?.role === 'super-admin',
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: '🔴 Super Admin',    value: 'super-admin' },
        { label: '🟠 Admin',          value: 'admin' },
        { label: '🔵 BD Manager',     value: 'bd-manager' },
        { label: '🟢 Content Editor', value: 'content-editor' },
        { label: '⚪ Viewer',         value: 'viewer' },
      ],
      admin: {
        description: 'Super Admin: full access including user management. Admin: all except user management & billing. BD Manager: leads & inquiries only. Content Editor: pages & portfolio only. Viewer: read-only.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
