import type { Property } from '@/types'
import { type MaybeRichText, toRichText } from './toRichText'

/**
 * Converts a title input into a Notion-compatible title property object.
 *
 * @param title The title input, which can be a string or rich text.
 * @returns An object representing the title property for Notion.
 * @example toTitleProperties('My Title') // { title: { type: 'title', title: [ ... ] } }
 */
export function toTitleProperties(title?: MaybeRichText): Record<string, Property.ValueInput> {
  return {
    title: {
      type: 'title',
      title: toRichText(title),
    },
  }
}
