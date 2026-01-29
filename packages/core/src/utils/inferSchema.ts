import type { Property, Schema } from '@/types'
import type { Color } from '@/types'
import { toCamelCase } from '@unshared/string/toCamelCase'
import { restoreExpression } from './restoreExpression'

/**
 * Converts an array of Property.SelectOption to Schema.SelectOptions.
 *
 * @param options The select options from the API.
 * @returns The schema select options.
 */
function toSchemaSelectOptions(options: Property.SelectOption[]): Schema.SelectOptions {
  if (options.length === 0) return []
  const result: Record<string, Schema.SelectOptionObject> = {}
  for (const option of options) {
    const key = toCamelCase(option.name)
    result[key] = {
      id: decodeURIComponent(option.id),
      label: option.name,
      color: option.color as Color,
    }
  }
  return result
}

/**
 * Converts Property.Definition.Status data to Schema.StatusOptions.
 *
 * @param options The status options from the API.
 * @param groups The status groups from the API.
 * @returns The schema status options (grouped).
 */
function toSchemaStatusOptions(
  options: Property.StatusOption[],
  groups: Property.StatusGroup[],
): Schema.StatusOptions {
  const result: Schema.StatusOptions = {}

  // --- Build a map from option ID to option for quick lookup.
  const optionMap = new Map<string, Property.StatusOption>()
  for (const option of options)
    optionMap.set(option.id, option)

  // --- Convert each group.
  for (const group of groups) {
    const groupKey = toCamelCase(group.name)
    const groupOptions: Record<string, Schema.SelectOptionObject> = {}

    for (const optionId of group.option_ids) {
      const option = optionMap.get(optionId)
      if (!option) continue
      const optionKey = toCamelCase(option.name)
      groupOptions[optionKey] = {
        id: decodeURIComponent(option.id),
        label: option.name,
        color: option.color as Color,
      }
    }

    result[groupKey] = {
      id: decodeURIComponent(group.id),
      label: group.name,
      color: group.color as Color,
      options: groupOptions,
    }
  }

  return result
}

/**
 * Converts a single Property.Definition to a Schema.Field.
 *
 * @param definition The property definition from the API.
 * @returns The schema field.
 */
function toSchemaField(definition: Property.Definition): Schema.Field | undefined {
  const id = decodeURIComponent(definition.id)
  const label = definition.name

  // --- Simple types without additional data.
  if (definition.type === 'title')
    return { label, id, type: 'title' }
  if (definition.type === 'rich_text')
    return { label, id, type: 'rich_text' }
  if (definition.type === 'date')
    return { label, id, type: 'date' }
  if (definition.type === 'people')
    return { label, id, type: 'people' }
  if (definition.type === 'files')
    return { label, id, type: 'files' }
  if (definition.type === 'checkbox')
    return { label, id, type: 'checkbox' }
  if (definition.type === 'url')
    return { label, id, type: 'url' }
  if (definition.type === 'email')
    return { label, id, type: 'email' }
  if (definition.type === 'phone_number')
    return { label, id, type: 'phone_number' }
  if (definition.type === 'created_time')
    return { label, id, type: 'created_time' }
  if (definition.type === 'created_by')
    return { label, id, type: 'created_by' }
  if (definition.type === 'last_edited_time')
    return { label, id, type: 'last_edited_time' }
  if (definition.type === 'last_edited_by')
    return { label, id, type: 'last_edited_by' }

  // --- Types with additional data.
  if (definition.type === 'number')
    return { label, id, type: 'number', format: definition.number.format }
  if (definition.type === 'select')
    return { label, id, type: 'select', options: toSchemaSelectOptions(definition.select.options) }
  if (definition.type === 'multi_select')
    return { label, id, type: 'multi_select', options: toSchemaSelectOptions(definition.multi_select.options) }
  if (definition.type === 'status')
    return { label, id, type: 'status', groups: toSchemaStatusOptions(definition.status.options, definition.status.groups) }
  if (definition.type === 'formula')
    return { label, id, type: 'formula', expression: definition.formula.expression }
  if (definition.type === 'unique_id')
    return { label, id, type: 'unique_id', prefix: definition.unique_id.prefix ?? undefined }

  // --- Relation and Rollup types.
  if (definition.type === 'relation') {
    return definition.relation.type === 'dual_property'
      ? {
        id,
        label,
        type: 'relation',
        data_source_id: definition.relation.data_source_id,
        relation_type: 'dual_property',
        // @ts-expect-error: delegate missing to API.
        synced_property_id: definition.relation.dual_property?.synced_property_id,
        // @ts-expect-error: delegate missing to API.
        synced_property_name: definition.relation.dual_property?.synced_property_name,
      }
      : {
        id,
        label,
        type: 'relation',
        data_source_id: definition.relation.data_source_id,
        relation_type: 'single_property',
      }
  }

  /// --- Rollup type.
  if (definition.type === 'rollup') {
    return {
      id,
      label,
      type: 'rollup',
      relation_property: definition.rollup.relation_property_name,
      rollup_property: definition.rollup.rollup_property_name,
      function: definition.rollup.function,
    }
  }
}

/**
 * Infers a `Schema.Definition` from the properties of a data source.
 * This converts property definitions from the API into a user-friendly schema format.
 *
 * @param properties The property definitions from the data source.
 * @param dataSourceId Optional database ID to restore formula expressions with property references.
 * @returns A schema definition mapping camelCase keys to field definitions.
 * @example
 * const properties = {
 *   'Name': { id: '...', name: 'Name', type: 'title', title: {} },
 *   'Description': { id: '...', name: 'Description', type: 'rich_text', rich_text: {} },
 * }
 *
 * const schema = inferSchema(properties)
 * // {
 * //   name: { label: 'Name', type: 'title' },
 * //   description: { label: 'Description', type: 'rich_text' },
 * // }
 */
export function inferSchema(
  properties: Record<string, Property.Definition>,
  dataSourceId?: string,
): Schema.Definition {
  const result: Schema.Definition = {}

  // --- Convert each property definition to a schema field.
  for (const [, definition] of Object.entries(properties)) {
    const key = toCamelCase(definition.name)
    const field = toSchemaField(definition)
    if (field) result[key] = field
  }

  // --- Post-process formula fields to restore expressions with schema key references.
  if (dataSourceId) {
    for (const field of Object.values(result)) {
      if (field.type === 'formula' && field.expression)
        field.expression = restoreExpression(field.expression, dataSourceId, result)
    }
  }

  // --- Return the inferred schema definition.
  return result
}
