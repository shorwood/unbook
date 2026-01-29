import type { Property, Schema } from '@/types'
import { hydrateValue } from './hydrateValue'

/**
 * Converts raw page property values into a typed record based on a schema definition.
 *
 * @param schema The schema definition mapping keys to field types.
 * @param properties The raw property values from the API.
 * @returns A typed record with extracted values.
 * @example
 * const schema: Schema.Definition = {
 *   name: { label: 'Name', type: 'title' },
 *   description: { label: 'Description', type: 'rich_text' },
 * }
 *
 * const record = hydrateRecord(schema, page.properties)
 * // { name: 'My Item', description: 'Some text' }
 */
export function hydrate(
  schema: Schema.Definition,
  properties: Record<string, Property.Value>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  // --- Iterate over schema keys and extract corresponding property values.
  for (const key of Object.keys(schema)) {
    const field = schema[key]
    const property = properties[field.label]
    if (!property) continue
    const value = hydrateValue(property, field)
    if (value === undefined) continue
    result[key] = value
  }

  // --- Return the hydrated record.
  return result
}
