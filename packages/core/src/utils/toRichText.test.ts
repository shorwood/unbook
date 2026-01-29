import { toRichText } from './toRichText'

describe('toRichText', () => {
  describe('undefined input', () => {
    it('should return an empty array when input is undefined', () => {
      const result = toRichText(undefined)
      expect(result).toEqual([])
    })
  })

  describe('RichText[] input', () => {
    it('should return the input array as is when given RichText[]', () => {
      const input = [{
        type: 'text' as const,
        href: null,
        plain_text: 'Hello',
        text: { content: 'Hello', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
      }]
      const result = toRichText(input)
      expect(result).toBe(input)
    })
  })

  describe('plain string input', () => {
    it('should convert a plain string to a RichText array', () => {
      const result = toRichText('Hello World')
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        type: 'text',
        plain_text: 'Hello World',
        text: { content: 'Hello World', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
      })
    })

    it('should return plain text fallback for empty string', () => {
      const result = toRichText('')
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        type: 'text',
        plain_text: '',
        text: { content: '', link: null },
      })
    })
  })

  describe('bold formatting', () => {
    it('should parse **bold** syntax', () => {
      const result = toRichText('Hello **World**')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'Hello ', annotations: { bold: false } })
      expect(result[1]).toMatchObject({ plain_text: 'World', annotations: { bold: true } })
    })

    it('should parse __bold__ syntax', () => {
      const result = toRichText('Hello __World__')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'Hello ', annotations: { bold: false } })
      expect(result[1]).toMatchObject({ plain_text: 'World', annotations: { bold: true } })
    })
  })

  describe('italic formatting', () => {
    it('should parse *italic* syntax', () => {
      const result = toRichText('Hello *World*')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'Hello ', annotations: { italic: false } })
      expect(result[1]).toMatchObject({ plain_text: 'World', annotations: { italic: true } })
    })

    it('should parse _italic_ syntax', () => {
      const result = toRichText('Hello _World_')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'Hello ', annotations: { italic: false } })
      expect(result[1]).toMatchObject({ plain_text: 'World', annotations: { italic: true } })
    })
  })

  describe('strikethrough formatting', () => {
    it('should parse ~~strikethrough~~ syntax', () => {
      const result = toRichText('Hello ~~World~~')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'Hello ', annotations: { strikethrough: false } })
      expect(result[1]).toMatchObject({ plain_text: 'World', annotations: { strikethrough: true } })
    })
  })

  describe('inline code formatting', () => {
    it('should parse `code` syntax', () => {
      const result = toRichText('Hello `World`')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'Hello ', annotations: { code: false } })
      expect(result[1]).toMatchObject({ plain_text: 'World', annotations: { code: true } })
    })
  })

  describe('link formatting', () => {
    it('should parse [text](url) syntax', () => {
      const result = toRichText('Visit [GitHub](https://github.com)')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'Visit ', href: null })
      expect(result[1]).toMatchObject({
        plain_text: 'GitHub',
        href: 'https://github.com',
        text: { content: 'GitHub', link: { url: 'https://github.com' } },
      })
    })

    it('should parse standalone link', () => {
      const result = toRichText('[Click here](https://example.com)')
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        plain_text: 'Click here',
        href: 'https://example.com',
        text: { link: { url: 'https://example.com' } },
      })
    })
  })

  describe('nested formatting', () => {
    it('should parse **bold _and italic_** syntax', () => {
      const result = toRichText('**bold _and italic_**')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'bold ', annotations: { bold: true, italic: false } })
      expect(result[1]).toMatchObject({ plain_text: 'and italic', annotations: { bold: true, italic: true } })
    })

    it('should parse *italic with **bold** inside* syntax', () => {
      const result = toRichText('*italic with **bold** inside*')
      expect(result).toHaveLength(3)
      expect(result[0]).toMatchObject({ plain_text: 'italic with ', annotations: { bold: false, italic: true } })
      expect(result[1]).toMatchObject({ plain_text: 'bold', annotations: { bold: true, italic: true } })
      expect(result[2]).toMatchObject({ plain_text: ' inside', annotations: { bold: false, italic: true } })
    })

    it('should parse ~~strikethrough with **bold**~~ syntax', () => {
      const result = toRichText('~~strikethrough with **bold**~~')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'strikethrough with ', annotations: { strikethrough: true, bold: false } })
      expect(result[1]).toMatchObject({ plain_text: 'bold', annotations: { strikethrough: true, bold: true } })
    })
  })

  describe('complex formatting', () => {
    it('should parse multiple formatting types in one string', () => {
      const result = toRichText('Normal **bold** and *italic* and `code`')
      expect(result).toHaveLength(6)
      expect(result[0]).toMatchObject({ plain_text: 'Normal ', annotations: { bold: false, italic: false, code: false } })
      expect(result[1]).toMatchObject({ plain_text: 'bold', annotations: { bold: true } })
      expect(result[2]).toMatchObject({ plain_text: ' and ', annotations: { bold: false, italic: false } })
      expect(result[3]).toMatchObject({ plain_text: 'italic', annotations: { italic: true } })
      expect(result[4]).toMatchObject({ plain_text: ' and ', annotations: { italic: false, code: false } })
      expect(result[5]).toMatchObject({ plain_text: 'code', annotations: { code: true } })
    })

    it('should parse bold link', () => {
      const result = toRichText('**[Bold Link](https://example.com)**')
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        plain_text: 'Bold Link',
        href: 'https://example.com',
        annotations: { bold: true },
        text: { link: { url: 'https://example.com' } },
      })
    })
  })

  describe('edge cases', () => {
    it('should handle consecutive formatted segments', () => {
      const result = toRichText('**bold***italic*')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ plain_text: 'bold', annotations: { bold: true } })
      expect(result[1]).toMatchObject({ plain_text: 'italic', annotations: { italic: true } })
    })

    it('should preserve underline as false (not supported in markdown)', () => {
      const result = toRichText('**bold**')
      expect(result[0]?.annotations.underline).toBe(false)
    })

    it('should preserve color as default', () => {
      const result = toRichText('**bold**')
      expect(result[0]?.annotations.color).toBe('default')
    })
  })
})
