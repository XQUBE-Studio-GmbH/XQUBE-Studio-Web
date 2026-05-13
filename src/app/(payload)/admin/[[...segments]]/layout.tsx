import type { ServerFunctionClient } from 'payload'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from '../importMap'
import config from '@payload-config'
import React from 'react'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) =>
  RootLayout({
    config,
    children,
    importMap,
    serverFunction: handleServerFunctions as ServerFunctionClient,
  })

export default Layout
