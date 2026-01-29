import type { FileInput } from '@/types'

/** Type that may be either a FileInput, a URL string, a URL object, or a UUID string */
export type MaybeFileInput =
  | FileInput
  | string
  | URL

/**
 * Converts various input types into a FileInput object.
 *
 * @param maybeFileInput The input which can be a URL string, URL object, or a UUID string.
 * @returns A FileInput object representing the file input.
 * @example
 *
 * // From URL string
 * toFileInput('https://example.com/image.png')
 * // Returns: { type: 'external', external: { url: 'https://example.com/image.png' } }
 *
 * // From URL object
 * toFileInput(new URL('https://example.com/image.png'))
 * // Returns: { type: 'external', external: { url: 'https://example.com/image.png' } }
 *
 * // From existing UUID object
 * toFileInput('000e4567-e89b-12d3-a456-426614174000')
 * // Returns: { type: 'file_input', file_input: { id: '000e4567-e89b-12d3-a456-426614174000' } }
 */
export function toFileInput(maybeFileInput: MaybeFileInput): FileInput
export function toFileInput(maybeFileInput?: MaybeFileInput): FileInput | undefined
export function toFileInput(maybeFileInput?: MaybeFileInput): FileInput | undefined {
  if (typeof maybeFileInput === 'string'
    || maybeFileInput instanceof URL) {
    return {
      type: 'external',
      external: { url: maybeFileInput.toString() },
    }
  }

  return maybeFileInput
}
