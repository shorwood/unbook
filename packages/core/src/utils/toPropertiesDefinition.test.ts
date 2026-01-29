import type { Schema } from '@/types'
import { toPropertiesDefinition } from './toPropertiesDefinition'

describe('toPropertiesDefinition', () => {
  it('should return an empty object for an empty schema', () => {
    const result = toPropertiesDefinition({})
    expect(result).toStrictEqual({})
  })

  it('should key properties by their label', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
      description: { label: 'Description', type: 'rich_text' },
    }
    const result = toPropertiesDefinition(schema)
    expect(Object.keys(result)).toStrictEqual(['Name', 'Description'])
  })

  it('should convert all fields in the schema', () => {
    const schema: Schema.Definition = {
      name: { label: 'Name', type: 'title' },
      count: { label: 'Count', type: 'number' },
      isActive: { label: 'Is Active', type: 'checkbox' },
    }
    const result = toPropertiesDefinition(schema)
    expect(result).toMatchObject({
      'Name': { type: 'title' },
      'Count': { type: 'number' },
      'Is Active': { type: 'checkbox' },
    })
  })

  it('should handle labels with special characters', () => {
    const schema: Schema.Definition = {
      email: { label: 'E-Mail Address', type: 'email' },
      phone: { label: 'Phone #', type: 'phone_number' },
    }
    const result = toPropertiesDefinition(schema)
    expect(Object.keys(result)).toStrictEqual(['E-Mail Address', 'Phone #'])
  })

  it('should preserve field-specific configurations', () => {
    const schema: Schema.Definition = {
      price: { label: 'Price', type: 'number', format: 'dollar' },
      taskId: { label: 'Task ID', type: 'unique_id', prefix: 'TASK' },
    }
    const result = toPropertiesDefinition(schema)
    expect(result).toMatchObject({
      'Price': { type: 'number', number: { format: 'dollar' } },
      'Task ID': { type: 'unique_id', unique_id: { prefix: 'TASK' } },
    })
  })
})
