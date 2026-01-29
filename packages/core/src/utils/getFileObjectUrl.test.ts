import type { FileObject } from '@/types'
import { getFileObjectUrl } from './getFileObjectUrl'

const FILE_EXTERNAL: FileObject.External = {
  type: 'external',
  external: {
    url: 'https://cdn.example.com/images/photo.jpg',
  },
}

const FILE_HOSTED: FileObject.Hosted = {
  type: 'file',
  file: {
    url: 'https://cdn.example.com/images/photo.jpg',
    expiry_time: '2026-01-28T12:00:00.000Z',
  },
}

describe('getFileObjectUrl', () => {
  describe('external file', () => {
    it('should return the URL from an external file with caption', () => {
      const result = getFileObjectUrl(FILE_EXTERNAL)
      expect(result).toBe(FILE_EXTERNAL.external.url)
    })
  })

  describe('hosted file', () => {
    it('should return the URL from a hosted file object', () => {
      const result = getFileObjectUrl(FILE_HOSTED)
      expect(result).toBe(FILE_HOSTED.file.url)
    })
  })
})
