import { NextResponse } from 'next/server'

/**
 * GET /.well-known/openapi.json
 *
 * Minimal OpenAPI 3.1.0 spec for XQUBE Studio's public-facing API endpoints.
 * Referenced by /.well-known/api-catalog (RFC 9727) and /.well-known/ai-plugin.json.
 * Allows AI agents and GPT Actions to discover and call XQUBE Studio's contact/brief endpoints.
 */
export function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'XQUBE Studio API',
      version: '1.0.0',
      description:
        'Public API endpoints for XQUBE Studio — a production-grade AAA game art studio. ' +
        'Supports contact enquiries and project brief submissions.',
      contact: {
        name: 'XQUBE Studio',
        email: 'info@xqubestudio.com',
        url: 'https://www.xqubestudio.com/contact',
      },
      license: {
        name: 'Proprietary',
      },
    },
    servers: [
      {
        url: 'https://www.xqubestudio.com',
        description: 'Production',
      },
    ],
    paths: {
      '/api/contact': {
        post: {
          operationId: 'submitContactEnquiry',
          summary: 'Submit a contact enquiry',
          description:
            'Send a general enquiry to XQUBE Studio. The studio responds within 24 hours.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'message'],
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Full name of the enquirer',
                      maxLength: 120,
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      description: 'Contact email address',
                    },
                    message: {
                      type: 'string',
                      description: 'Enquiry message',
                      maxLength: 4000,
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Enquiry received successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Validation error — missing or invalid fields',
            },
            '429': {
              description: 'Rate limit exceeded',
            },
          },
        },
      },
      '/api/scope': {
        post: {
          operationId: 'submitProjectBrief',
          summary: 'Submit a project brief',
          description:
            'Submit a detailed project brief to request a quote from XQUBE Studio. ' +
            'Covers asset type, platform, scope, timeline, and budget range.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email'],
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Full name of the contact',
                      maxLength: 120,
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      description: 'Business email address',
                    },
                    company: {
                      type: 'string',
                      description: 'Studio or company name',
                      maxLength: 200,
                    },
                    projectType: {
                      type: 'string',
                      description:
                        'Type of project (e.g. environments, props, weapons, VR assets, UEFN)',
                    },
                    platform: {
                      type: 'string',
                      description:
                        'Target platform (e.g. PC, console, mobile, Meta Quest, PSVR2)',
                    },
                    assetCount: {
                      type: 'string',
                      description: 'Approximate number of assets required',
                    },
                    timeline: {
                      type: 'string',
                      description: 'Desired delivery timeline or deadline',
                    },
                    budget: {
                      type: 'string',
                      description: 'Approximate budget range',
                    },
                    description: {
                      type: 'string',
                      description: 'Additional project details or reference links',
                      maxLength: 4000,
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Brief received — XQUBE Studio will respond within 24 hours',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Validation error — missing or invalid fields',
            },
            '429': {
              description: 'Rate limit exceeded',
            },
          },
        },
      },
    },
    'x-llms-txt': 'https://www.xqubestudio.com/llms.txt',
  }

  return NextResponse.json(spec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
