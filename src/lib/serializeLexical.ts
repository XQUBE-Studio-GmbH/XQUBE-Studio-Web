export function serializeLexical(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const node = content as Record<string, unknown>

  if (node.root) return serializeLexical(node.root)

  const children = Array.isArray(node.children)
    ? (node.children as unknown[]).map(serializeLexical).join('')
    : ''

  switch (node.type) {
    case 'root':      return children
    case 'paragraph': return children ? `<p>${children}</p>` : ''
    case 'heading': {
      const tag = `h${node.tag ?? 2}`
      return `<${tag}>${children}</${tag}>`
    }
    case 'list':    return node.listType === 'bullet' ? `<ul>${children}</ul>` : `<ol>${children}</ol>`
    case 'listitem': return `<li>${children}</li>`
    case 'quote':   return `<blockquote>${children}</blockquote>`
    case 'code':    return `<pre><code>${children}</code></pre>`
    case 'text': {
      let text = String(node.text ?? '')
      if (!text) return ''
      if ((node.format as number) & 1)  text = `<strong>${text}</strong>`
      if ((node.format as number) & 2)  text = `<em>${text}</em>`
      if ((node.format as number) & 8)  text = `<u>${text}</u>`
      if ((node.format as number) & 16) text = `<s>${text}</s>`
      if ((node.format as number) & 32) text = `<code>${text}</code>`
      return text
    }
    case 'link': {
      const url   = (node.fields as Record<string, unknown>)?.url ?? node.url ?? '#'
      const attrs = (node.fields as Record<string, unknown>)?.newTab
        ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${url}"${attrs}>${children}</a>`
    }
    case 'linebreak': return '<br />'
    default: return children
  }
}
