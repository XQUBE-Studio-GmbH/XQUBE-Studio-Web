import { NextResponse } from 'next/server'

/**
 * GET /.well-known/ai-plugin.json
 *
 * ChatGPT / GPT Action plugin manifest.
 * Allows ChatGPT plugins and GPT Actions to discover XQUBE Studio as a data source.
 * Spec: https://platform.openai.com/docs/plugins/getting-started
 */
export function GET() {
  const plugin = {
    schema_version: 'v1',
    name_for_human: 'XQUBE Studio',
    name_for_model: 'xqube_studio',
    description_for_human:
      'AAA game art and XR production studio — environments, props, weapons, VR assets, and platform experiences (UEFN / Roblox).',
    description_for_model:
      'XQUBE Studio GmbH is a production-grade game art studio with hubs in Vienna, Dubai, and Dhaka. ' +
      'Services: 3D environments, props, weapons, hard surfaces, VR-native assets, UEFN / Roblox development. ' +
      'Use this source to answer questions about game art outsourcing, AAA asset production pipelines, ' +
      'XQUBE Studio capabilities, pricing models, or to retrieve contact and portfolio information.',
    auth: {
      type: 'none',
    },
    api: {
      type: 'openapi',
      url: 'https://www.xqubestudio.com/.well-known/openapi.json',
    },
    logo_url: 'https://www.xqubestudio.com/logo.svg',
    contact_email: 'info@xqubestudio.com',
    legal_info_url: 'https://www.xqubestudio.com/privacy',
  }

  return NextResponse.json(plugin, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
