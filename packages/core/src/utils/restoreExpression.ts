import type { Schema } from '@/types'

/**
 * Pattern to match Notion block property references in formula expressions.
 * Format: {{notion:block_property:<encoded_property_id>:<database_id>:<page_id>}}
 */
const BLOCK_PROPERTY_PATTERN = /{{notion:block_property:([^:]+):([^:]+):([^}]+)}}/g

/**
 * Restores a Notion formula expression by replacing internal block property references
 * with human-readable `prop("schemaKey")` references using the provided schema definition.
 *
 * @param expression The raw Notion formula expression containing block property references.
 * @param dataSourceId The current database ID to match against references.
 * @param schema The schema definition mapping keys to field definitions.
 * @returns The restored expression with `prop("schemaKey")` references.
 * @example
 * const expression = '{{notion:block_property:~%3Es~:abc-123:def-456}} + {{notion:block_property:pdS%7D:abc-123:def-456}}'
 * const databaseId = 'abc-123'
 * const schema = {
 *   quantity: { id: '~>s~', label: 'Quantity', type: 'number' },
 *   unitPrice: { id: 'pdS}', label: 'Unit Price', type: 'number' },
 * }
 *
 * const result = restoreExpression(expression, databaseId, schema)
 * // 'prop("quantity") + prop("unitPrice")'
 */
export function restoreExpression(
  expression: string,
  dataSourceId: string,
  schema: Schema.Definition,
): string {

  // --- Build a lookup from URL-encoded property ID to schema key.
  const encodedIdToKey = new Map<string, string>()
  for (const [key, field] of Object.entries(schema)) {
    if (field.id) {
      const encodedId = encodeURIComponent(field.id)
      encodedIdToKey.set(encodedId, key)
    }
  }

  // --- Replace block property references with schema keys.
  return expression.replaceAll(BLOCK_PROPERTY_PATTERN, (
    match,
    encodedPropertyId: string,
    referenceDataSourceId: string,
  ) => {

    // --- If the reference is to a different database, keep the original reference.
    if (referenceDataSourceId !== dataSourceId) return match

    // --- Look up the schema key by its URL-encoded property ID.
    const schemaKey = encodedIdToKey.get(encodedPropertyId)
    if (!schemaKey) return match

    // --- Replace with prop("schemaKey") format.
    return `prop("${schemaKey}")`
  })
}
