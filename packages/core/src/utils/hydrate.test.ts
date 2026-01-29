import type { Property, Schema } from '@/types'
import { hydrate } from './hydrate'

function createTitle(plain_text: string): Property.Value.Title {
  return {
    id: 'test-id',
    type: 'title',
    title: [{
      type: 'text',
      text: { content: plain_text, link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text,
      href: null,
    }],
  }
}

function createRichText(plain_text: string): Property.Value.RichText {
  return {
    id: 'test-id',
    type: 'rich_text',
    rich_text: [{
      type: 'text',
      text: { content: plain_text, link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text,
      href: null,
    }],
  }
}

describe('hydrate', () => {
  it('should return undefined for missing properties', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
    }
    const result = hydrate(schema, {})
    expect(result.name).toBeUndefined()
  })

  it('should key result by schema keys', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
      description: { label: 'Description', type: 'rich_text' },
    }
    const properties = {
      Name: createTitle('Test'),
      Description: createRichText('Some text'),
    }
    const result = hydrate(schema, properties)
    expect(Object.keys(result)).toStrictEqual(['name', 'description'])
  })

  it('should match properties by field label', () => {
    const schema: Schema.Definition = {
      firstName: { label: 'First Name', type: 'title' },
    }
    const result = hydrate(schema, { 'First Name': createTitle('John') })
    expect(result.firstName).toBe('John')
  })

  it('should handle labels with special characters', () => {
    const schema: Schema.Definition = {
      email: { label: 'E-Mail Address', type: 'rich_text' },
    }
    const result = hydrate(schema, { 'E-Mail Address': createRichText('test@example.com') })
    expect(result.email).toBe('test@example.com')
  })
})
