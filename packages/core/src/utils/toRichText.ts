/* eslint-disable unicorn/no-null */
import type { PhrasingContent } from 'mdast'
import type { RichText } from '@/types'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'

/** Type that may be either an array of RichText objects or a plain string */
export type MaybeRichText =
  | RichText[]
  | string

/** @returns Default RichText.Annotations object */
function defaultAnnotations(): RichText.Annotations {
  return {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
    code: false,
    color: 'default',
  }
}

/**
 * Creates a RichText.Text object with the given content, href, and annotations.
 *
 * @param content The text content.
 * @param href The optional link URL.
 * @param annotations The annotations context.
 * @returns A RichText.Text object.
 */
function createRichText(
  content: string,
  href: null | string,
  annotations: Partial<RichText.Annotations>,
): RichText.Text {
  return {
    type: 'text',
    href,
    plain_text: content,
    annotations: {
      ...defaultAnnotations(),
      ...annotations,
    },
    text: {
      content,
      link: href ? { url: href } : null,
    },
  }
}

/**
 * Recursively converts MDAST phrasing content nodes into RichText objects.
 *
 * @param nodes The MDAST phrasing content nodes.
 * @param inherited The inherited annotations context.
 * @returns An array of RichText objects.
 */
function convertInlineNodes(
  nodes: PhrasingContent[],
  inherited: Partial<RichText.Annotations>,
): RichText[] {
  const results: RichText[] = []
  for (const node of nodes) {

    // --- Handle plain text nodes.
    if (node.type === 'text') {
      results.push(createRichText(node.value, null, inherited))
    }

    // --- Handle bold text (**bold** or __bold__).
    else if (node.type === 'strong') {
      results.push(...convertInlineNodes(node.children, { ...inherited, bold: true }))
    }

    // --- Handle italic text (*italic* or _italic_).
    else if (node.type === 'emphasis') {
      results.push(...convertInlineNodes(node.children, { ...inherited, italic: true }))
    }

    // --- Handle strikethrough text (~~strikethrough~~).
    else if (node.type === 'delete') {
      results.push(...convertInlineNodes(node.children, { ...inherited, strikethrough: true }))
    }

    // --- Handle inline code (`code`).
    else if (node.type === 'inlineCode') {
      results.push(createRichText(node.value, null, { ...inherited, code: true }))
    }

    // --- Handle links ([text](url)).
    else if (node.type === 'link') {
      const linkChildren = convertInlineNodes(node.children, inherited)
      for (const child of linkChildren) {
        if (child.type === 'text') {
          child.href = node.url
          child.text.link = { url: node.url }
        }
        results.push(child)
      }
    }

    // --- Ignore other node types (images, breaks, etc.) for now.
  }

  return results
}

/**
 * Converts a string (with markdown) or an array of RichText objects into an array of RichText objects.
 * If the input is a string, it parses markdown and creates RichText objects with appropriate annotations.
 * If the input is already an array of RichText objects, it returns it as is.
 *
 * Supported markdown syntax:
 * - **bold** or __bold__
 * - *italic* or _italic_
 * - ~~strikethrough~~
 * - `inline code`
 * - [links](url)
 * - Nested formatting like **bold _and italic_**
 *
 * @param value The input value which can be either a string or an array of RichText objects.
 * @returns An array of RichText objects.
 * @example
 *
 * // RichText from plain `string`
 * toRichText("Hello World") // returns [RichText { plain_text: "Hello World", ... }]
 *
 * // RichText from markdown `string`
 * toRichText("Hello **World**") // returns [RichText { plain_text: "Hello " }, RichText { plain_text: "World", annotations: { bold: true } }]
 *
 * // RichText from `RichText[]`
 * toRichText([RichText { ... }]) // returns [RichText { ... }]
 */
export function toRichText(value: MaybeRichText | undefined): RichText[] {

  // --- Handle `undefined` input, returning an empty array.
  if (value === undefined)
    return []

  // --- Return `RichText[]` as is.
  if (typeof value !== 'string')
    return value

  // --- Parse markdown string to AST.
  const tree = fromMarkdown(value, {
    extensions: [gfmStrikethrough()],
    mdastExtensions: [gfmStrikethroughFromMarkdown()],
  })

  // --- Convert AST nodes to RichText objects.
  const richTexts: RichText[] = []
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i]
    if (node.type === 'paragraph') {
      // --- Add a newline between paragraphs (double newline in source becomes single newline).
      if (richTexts.length > 0)
        richTexts.push(createRichText('\n', null, {}))
      richTexts.push(...convertInlineNodes(node.children, {}))
    }
  }

  // --- Fallback to plain text if no paragraphs were parsed.
  if (richTexts.length === 0) {
    return [{
      type: 'text',
      href: null,
      plain_text: value,
      text: { content: value, link: null },
      annotations: defaultAnnotations(),
    }]
  }

  // --- Return the resulting RichText array.
  return richTexts
}
