import type { Schema } from '@/types'

/** Types that can only appear once per schema (singleton types). */
const SINGLETON_TYPES = new Set(['title'])

/**
 * Compares two schema definitions and returns the differences between them.
 * The differences can include added, removed, or modified fields in the schema.
 *
 * Matching is performed in priority order:
 * 1. **By ID** - Fields with matching `id` properties are paired together
 * 2. **By key** - Fields with the same schema key are paired
 * 3. **By label** - Fields with the same label are paired
 * 4. **By singleton type** - For types like `title` that can only appear once
 *
 * @param from The original schema definition.
 * @param to The updated schema definition.
 * @returns An array of schema differences.
 * @example
 * // Define two schema definitions
 * const schemaA: Schema.Definition = {
 *   title: { label: 'Title', type: 'title' },
 *   description: { label: 'Description', type: 'rich_text' },
 *   priority: { label: 'Priority', type: 'select' },
 * }
 *
 * const schemaB: Schema.Definition = {
 *   title: { label: 'Title', type: 'title' },
 *   description: { label: 'Summary', type: 'rich_text' }, // Renamed label
 *   tags: { label: 'Tags', type: 'multi_select' }, // New field
 * }
 *
 * const differences = diffSchema(schemaA, schemaB)
 * // [
 * //   { type: 'modified', key: 'description', from: {...}, to: {...}, changes: ['label'] },
 * //   { type: 'added', key: 'tags', field: {...} },
 * //   { type: 'removed', key: 'priority', field: {...} }
 * // ]
 *
 * @example
 * // Key rename detection using id
 * const schemaA: Schema.Definition = {
 *   oldKey: { id: 'abc123', label: 'Field', type: 'title' },
 * }
 * const schemaB: Schema.Definition = {
 *   newKey: { id: 'abc123', label: 'Field', type: 'title' },
 * }
 *
 * const differences = diffSchema(schemaA, schemaB)
 * // [
 * //   { type: 'modified', key: 'newKey', fromKey: 'oldKey', id: 'abc123', changes: ['key'] }
 * // ]
 */
export function diffSchema(from: Schema.Definition, to: Schema.Definition): Schema.Diff[] {
  const diffs: Schema.Diff[] = []
  const processedFromKeys = new Set<string>()

  // --- Build lookup maps for efficient matching.
  const fromById = new Map<string, [string, Schema.Field]>()
  const fromByKey = new Map<string, Schema.Field>()
  const fromByLabel = new Map<string, [string, Schema.Field]>()
  const fromByType = new Map<string, [string, Schema.Field]>()

  for (const [key, field] of Object.entries(from)) {
    fromByKey.set(key, field)
    if (field.id) fromById.set(field.id, [key, field])
    fromByLabel.set(field.label, [key, field])
    if (SINGLETON_TYPES.has(field.type)) fromByType.set(field.type, [key, field])
  }

  /**
   * Attempts to find a matching field in `from` for the given `to` field.
   * Returns the matched [key, field] pair or undefined if no match found.
   *
   * @param toKey Temporal key of the `to` field.
   * @param toField The `to` field to match.
   * @returns The matched [key, field] from `from`, or undefined.
   */
  function findMatch(toKey: string, toField: Schema.Field): [string, Schema.Field] | undefined {

    // --- Priority 1: Match by ID.
    if (toField.id) {
      const match = fromById.get(toField.id)
      if (match && !processedFromKeys.has(match[0])) return match
    }

    // --- Priority 2: Match by key.
    const byKey = fromByKey.get(toKey)
    if (byKey && !processedFromKeys.has(toKey)) return [toKey, byKey]

    // --- Priority 3: Match by label.
    const byLabel = fromByLabel.get(toField.label)
    if (byLabel && !processedFromKeys.has(byLabel[0])) return byLabel

    // --- Priority 4: Match by singleton type (e.g., title).
    if (SINGLETON_TYPES.has(toField.type)) {
      const byType = fromByType.get(toField.type)
      if (byType && !processedFromKeys.has(byType[0])) return byType
    }

    return undefined
  }

  // --- Process each field in `to` schema.
  for (const [toKey, toField] of Object.entries(to)) {
    const match = findMatch(toKey, toField)
    if (!match) {
      diffs.push({ type: 'added', key: toKey, field: toField })
      continue
    }

    const [fromKey, fromField] = match
    processedFromKeys.add(fromKey)

    // --- Compute changes between matched fields.
    const changes: string[] = []
    if (fromKey !== toKey) changes.push('key')
    if (fromField.label !== toField.label) changes.push('label')
    if (fromField.type !== toField.type) changes.push('type')

    // --- Only emit a diff if there are actual changes.
    if (changes.length > 0) {
      const diff: Schema.Diff.Modified = { type: 'modified', key: toKey, from: fromField, to: toField, changes }
      if (fromField.id) diff.id = fromField.id
      if (fromKey !== toKey) diff.fromKey = fromKey
      diffs.push(diff)
    }
  }

  // --- Collect removed fields (in `from` but not matched).
  for (const [key, field] of Object.entries(from)) {
    if (!processedFromKeys.has(key))
      diffs.push({ type: 'removed', key, field })

  }

  // --- Return the list of diffs.
  return diffs
}
