import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xqubestudio.com'

  // Common disallow list — admin and internal API for all agents
  const disallow = ['/admin/', '/api/']

  return {
    rules: [
      // General crawlers
      { userAgent: '*', allow: '/', disallow },

      // AI training & indexing bots — explicitly allowed on public content
      { userAgent: 'GPTBot',         allow: '/', disallow },
      { userAgent: 'ChatGPT-User',   allow: '/', disallow },
      { userAgent: 'OAI-SearchBot',  allow: '/', disallow },
      { userAgent: 'ClaudeBot',      allow: '/', disallow },
      { userAgent: 'anthropic-ai',   allow: '/', disallow },
      { userAgent: 'Claude-Web',     allow: '/', disallow },
      { userAgent: 'PerplexityBot',  allow: '/', disallow },
      { userAgent: 'Google-Extended',allow: '/', disallow },
      { userAgent: 'Googlebot',      allow: '/', disallow },
      { userAgent: 'Gemini',         allow: '/', disallow },
      { userAgent: 'CCBot',          allow: '/', disallow },
      { userAgent: 'Bytespider',     allow: '/', disallow },
      { userAgent: 'cohere-ai',      allow: '/', disallow },
      { userAgent: 'Meta-ExternalAgent', allow: '/', disallow },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
