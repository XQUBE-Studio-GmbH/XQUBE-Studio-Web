import type { CollectionConfig } from 'payload'

const isContentEditor = ({ req: { user } }: any) =>
  ['super-admin', 'admin', 'content-editor'].includes(user?.role)

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  admin: {
    useAsTitle: 'clientName',
    group: 'Content',
    defaultColumns: ['clientName', 'showOnSite', 'sortOrder'],
    description: 'Client logos displayed in the social proof strip on homepage',
  },
  access: {
    read: () => true,
    create: isContentEditor,
    update: isContentEditor,
    delete: ({ req: { user } }) => ['super-admin', 'admin'].includes(user?.role || ''),
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Prefer SVG or PNG with transparent background',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Client Website URL',
    },
    {
      name: 'showOnSite',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle visibility without deleting',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'permissionConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check when client has confirmed permission to display their logo publicly',
      },
    },
  ],
}
