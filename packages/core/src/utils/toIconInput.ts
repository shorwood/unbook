import type { IconInput } from '@/types'

/** Type that may be either an array of RichText objects or a plain string */
export type MaybeIconInput =
  | IconInput
  | string
  | URL

/**
 * Converts a string or null value into an Icon object or null.
 *
 * @param icon The icon value to convert, which can be an Icon object, a string (emoji), or null/undefined.
 * @returns An Icon object if a valid icon is provided; otherwise, null.
 * @example
 *
 * // From emoji string
 * toIcon("😊") // Returns: { type: 'emoji', emoji: '😊' }
 *
 * // From URL string
 * toIcon("https://example.com/icon.png") // Returns: { type: 'external', external: { url: 'https://example.com/icon.png' } }
 *
 * // From URL instance
 * toIcon(new URL("https://example.com/icon.png")) // Returns: { type: 'external', external: { url: 'https://example.com/icon.png' } }
 *
 * // From Icon object
 * toIcon({ type: 'external', external: { url: 'https://example.com/icon.png' } })
 *
 * // From file Icon object
 * toIcon({ type: 'file', file: { url: 'https://example.com/icon.png', expiry_time: '2024-12-31T23:59:59Z' } })
 *
 * // From Iconify API
 * toIcon('@iconify/carbon:user.svg') // Returns: { type: 'external', external: { url: 'https://api.iconify.design/carbon:user.svg' } }
 *
 * // From null or undefined
 * toIcon(null) // Returns: undefined
 */
export function toIconInput(icon?: MaybeIconInput | null): IconInput | undefined {
  if (!icon) return

  // --- Handle URL instance
  if (icon instanceof URL)
    return { type: 'external', external: { url: icon.href } }

  // --- Handle string inputs
  if (typeof icon === 'string') {

    // --- Handle URL strings
    if (icon.startsWith('http://') || icon.startsWith('https://'))
      return { type: 'external', external: { url: icon } }

    // --- Handle Iconify API strings (e.g., '@iconify/carbon:user')
    if (icon.startsWith('@iconify/')) {
      const iconName = icon.slice('@iconify/'.length)
      return { type: 'external', external: { url: `https://api.iconify.design/${iconName}` } }
    }

    // --- Default: treat as emoji
    return { type: 'emoji', emoji: icon }
  }

  // --- Pass through IconObject as-is
  return icon
}
