/* eslint-disable unicorn/no-null */
import type { Property, Schema } from '@/types'
import type { StatusColor } from '@/types/common'

/**
 * Converts Schema.SelectOptions to an array of Property.SelectOption.
 *
 * @param selectOptions The select options from the schema field.
 * @returns An array of select options for the API.
 */
function toSelectOptions(selectOptions: Schema.SelectOptions | undefined): Property.SelectOption[] {
  if (!selectOptions) return []

  // --- Handle array format: ['option1', 'option2']
  if (Array.isArray(selectOptions))
    return selectOptions.map(name => ({ id: '', name, color: 'default' as StatusColor }))

  // --- Handle record format: { key: 'label' | { label?, color? } }
  return Object.entries(selectOptions).map(([key, value]) => {
    if (typeof value === 'string')
      return { id: '', name: value, color: 'default' as StatusColor }

    return {
      id: '',
      name: value.label ?? key,
      color: (value.color ?? 'default') as StatusColor,
    }
  })
}

/**
 * Converts a single Schema.Field to a property definition.
 *
 * @param field The field to convert.
 * @returns The property definition.
 */
export function toPropertyDefinition(field: Schema.Field): Property.DefinitionInput {
  const id = field.id ?? undefined

  // --- Simple types, no extra options.
  if (field.type === 'title')
    return { type: 'title', id, title: {} }
  if (field.type === 'rich_text')
    return { type: 'rich_text', id, rich_text: {} }
  if (field.type === 'date')
    return { type: 'date', id, date: {} }
  if (field.type === 'people')
    return { type: 'people', id, people: {} }
  if (field.type === 'files')
    return { type: 'files', id, files: {} }
  if (field.type === 'checkbox')
    return { type: 'checkbox', id, checkbox: {} }
  if (field.type === 'url')
    return { type: 'url', id, url: {} }
  if (field.type === 'email')
    return { type: 'email', id, email: {} }
  if (field.type === 'phone_number')
    return { type: 'phone_number', id, phone_number: {} }
  if (field.type === 'created_time')
    return { type: 'created_time', id, created_time: {} }
  if (field.type === 'created_by')
    return { type: 'created_by', id, created_by: {} }
  if (field.type === 'last_edited_time')
    return { type: 'last_edited_time', id, last_edited_time: {} }
  if (field.type === 'last_edited_by')
    return { type: 'last_edited_by', id, last_edited_by: {} }

  // --- Select and Multi-Select have their options as a record or array.
  // --- We must extract their labels and convert to the API format.
  if (field.type === 'select')
    return { type: 'select', id, select: { options: toSelectOptions(field.options) } }
  if (field.type === 'multi_select')
    return { type: 'multi_select', id, multi_select: { options: toSelectOptions(field.options) } }

  // --- Status properties are read-only in Notion API - you cannot set
  // --- options or groups when creating/updating. Just return an empty object.
  if (field.type === 'status')
    // @ts-expect-error: ignore
    return { type: 'status', id, status: {} }

  // --- The rest of the types have extra parameters that are mapped 1:1.
  if (field.type === 'formula')
    return { type: 'formula', id, formula: { expression: field.expression } }
  if (field.type === 'number')
    return { type: 'number', id, number: { format: field.format ?? 'number' } }
  if (field.type === 'unique_id')
    return { type: 'unique_id', id, unique_id: { prefix: field.prefix ?? null } }
  if (field.type === 'relation') {
    return {
      id,
      type: 'relation',
      relation: field.relation_type === 'dual_property'
        ? {
          data_source_id: field.data_source_id,
          type: 'dual_property',
          dual_property: {
            synced_property_id: field.synced_property_id,
            synced_property_name: field.synced_property_name,
          },
        }
        : {
          data_source_id: field.data_source_id,
          type: 'single_property',
          single_property: {},
        },
    }
  }
  if (field.type === 'rollup') {
    return {
      type: 'rollup',
      id,
      rollup: {
        relation_property_name: field.relation_property,
        relation_property_id: '',
        rollup_property_name: field.rollup_property,
        rollup_property_id: '',
        function: field.function,
      },
    }
  }

  // --- If we reach here, the field type is unsupported.
  // @ts-expect-error: ignore
  throw new Error(`Unsupported field type: ${field.type}`)
}
