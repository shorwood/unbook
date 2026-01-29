import type { Property, Schema } from '@/types'
import { dehydrateValue } from './dehydrateValue'

/**
 * Converts a typed record into raw property values suitable for the API.
 *
 * @param schema The schema definition mapping keys to field types.
 * @param data The typed record to dehydrate.
 * @returns Raw property values for the API, keyed by property label.
 * @example
 * const schema: Schema.Definition = {
 *   name: { label: 'Name', type: 'title' },
 *   description: { label: 'Description', type: 'rich_text' },
 * }
 *
 * const properties = dehydrate(schema, {
 *   name: 'My Item',
 *   description: 'Some text',
 * })
 * // { Name: { type: 'title', title: [...] }, Description: { type: 'rich_text', rich_text: [...] } }
 */
export function dehydrate(
  schema: Schema.Definition,
  data: Record<string, unknown>,
): Record<string, Property.ValueInput> {
  const result: Record<string, Property.ValueInput> = {}

  // --- Iterate over data keys and convert to property values.
  for (const key in data) {
    const value = data[key]
    const field = schema[key]
    if (!field || value === undefined) continue
    const propertyValue = dehydrateValue(field, value)
    if (propertyValue === undefined) continue
    result[field.label] = propertyValue
  }

  // --- Return the dehydrated properties.
  return result
}
