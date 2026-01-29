import type { RichText } from '@/types'
import type { RenderOptions } from './renderMention'
import { renderMention } from './renderMention'

/**
 * Converts a MaybeRichText (either a string or an array of RichText objects) into markdown text.
 *
 * @param richText The input which can be either a string or an array of RichText objects.
 * @param options Options for fallback text and resolving mentions.
 * @returns A markdown string.
 * @example
 *
 * // From `string`
 * renderRichText("Hello World", options) // returns "Hello World"
 *
 * // From `RichText[]` with annotations
 * const richTextBold: RichText.Text = {
 *   type: 'text',
 *   text: { content: 'Hello', link: null },
 *   annotations: { bold: true, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
 *   plain_text: 'Hello',
 *   href: null,
 * }
 * renderRichText([richTextBold], options) // returns "**Hello**"
 */
export async function renderRichText(
  richText: RichText[] | undefined,
  options: RenderOptions,
): Promise<string> {
  if (!richText) return ''
  if (typeof richText === 'string') return richText

  // --- Process each part of the RichText array.
  const rendered: string[] = []
  for (const part of richText) {
    let content = ''

    // --- Wrap equation in `$...$`
    if (part.type === 'equation') {
      const expression = part.equation.expression
      content = `$${expression}$`
    }

    // --- Render mention dynamically.
    else if (part.type === 'mention') {
      content = await renderMention(part, options)
    }

    // --- Handle text with optional link.
    else if (part.type === 'text') {
      content = part.text.content
      if (part.text.link)
        content = `[${content}](${part.text.link.url})`
    }

    // --- Handle annotations by wrapping content with markdown syntax.
    if (part.annotations.code) content = `\`${content}\``
    if (part.annotations.bold) content = `**${content}**`
    if (part.annotations.italic) content = `_${content}_`
    if (part.annotations.underline) content = `<u>${content}</u>`
    if (part.annotations.strikethrough) content = `~~${content}~~`

    // --- Handle external href.
    if (part.href && part.type !== 'text')
      content = `[${content}](${part.href})`

    // --- Append the processed content.
    rendered.push(content)
  }

  // --- Join all parts and return the final string.
  return rendered.join('')
}
