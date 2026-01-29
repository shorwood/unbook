import type { Schema } from '@/types'
import { buildExpression } from './buildExpression'

const PROPERTY_QUANTITY = { label: 'Quantity', type: 'number' } as const
const PROPERTY_UNIT_PRICE = { label: 'Unit Price', type: 'number' } as const

describe('buildExpression', () => {
  it('should replace a single schema key reference with label', () => {
    const schema: Schema.Definition = { quantity: PROPERTY_QUANTITY }
    const expression = 'prop("quantity")'
    const result = buildExpression(expression, schema)
    expect(result).toBe('prop("Quantity")')
  })

  it('should replace multiple schema key references', () => {
    const schema: Schema.Definition = { quantity: PROPERTY_QUANTITY, unitPrice: PROPERTY_UNIT_PRICE }
    const expression = 'prop("quantity") * prop("unitPrice")'
    const result = buildExpression(expression, schema)
    expect(result).toBe('prop("Quantity") * prop("Unit Price")')
  })

  it('should preserve unknown key references', () => {
    const schema: Schema.Definition = { quantity: PROPERTY_QUANTITY }
    const expression = 'prop("unknown")'
    const result = buildExpression(expression, schema)
    expect(result).toBe('prop("unknown")')
  })

  it('should handle expressions with mixed content', () => {
    const schema: Schema.Definition = { quantity: PROPERTY_QUANTITY, unitPrice: PROPERTY_UNIT_PRICE }
    const expression = 'round(prop("quantity") * prop("unitPrice"), 2)'
    const result = buildExpression(expression, schema)
    expect(result).toBe('round(prop("Quantity") * prop("Unit Price"), 2)')
  })

  it('should return the original expression if no prop references are found', () => {
    const schema: Schema.Definition = {}
    const expression = '1 + 2'
    const result = buildExpression(expression, schema)
    expect(result).toBe('1 + 2')
  })

  it('should handle empty expression', () => {
    const schema: Schema.Definition = {}
    const result = buildExpression('', schema)
    expect(result).toBe('')
  })

  it('should handle keys that match their labels', () => {
    const schema: Schema.Definition = { name: { label: 'name', type: 'title' } }
    const expression = 'prop("name")'
    const result = buildExpression(expression, schema)
    expect(result).toBe('prop("name")')
  })
})
