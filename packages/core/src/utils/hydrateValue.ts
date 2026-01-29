/* eslint-disable sonarjs/cognitive-complexity */
import type { Property, Schema } from '@/types'
import { getFileObjectUrl } from './getFileObjectUrl'

/**
 * Builds a name → key lookup map from Schema.SelectOptions.
 *
 * @param options The select options from the schema field.
 * @returns A map of option names to their keys.
 */
function buildNameToKeyMap(options: Schema.SelectOptions | undefined): Map<string, string> {
  const map = new Map<string, string>()
  if (!options) return map

  if (Array.isArray(options)) {
    // Array format: ['Low', 'Medium', 'High'] - name is the key
    for (const name of options)
      map.set(name, name)
  }
  else {
    // Record format: { low: 'Low' | { label: 'Low' } }
    for (const [key, value] of Object.entries(options)) {
      const name = typeof value === 'string' ? value : (value.label ?? key)
      map.set(name, key)
    }
  }
  return map
}

/**
 * Builds a name → key lookup map from Schema.StatusOptions.
 *
 * @param groups The status groups from the schema field.
 * @returns A map of option names to their keys.
 */
function buildStatusNameToKeyMap(groups: Schema.StatusOptions | undefined): Map<string, string> {
  const map = new Map<string, string>()
  if (!groups) return map

  for (const group of Object.values(groups)) {
    const groupOptions = group.options
    if (Array.isArray(groupOptions)) {
      for (const name of groupOptions)
        map.set(name, name)
    }
    else {
      for (const [key, value] of Object.entries(groupOptions)) {
        const name = typeof value === 'string' ? value : (value.label ?? key)
        map.set(name, key)
      }
    }
  }
  return map
}

/**
 * Extracts raw value from a property without schema lookups.
 * Used for rollup array values where we don't have schema info.
 *
 * @param property The property value to extract from.
 * @returns The raw extracted value.
 */
function extractRawValue(property: Property.Value): unknown {
  if (property.type === 'title')
    return property.title.map(t => t.plain_text).join('')
  if (property.type === 'rich_text')
    return property.rich_text.map(t => t.plain_text).join('')
  if (property.type === 'number')
    return property.number
  if (property.type === 'select')
    return property.select?.name
  if (property.type === 'multi_select')
    return property.multi_select.map(option => option.name)
  if (property.type === 'status')
    return property.status?.name
  if (property.type === 'date')
    return property.date
  if (property.type === 'checkbox')
    return property.checkbox
  if (property.type === 'url')
    return property.url
  if (property.type === 'email')
    return property.email
  if (property.type === 'phone_number')
    return property.phone_number
  if (property.type === 'created_time')
    return property.created_time
  if (property.type === 'last_edited_time')
    return property.last_edited_time
  if (property.type === 'relation')
    return property.relation.map(r => r.id)
  if (property.type === 'people')
    return property.people.map(u => u.id)
  if (property.type === 'created_by')
    return property.created_by.id
  if (property.type === 'last_edited_by')
    return property.last_edited_by.id
  if (property.type === 'unique_id') {
    const { prefix, number } = property.unique_id
    return prefix ? `${prefix}-${number}` : String(number)
  }
  return undefined
}

/**
 * Extracts the value from a property value object.
 *
 * @param property The property value to extract from.
 * @param field The schema field for reverse lookups (name → key) on select/status fields.
 * @returns The extracted value.
 */
export function hydrateValue(property: Property.Value, field: Schema.Field): unknown {
  if (property.type === 'title')
    return property.title.map(t => t.plain_text).join('')
  if (property.type === 'rich_text')
    return property.rich_text.map(t => t.plain_text).join('')
  if (property.type === 'number')
    return property.number
  if (property.type === 'select') {
    const name = property.select?.name
    if (!name) return undefined
    if (field.type === 'select' && field.options) {
      const map = buildNameToKeyMap(field.options)
      return map.get(name) ?? name
    }
    return name
  }
  if (property.type === 'multi_select') {
    const names = property.multi_select.map(option => option.name)
    if (field.type === 'multi_select' && field.options) {
      const map = buildNameToKeyMap(field.options)
      return names.map(name => map.get(name) ?? name)
    }
    return names
  }
  if (property.type === 'status') {
    const name = property.status?.name
    if (!name) return undefined
    if (field.type === 'status' && field.groups) {
      const map = buildStatusNameToKeyMap(field.groups)
      return map.get(name) ?? name
    }
    return name
  }
  if (property.type === 'date')
    return property.date
  if (property.type === 'checkbox')
    return property.checkbox
  if (property.type === 'url')
    return property.url
  if (property.type === 'email')
    return property.email
  if (property.type === 'phone_number')
    return property.phone_number
  if (property.type === 'created_time')
    return property.created_time
  if (property.type === 'last_edited_time')
    return property.last_edited_time
  if (property.type === 'relation')
    return property.relation.map(r => r.id)
  if (property.type === 'people')
    return property.people.map(u => u.id)
  if (property.type === 'files')
    return property.files.map(file => getFileObjectUrl(file))
  if (property.type === 'formula') {
    const formula = property.formula
    if (formula.type === 'string') return formula.string
    if (formula.type === 'number') return formula.number
    if (formula.type === 'boolean') return formula.boolean
    if (formula.type === 'date') return formula.date
    return undefined
  }
  if (property.type === 'rollup') {
    const rollup = property.rollup
    if (rollup.type === 'number') return rollup.number
    if (rollup.type === 'date') return rollup.date
    if (rollup.type === 'array') return rollup.array.map(value => extractRawValue(value))
    return undefined
  }
  if (property.type === 'created_by')
    return property.created_by.id
  if (property.type === 'last_edited_by')
    return property.last_edited_by.id
  if (property.type === 'unique_id') {
    const { prefix, number } = property.unique_id
    return prefix ? `${prefix}-${number}` : String(number)
  }
  return undefined
}
