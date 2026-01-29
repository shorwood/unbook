import type { FileInput } from '@/types'
import { toFileInput } from './toFileInput'

const FILE_INPUT_EXTERNAL: FileInput.External = {
  type: 'external',
  external: {
    url: 'https://cdn.example.com/images/photo.jpg',
  },
}

describe('toFileInput', () => {
  describe('URL string', () => {
    it('should convert a URL string to an external FileInput', () => {
      const result = toFileInput('https://example.com/image.png')
      expect(result).toMatchObject({
        type: 'external',
        external: { url: 'https://example.com/image.png' },
      })
    })
  })

  describe('URL object', () => {
    it('should convert a URL object to an external FileInput', () => {
      const result = toFileInput(new URL('https://example.com/image.png'))
      expect(result).toMatchObject({
        type: 'external',
        external: { url: 'https://example.com/image.png' },
      })
    })
  })

  describe('existing FileInput', () => {
    it('should return the FileInput object unchanged', () => {
      const result = toFileInput(FILE_INPUT_EXTERNAL)
      expect(result).toBe(FILE_INPUT_EXTERNAL)
    })
  })
})
