/* eslint-disable sonarjs/cognitive-complexity */
import type { BlockObject } from '@/types'
import type { RenderOptions } from './renderMention'
import { getFileObjectUrl } from './getFileObjectUrl'
import { renderPageTitle } from './renderPageTitle'
import { renderRichText } from './renderRichText'

export interface RenderBlockOptions extends RenderOptions {
  resolveChildren: (parentId: string) => AsyncIterable<BlockObject>
}

/**
 * Get's the markdown equivalent of the block's content. This is a
 * simplified representation and may not capture all formatting details.
 * Roundtripping is not guaranteed to preserve all original content or formatting.
 *
 * @param block The block data to convert to markdown.
 * @param options Options for resolving related data, such as child blocks.
 * @returns The markdown representation of the block's content.
 * @example const markdown = await block.toMarkdown() // '**Bold Text**'
 */
export async function renderBlock(block: BlockObject, options: RenderBlockOptions): Promise<string> {
  const { resolveChildren, ...renderTextOptions } = options
  const { resolvePage } = renderTextOptions

  let content = ''

  // --- Handle paragraph/template as a simple text block.
  if (block.type === 'paragraph') {
    content = await renderRichText(block.paragraph.rich_text, renderTextOptions)
  }
  else if (block.type === 'template') {
    content = await renderRichText(block.template.rich_text, renderTextOptions)
  }
  else if (block.type === 'equation') {
    const expression = block.equation.expression
    content = `$$\n${expression}\n$$`
  }

  // --- Handle H1-3 as markdown headings.
  else if (block.type === 'heading_1') {
    const text = await renderRichText(block.heading_1.rich_text, renderTextOptions)
    content = `# ${text}`
  }
  else if (block.type === 'heading_2') {
    const text = await renderRichText(block.heading_2.rich_text, renderTextOptions)
    content = `## ${text}`
  }
  else if (block.type === 'heading_3') {
    const text = await renderRichText(block.heading_3.rich_text, renderTextOptions)
    content = `### ${text}`
  }

  // --- Handle list items and to-dos as markdown list syntax.
  else if (block.type === 'bulleted_list_item') {
    const text = await renderRichText(block.bulleted_list_item.rich_text, renderTextOptions)
    content = `- ${text}`
  }
  else if (block.type === 'numbered_list_item') {
    const text = await renderRichText(block.numbered_list_item.rich_text, renderTextOptions)
    content = `1. ${text}`
  }
  else if (block.type === 'to_do') {
    const check = block.to_do.checked ? 'x' : ' '
    const text = await renderRichText(block.to_do.rich_text, renderTextOptions)
    content = `- [${check}] ${text}`
  }

  // --- Handle divider as horizontal rule.
  else if (block.type === 'divider') {
    content = '---'
  }

  // --- Wrap block quotes with > for each line.
  else if (block.type === 'quote') {
    const text = await renderRichText(block.quote.rich_text, renderTextOptions)
    content = text
      .split('\n')
      .map(line => `> ${line}`)
      .join('\n')
  }

  // --- Wrap code blocks with triple backticks and specify language.
  else if (block.type === 'code') {
    const language = block.code.language || ''
    const text = await renderRichText(block.code.rich_text, renderTextOptions)
    content = `\`\`\`${language}\n${text}\n\`\`\``
  }

  // --- Handles toggle blocks by creating a details/summary HTML structure.
  // --- Note that the closing </details> tag is added after child blocks are processed.
  else if (block.type === 'toggle') {
    const summary = await renderRichText(block.toggle.rich_text, renderTextOptions)
    content = `<details><summary>${summary}</summary>`
  }

  // --- Handle callout blocks by prefixing each line with > and optional icon.
  // --- This mimics blockquote syntax with an icon prefix for visual distinction
  // --- but this cannot be roundtripped back to a callout block.
  else if (block.type === 'callout') {
    const icon = block.callout.icon
    const prefix = icon?.type === 'emoji' ? `${icon.emoji} ` : ''
    const text = await renderRichText(block.callout.rich_text, renderTextOptions)
    content = text
      .split('\n')
      .map(line => `> ${prefix}${line}`)
      .join('\n')
  }

  // --- Handle media blocks (image, video, file, pdf, audio, bookmark, embed).
  // --- Uses markdown syntax for images and links.
  else if (block.type === 'image') {
    const caption = await renderRichText(block.image.caption, renderTextOptions)
    const fileUrl = getFileObjectUrl(block.image)
    content = `![${caption}](${fileUrl})`
  }
  else if (block.type === 'video') {
    const caption = await renderRichText(block.video.caption, renderTextOptions)
    const fileUrl = getFileObjectUrl(block.video)
    content = `[${caption}](${fileUrl})`
  }
  else if (block.type === 'file') {
    const caption = await renderRichText(block.file.caption, renderTextOptions)
    const fileUrl = getFileObjectUrl(block.file)
    content = `[${caption}](${fileUrl})`
  }
  else if (block.type === 'pdf') {
    const caption = await renderRichText(block.pdf.caption, renderTextOptions)
    const fileUrl = getFileObjectUrl(block.pdf)
    content = `[${caption}](${fileUrl})`
  }
  else if (block.type === 'audio') {
    const caption = await renderRichText(block.audio.caption, renderTextOptions)
    const fileUrl = getFileObjectUrl(block.audio)
    content = `[${caption}](${fileUrl})`
  }
  else if (block.type === 'bookmark') {
    const caption = await renderRichText(block.bookmark.caption, renderTextOptions)
    content = `[${caption}](${block.bookmark.url})`
  }
  else if (block.type === 'embed') {
    const caption = await renderRichText(block.embed.caption, renderTextOptions)
    content = `[${caption}](${block.embed.url})`
  }

  // --- Handle table rows as markdown table syntax. This expects that the
  // --- parent table block will handle the header and separator rows.
  else if (block.type === 'table_row') {
    const cells = await Promise.all(block.table_row.cells.map(cell => renderRichText(cell, renderTextOptions)))
    content = `| ${cells.join(' | ')} |`
  }

  // --- Table of content is a special block with no direct markdown equivalent.
  // --- To allow loose roundtripping, we represent it with an HTML-like placeholder.
  else if (block.type === 'table_of_contents') {
    content = '<TableOfContents />'
  }

  // --- Relational blocks represented as links to their IDs. The title text is
  // --- used where available (e.g., child_page, child_database), otherwise a generic label.
  else if (block.type === 'child_page') {
    const title = block.child_page.title
    content = `[${title}](${block.id})`
  }
  else if (block.type === 'child_database') {
    const title = block.child_database.title
    content = `[${title}](${block.id})`
  }

  // --- Handle link_to_page blocks by resolving the linked page or database
  // --- and using its title as the link text for better readability.
  else if (block.type === 'link_to_page') {
    if (block.link_to_page.type === 'page_id') {
      const page = await resolvePage(block.link_to_page.page_id)
      const title = await renderPageTitle(page, renderTextOptions)
      content = `[${title}](${block.link_to_page.page_id})`
    }
    else if (block.link_to_page.type === 'database_id') {
      const database = await resolvePage(block.link_to_page.database_id)
      const title = await renderPageTitle(database, renderTextOptions)
      content = `[${title}](${block.link_to_page.database_id})`
    }
  }

  // --- If the block has children, recursively render them and append their
  // --- markdown representation, properly indented.
  if (block.has_children) {
    const childrenMarkdown: string[] = []
    for await (const child of resolveChildren(block.id)) {
      const childMarkdown = await renderBlock(child, options)

      // --- Handle children indentation based on block type.
      if (block.type === 'column_list'
        || block.type === 'column'
        || block.type === 'synced_block') {
        childrenMarkdown.push(childMarkdown)
      }

      // --- Tables have special handling for rows. They dont
      // --- need additional indentation or formatting.
      else if (block.type === 'table') {
        childrenMarkdown.push(childMarkdown)
      }

      // --- Other block types indent child content by two spaces.
      else {
        const text = childMarkdown.split('\n').map(line => `  ${line}`).join('\n')
        childrenMarkdown.push(text)
      }
    }

    if (childrenMarkdown.length > 0) {
      // For tables, add a separator row after the first row (header)
      if (block.type === 'table' && childrenMarkdown.length > 0) {
        const firstRow = childrenMarkdown[0]
        const colCount = (firstRow?.match(/\|/g)?.length ?? 1) - 1
        const separator = `|${' --- |'.repeat(colCount)}`
        childrenMarkdown.splice(1, 0, separator)
      }

      content += content
        ? `\n${childrenMarkdown.join('\n')}`
        : childrenMarkdown.join('\n')
    }
  }

  // --- Ensure that `<details>` blocks are properly closed. This is done
  // --- after processing children to encapsulate them within the details.
  if (block.type === 'toggle')
    content += '\n</details>'

  // --- Return the final markdown content for the block.
  return content
}
