import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from '../importMap'
import config from '@payload-config'
import React from 'react'
import '../../../app/globals.css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
