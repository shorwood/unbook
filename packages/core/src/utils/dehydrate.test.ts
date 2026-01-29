import type { Schema } from '@/types'
import { dehydrate } from './dehydrate'

describe('dehydrate', () => {
  it('should return empty object for empty data', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
    }
    const result = dehydrate(schema, {})
    expect(result).toStrictEqual({})
  })

  it('should key properties by their label', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
      description: { label: 'Description', type: 'rich_text' },
    }
    const result = dehydrate(schema, { name: 'Test', description: 'Some text' })
    expect(Object.keys(result)).toStrictEqual(['Name', 'Description'])
  })

  it('should skip undefined values', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
      description: { label: 'Description', type: 'rich_text' },
    }
    const result = dehydrate(schema, { name: 'Test', description: undefined })
    expect(Object.keys(result)).toStrictEqual(['Name'])
  })

  it('should skip keys not in schema', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
    }
    const result = dehydrate(schema, { name: 'Test', unknown: 'value' })
    expect(Object.keys(result)).toStrictEqual(['Name'])
  })

  it('should skip unsupported field types', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
      calc: { label: 'Calculation', type: 'formula', expression: '1+1' },
    }
    const result = dehydrate(schema, { name: 'Test', calc: 'ignored' })
    expect(Object.keys(result)).toStrictEqual(['Name'])
  })
})
