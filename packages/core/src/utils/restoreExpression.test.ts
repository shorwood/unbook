import type { Schema } from '@/types'
import { randomUUID } from 'node:crypto'
import { restoreExpression } from './restoreExpression'

export function createEncodedExpression(
  propertyId: string,
  dataSourceId: string,
): string {
  const encodedPropertyId = encodeURIComponent(propertyId)
  const blockId = randomUUID()
  return `{{notion:block_property:${encodedPropertyId}:${dataSourceId}:${blockId}}}`
}

describe('restoreExpression', () => {
  const dataSourceId = randomUUID()

  it('should replace a single block property reference with schema key', () => {
    const schema: Schema.Definition = {
      quantity: { id: '~>s~', label: 'Quantity', type: 'number', format: 'number' },
    }
    const expression = createEncodedExpression('~>s~', dataSourceId)
    const result = restoreExpression(expression, dataSourceId, schema)
    expect(result).toBe('prop("quantity")')
  })

  it('should replace multiple block property references with schema keys', () => {
    const schema: Schema.Definition = {
      quantity: { id: '~>s~', label: 'Quantity', type: 'number', format: 'number' },
      unitPrice: { id: 'pdS}', label: 'Unit Price', type: 'number', format: 'dollar' },
    }
    const expression = `${createEncodedExpression('~>s~', dataSourceId)} + ${createEncodedExpression('pdS}', dataSourceId)}`
    const result = restoreExpression(expression, dataSourceId, schema)
    expect(result).toBe('prop("quantity") + prop("unitPrice")')
  })

  it('should preserve references to different databases', () => {
    const schema: Schema.Definition = {
      quantity: { id: '~>s~', label: 'Quantity', type: 'number', format: 'number' },
    }
    const otherDatabaseId = randomUUID()
    const expression = createEncodedExpression('~>s~', otherDatabaseId)
    const result = restoreExpression(expression, dataSourceId, schema)
    expect(result).toBe(expression)
  })

  it('should preserve unknown property references', () => {
    const schema: Schema.Definition = {
      quantity: { id: '~>s~', label: 'Quantity', type: 'number', format: 'number' },
    }
    const expression = createEncodedExpression('unknown', dataSourceId)
    const result = restoreExpression(expression, dataSourceId, schema)
    expect(result).toBe(expression)
  })

  it('should handle expressions with mixed content', () => {
    const schema: Schema.Definition = {
      quantity: { id: '~>s~', label: 'Quantity', type: 'number', format: 'number' },
      unitPrice: { id: 'pdS}', label: 'Unit Price', type: 'number', format: 'dollar' },
    }
    const expression = `round(${createEncodedExpression('~>s~', dataSourceId)} * ${createEncodedExpression('pdS}', dataSourceId)}, 2)`
    const result = restoreExpression(expression, dataSourceId, schema)
    expect(result).toBe('round(prop("quantity") * prop("unitPrice"), 2)')
  })

  it('should return the original expression if no references are found', () => {
    const schema: Schema.Definition = {}
    const expression = 'prop("quantity") + prop("unitPrice")'
    const result = restoreExpression(expression, dataSourceId, schema)
    expect(result).toBe(expression)
  })

  it('should handle empty expression', () => {
    const schema: Schema.Definition = {}
    const result = restoreExpression('', dataSourceId, schema)
    expect(result).toBe('')
  })
})
