import type { Adapter } from '@/adapter'
import type { FileObject } from '@/types'
import { getFileObjectUrl } from '@/utils'

export class File {
  constructor(
    readonly adapter: Adapter,
    readonly object: FileObject,
  ) {}

  /**
   * Gets the type of the file, either 'external' or 'file'.
   * - External: A file hosted outside the system, accessible via a URL.
   * - File: A file hosted within the system, with its own URL and expiry time.
   *
   * @returns The type of the file.
   * @example file.type // 'external' | 'file'
   */
  get type() {
    return this.object.type
  }

  /**
   * Gets the name of the file, if available.
   *
   * @returns The name of the file or undefined if not set.
   * @example file.name // 'document.pdf' | undefined
   */
  get name(): string | undefined {
    return this.object.name
  }

  /**
   * Gets the URL of the file.
   *
   * @returns The URL of the file.
   * @example file.url // 'https://example.com/file.png'
   */
  get url(): string {
    return getFileObjectUrl(this.object)
  }

  /**
   * Downloads the file content as a Buffer.
   *
   * @returns A promise that resolves to the file content as a Buffer.
   * @example const content = await file.download()
   */
  async download(): Promise<Buffer> {
    const response = await fetch(this.url)
    if (!response.ok) throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
}
