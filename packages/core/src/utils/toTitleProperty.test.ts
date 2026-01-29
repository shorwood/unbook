import { toRichText } from './toRichText'
import { toTitleProperties } from './toTitleProperty'

describe('toTitleProperties', () => {
  it('should convert a plain string to title properties', () => {
    const result = toTitleProperties('My title')
    expect(result).toMatchObject({
      title: {
        type: 'title',
        title: [
          {
            type: 'text',
            plain_text: 'My title',
            text: { content: 'My title', link: null },
          },
        ],
      },
    })
  })

  it('should convert an empty string to title properties with empty text node', () => {
    const result = toTitleProperties('')
    expect(result).toMatchObject({
      title: {
        type: 'title',
        title: [
          {
            type: 'text',
            plain_text: '',
            text: { content: '', link: null },
          },
        ],
      },
    })
  })

  it('should pass through rich text array as-is', () => {
    const richText = [
      {
        type: 'text' as const,
        plain_text: 'Existing Rich Text',
        href: null,
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default' as const,
        },
        text: { content: 'Existing Rich Text', link: null },
      },
    ]
    const result = toTitleProperties(richText)
    expect(result).toMatchObject({
      title: {
        type: 'title',
        title: richText,
      },
    })
  })

  it('should convert markdown formatted string to rich text', () => {
    const result = toTitleProperties('**Bold** and *italic*')
    expect(result).toMatchObject({
      title: {
        type: 'title',
        title: toRichText('**Bold** and *italic*'),
      },
    })
  })
})
