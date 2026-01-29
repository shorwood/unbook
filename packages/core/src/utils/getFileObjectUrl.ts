import type { FileObject } from '@/types'

/**
 * Extracts the URL from a file object (external or hosted).
 *
 * @param file The file object containing the URL.
 * @returns The URL of the file.
 * @example
 *
 * // Declare a `FileObject` object
 * const file: FileObject = {
 *   type: 'external',
 *   external: { url: 'https://example.com/file.png' }
 * }
 *
 * // Get the file URL
 * const url = getFileObjectUrl(file) // 'https://example.com/file.png'
 */
export function getFileObjectUrl(file: FileObject): string {
  return file.type === 'external'
    ? file.external.url
    : file.file.url
}
