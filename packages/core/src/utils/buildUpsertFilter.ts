import type { DataSourceQueryOptions, Schema } from '@/types'

// --- Unsupported types for upsert matching.
const UNSUPPORTED_TYPES = [
  'multi_select',
  'date',
  'people',
  'files',
  'formula',
  'rollup',
  'created_time',
  'created_by',
  'last_edited_time',
  'last_edited_by',
] as const

/**
 * Safely converts a value to a string for filter matching.
 * Handles primitives, URLs, null, and undefined.
 *
 * @param value The value to convert.
 * @returns The string representation of the value.
 */
function toFilterString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (value instanceof URL) return value.href
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

/**
 * Builds a filter for upserting a record based on unique properties.
 * Maps each property to the correct filter type based on the schema field type.
 *
 * @param schema The schema definition.
 * @param uniqueProperties The property keys that uniquely identify a record.
 * @param data The record data to match against.
 * @returns A compound filter that matches records with the same unique property values.
 * @throws {Error} If a property type is not supported for upsert matching.
 *
 * @example
 * const filter = buildUpsertFilter(schema, ['email'], { email: 'test@example.com', name: 'Test' })
 * // { and: [{ property: 'Email', rich_text: { equals: 'test@example.com' } }] }
 */
export function buildUpsertFilter<T extends Schema.Definition>(
  schema: T,
  uniqueProperties: Array<keyof Schema.InferRecord<T>>,
  data: Schema.InferRecord<T>,
): DataSourceQueryOptions.Filter {
  const filters: DataSourceQueryOptions.Filter[] = uniqueProperties.map((key) => {
    const field = schema[key as string]
    if (!field) throw new Error(`Property "${String(key)}" not found in schema.`)

    const value = (data as Record<string, unknown>)[key as string]
    const propertyName = field.label
    const { type } = field

    // --- Title property filter.
    if (type === 'title') {
      return {
        property: propertyName,
        title: { equals: toFilterString(value) },
      } satisfies DataSourceQueryOptions.Filter.Title
    }

    // --- Text-based properties filter.
    if (type === 'rich_text' || type === 'email' || type === 'phone_number' || type === 'url') {
      return {
        property: propertyName,
        rich_text: { equals: toFilterString(value) },
      } satisfies DataSourceQueryOptions.Filter.RichText
    }

    // --- Number property filter.
    if (type === 'number') {
      return {
        property: propertyName,
        number: { equals: typeof value === 'number' ? value : Number(value) },
      } satisfies DataSourceQueryOptions.Filter.NumberFilter
    }

    // --- Checkbox property filter.
    if (type === 'checkbox') {
      return {
        property: propertyName,
        checkbox: { equals: Boolean(value) },
      } satisfies DataSourceQueryOptions.Filter.Checkbox
    }

    // --- Select property filter.
    if (type === 'select') {
      return {
        property: propertyName,
        select: { equals: toFilterString(value) },
      } satisfies DataSourceQueryOptions.Filter.Select
    }

    // --- Status property filter.
    if (type === 'status') {
      return {
        property: propertyName,
        status: { equals: toFilterString(value) },
      } satisfies DataSourceQueryOptions.Filter.Status
    }

    // --- Unique ID property filter (typically a number with optional prefix).
    if (type === 'unique_id') {
      return {
        property: propertyName,
        number: { equals: typeof value === 'number' ? value : Number(value) },
      } satisfies DataSourceQueryOptions.Filter.NumberFilter
    }

    // --- Relation property filter.
    if (type === 'relation') {
      return {
        property: propertyName,
        relation: { contains: toFilterString(value) },
      } satisfies DataSourceQueryOptions.Filter.Relation
    }

    if (UNSUPPORTED_TYPES.includes(type)) {
      throw new Error(
        `Property type "${type}" is not supported for upsert matching. `
        + 'Use a property with type: title, rich_text, number, checkbox, select, status, email, url, phone_number, or unique_id.',
      )
    }

    // --- Unknown property type.
    throw new Error(`Unknown property type "${type}" for property "${String(key)}".`)
  })

  // --- Return compound filter if multiple properties, or single filter.
  return filters.length === 1 ? filters[0] : { and: filters }
}
