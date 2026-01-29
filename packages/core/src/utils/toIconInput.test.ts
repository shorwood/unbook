import type { IconInput } from '@/types'
import { toIconInput } from './toIconInput'

describe('toIconInput', () => {
  describe('emoji strings', () => {
    it('should convert an emoji string to an Emoji icon', () => {
      const result = toIconInput('😊')
      expect(result).toMatchObject({ type: 'emoji', emoji: '😊' })
    })

    it('should convert a text string to an Emoji icon', () => {
      const result = toIconInput('🚀')
      expect(result).toMatchObject({ type: 'emoji', emoji: '🚀' })
    })
  })

  describe('URL strings', () => {
    it('should convert an https URL string to an External icon', () => {
      const result = toIconInput('https://example.com/icon.png')
      expect(result).toMatchObject({ type: 'external', external: { url: 'https://example.com/icon.png' } })
    })

    it('should convert an http URL string to an External icon', () => {
      const result = toIconInput('http://example.com/icon.png')
      expect(result).toMatchObject({ type: 'external', external: { url: 'http://example.com/icon.png' } })
    })
  })

  describe('URL instances', () => {
    it('should convert a URL instance to an External icon', () => {
      const result = toIconInput(new URL('https://example.com/icon.png'))
      expect(result).toMatchObject({ type: 'external', external: { url: 'https://example.com/icon.png' } })
    })
  })

  describe('Iconify strings', () => {
    it('should convert an Iconify string to an External icon with Iconify API URL', () => {
      const result = toIconInput('@iconify/carbon:user.svg')
      expect(result).toMatchObject({ type: 'external', external: { url: 'https://api.iconify.design/carbon:user.svg' } })
    })

    it('should handle Iconify strings with different icon sets', () => {
      const result = toIconInput('@iconify/mdi:home.svg')
      expect(result).toMatchObject({ type: 'external', external: { url: 'https://api.iconify.design/mdi:home.svg' } })
    })
  })

  describe('IconInput passthrough', () => {
    it('should return an Emoji IconInput as-is', () => {
      const icon: IconInput = { type: 'emoji', emoji: '📁' }
      const result = toIconInput(icon)
      expect(result).toBe(icon)
    })

    it('should return an External IconInput as-is', () => {
      const icon: IconInput = { type: 'external', external: { url: 'https://example.com/icon.png' } }
      const result = toIconInput(icon)
      expect(result).toBe(icon)
    })

    it('should return a File IconInput as-is', () => {
      const icon: IconInput = { type: 'file_upload', file_upload: { id: 'file-id-123' } }
      const result = toIconInput(icon)
      expect(result).toBe(icon)
    })
  })

  describe('null and undefined', () => {
    it('should return undefined for null', () => {
      const result = toIconInput(null)
      expect(result).toBeUndefined()
    })

    it('should return undefined for undefined', () => {
      const result = toIconInput()
      expect(result).toBeUndefined()
    })

    it('should return undefined when called with no arguments', () => {
      const result = toIconInput()
      expect(result).toBeUndefined()
    })
  })
})
