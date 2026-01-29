import type { Schema } from '@/types'

/**
 * Pattern to match prop("key") references in formula expressions.
 */
const PROP_PATTERN = /prop\("([^"]+)"\)/g

/**
 * Builds a Notion-compatible formula expression by replacing schema key references
 * with their corresponding labels. This is used when converting Schema.Field to
 * Property.Definition for sending to the Notion API.
 *
 * @param expression The formula expression with schema key references (e.g., `prop("name")`).
 * @param schema The schema definition mapping keys to field definitions.
 * @returns The expression with labels instead of schema keys.
 * @example
 * const expression = 'prop("quantity") * prop("unitPrice")'
 * const schema = {
 *   quantity: { label: 'Quantity', type: 'number' },
 *   unitPrice: { label: 'Unit Price', type: 'number' },
 * }
 *
 * const result = buildExpression(expression, schema)
 * // 'prop("Quantity") * prop("Unit Price")'
 */
export function buildExpression(
  expression: string,
  schema: Schema.Definition,
): string {
  return expression.replaceAll(PROP_PATTERN, (match, key: string) => {

    // --- Look up the field by its schema key.
    const field = schema[key]
    if (!field) return match

    // --- Replace with prop("label") format.
    return `prop("${field.label}")`
  })
}
