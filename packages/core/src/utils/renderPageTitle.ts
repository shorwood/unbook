import type { PageObject } from '@/types'
import type { RenderOptions } from './renderMention'
import { renderRichText } from './renderRichText'

/**
 * Extracts the plain text title from a PageObject by finding the title property.
 *
 * @param page The PageObject from which to extract the title.
 * @param options Options for rendering mentions within the title.
 * @returns The plain text title of the page, or undefined if no title property is found.
 * @example
 *
 * // Given a PageObject
 * const page: PageObject = {
 *   id: 'some-page-id',
 *   properties: {
 *     Name: {
 *       id: 'title',
 *       type: 'title',
 *       title: [
 *         { type: 'text', text: { content: 'My Page Title' }, plain_text: 'My Page Title', href: null }
 *       ]
 *     }
 *   }
 * }
 *
 * // Get the page title
 * const title = getPageTitle(page) // 'My Page Title'
 */
export async function renderPageTitle(
  page: PageObject | undefined,
  options: RenderOptions,
): Promise<string | undefined> {
  if (!page) return
  for (const property of Object.values(page.properties)) {
    if (property.type === 'title')
      return await renderRichText(property.title, options)
  }
}
