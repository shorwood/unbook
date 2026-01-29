/* eslint-disable unicorn/no-null */
import type { Property, Schema } from '@/types'
import { toRichText } from './toRichText'

/**
 * Builds a key → name lookup map from Schema.SelectOptions.
 *
 * @param options The select options from the schema field.
 * @returns A map of option keys to their names (labels).
 */
function buildKeyToNameMap(options: Schema.SelectOptions | undefined): Map<string, string> {
  const map = new Map<string, string>()
  if (!options) return map

  // --- Handle array format: ['option1', 'option2']
  if (Array.isArray(options)) {
    for (const name of options)
      map.set(name, name)
  }

  // --- Handle record format: { key: 'label' | { label?, color? } }
  else {
    for (const [key, value] of Object.entries(options)) {
      const name = typeof value === 'string' ? value : (value.label ?? key)
      map.set(key, name)
    }
  }

  // --- Return the constructed map.
  return map
}

/**
 * Builds a key → name lookup map from Schema.StatusOptions.
 *
 * @param groups The status groups from the schema field.
 * @returns A map of option keys to their names (labels).
 */
function buildStatusKeyToNameMap(groups: Schema.StatusOptions | undefined): Map<string, string> {
  const map = new Map<string, string>()
  if (!groups) return map

  // --- Iterate over each group and its options.
  for (const group of Object.values(groups)) {
    const groupOptions = group.options
    if (Array.isArray(groupOptions)) {
      for (const name of groupOptions)
        map.set(name, name)
    }
    else {
      for (const [key, value] of Object.entries(groupOptions)) {
        const name = typeof value === 'string' ? value : (value.label ?? key)
        map.set(key, name)
      }
    }
  }

  // --- Return the constructed map.
  return map
}

/**
 * Creates a property value from a field definition and value.
 *
 * @param field The field definition.
 * @param value The value to convert (uses keys for select/multi_select/status).
 * @returns The property value, or undefined if the type is not supported.
 */
export function dehydrateValue(
  field: Schema.Field,
  value: unknown,
): Property.ValueInput | undefined {
  if (field.type === 'title')
    return { type: 'title', title: toRichText(value as string) }
  if (field.type === 'rich_text')
    return { type: 'rich_text', rich_text: toRichText(value as string) }
  if (field.type === 'number')
    return { type: 'number', number: value as null | number }
  if (field.type === 'select') {
    if (!value) return { type: 'select', select: null }
    const map = buildKeyToNameMap(field.options)
    const name = map.get(value as string) ?? value as string
    return { type: 'select', select: { name } }
  }
  if (field.type === 'multi_select') {
    const keys = value as string[]
    const map = buildKeyToNameMap(field.options)
    return {
      type: 'multi_select',
      multi_select: keys.map(key => ({ name: map.get(key) ?? key })),
    }
  }
  if (field.type === 'status') {
    if (!value) return { type: 'status', status: null }
    const map = buildStatusKeyToNameMap(field.groups)
    const name = map.get(value as string) ?? value as string
    return { type: 'status', status: { name } }
  }
  if (field.type === 'date')
    return { type: 'date', date: value as null | { end?: null | string; start: string } }
  if (field.type === 'checkbox')
    return { type: 'checkbox', checkbox: value as boolean }
  if (field.type === 'url')
    return { type: 'url', url: value as null | string }
  if (field.type === 'email')
    return { type: 'email', email: value as null | string }
  if (field.type === 'phone_number') {
    return {
      type: 'phone_number',
      phone_number: value as null | string,
    }
  }
  if (field.type === 'relation') {
    return {
      type: 'relation',
      relation: (value as string[]).map(id => ({ id })),
      has_more: false,
    }
  }
  if (field.type === 'people') {
    return {
      type: 'people',
      people: (value as string[]).map(id => ({ object: 'user' as const, id })),
    }
  }
}
