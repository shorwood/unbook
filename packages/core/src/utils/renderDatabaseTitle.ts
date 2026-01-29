import type { DatabaseObject } from '@/types'
import type { RenderOptions } from './renderMention'
import { renderRichText } from './renderRichText'

/**
 * Extracts the plain text title from a DatabaseObject.
 *
 * @param database The DatabaseObject from which to extract the title.
 * @param options Options for rendering mentions within the title.
 * @returns The plain text title of the database.
 * @example
 *
 * // Given a DatabaseObject
 * const database: DatabaseObject = {
 *   id: 'some-database-id',
 *   title: [
 *     {
 *       type: 'text',
 *       text: { content: 'My Database Title' },
 *       plain_text: 'My Database Title',
 *       href: null
 *     }
 *   ]
 * }
 *
 * // Get the database title
 * const title = await renderDatabaseTitle(database, options) // 'My Database Title'
 */
export async function renderDatabaseTitle(
  database: DatabaseObject | undefined,
  options: RenderOptions,
): Promise<string> {
  return await renderRichText(database?.title, options)
}
