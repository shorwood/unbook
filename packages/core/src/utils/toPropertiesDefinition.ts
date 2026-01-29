import type { Property, Schema } from '@/types'
import { toPropertyDefinition } from './toPropertyDefinition'

/**
 * Converts a `Schema.Definition` to property definitions suitable for the API.
 * This is used when creating or updating data sources.
 *
 * @param schema The schema definition to convert.
 * @returns A record of property definitions, keyed by label.
 * @example
 * const schema: Schema.Definition = {
 *   name: { label: 'Name', type: 'title' },
 *   priority: { label: 'Priority', type: 'select', options: [...] },
 * }
 *
 * const properties = toPropertiesDefinition(schema)
 * // {
 * //   Name: { type: 'title' },
 * //   Priority: { type: 'select', options: [...] },
 * // }
 */
export function toPropertiesDefinition(
  schema: Schema.Definition,
): Record<string, Property.DefinitionInput> {
  const result: Record<string, Property.DefinitionInput> = {}
  for (const key in schema) {
    const field = schema[key]
    result[field.label] = toPropertyDefinition(field)
  }
  return result
}
