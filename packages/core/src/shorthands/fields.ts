import type { NumberFormat, Schema } from '@/types'

/**
 * Defines a `title` field for a database block schema.
 *
 * @param label The name of the title field.
 * @returns A `Title` field definition object.
 * @example title('Task Name') // Returns: { type: 'title', name: 'Task Name' }
 */
export function title(label: string): Schema.Field.Title {
  return { type: 'title', label }
}

/**
 * Defines a `rich_text` field for a database block schema.
 *
 * @param label The name of the rich text field.
 * @returns A `RichText` field definition object.
 * @example text('Description') // Returns: { type: 'rich_text', name: 'Description' }
 */
export function text(label: string): Schema.Field.RichText {
  return { type: 'rich_text', label }
}

/**
 * Defines a `number` field for a database block schema.
 *
 * @param label The name of the number field.
 * @param format The number format (e.g., 'number', 'percent', 'dollar').
 * @returns A `Number` field definition object.
 * @example number('Price', 'dollar') // Returns: { type: 'number', name: 'Price', format: 'dollar' }
 */
export function number(label: string, format: NumberFormat = 'number'): Schema.Field.Number {
  return { type: 'number', label, format }
}

/**
 * Defines a `select` field for a database block schema.
 *
 * @param label The name of the select field.
 * @param options Array of option names or option objects with name and color.
 * @returns A `Select` field definition object.
 * @example select('Priority', ['Low', 'Medium', 'High'])
 * @example select('Status', [{ name: 'Active', color: 'green' }])
 */
export function select<T extends string = string>(
  label: string,
  options: Schema.SelectOptions<T>,
): Schema.Field.Select<T> {
  return { type: 'select', label, options }
}

/**
 * Defines a `multi_select` field for a database block schema.
 *
 * @param label The name of the multi-select field.
 * @param options Array of option names or option objects with name and color.
 * @returns A `MultiSelect` field definition object.
 * @example multiSelect('Tags', ['Frontend', 'Backend', 'DevOps'])
 * @example multiSelect('Labels', [{ name: 'Bug', color: 'red' }])
 */
export function multiSelect<T extends string = string>(
  label: string,
  options: Schema.SelectOptions<T>,
): Schema.Field.MultiSelect<T> {
  return { type: 'multi_select', label, options }
}

/**
 * Defines a `status` field for a database block schema.
 *
 * @param label The name of the status field.
 * @param options Object containing status options and groups.
 * @returns A `Status` field definition object.
 * @example
 * status('Progress', {
 *   done: {
 *     label: 'Done',
 *     color: 'green',
 *     options: {
 *       completed: { label: 'Completed', color: 'green' },
 *       verified: { label: 'Verified', color: 'blue' },
 *    },
 *    inProgress: {
 *      label: 'In Progress',
 *      color: 'yellow',
 *      options: ['Started', 'Halfway'],
 *    },
 *  })
 */
export function status<
  T extends string = string,
  U extends string = string,
>(
  label: string,
  options: Schema.StatusOptions<T, U>,
): Schema.Field.Status<T, U> {
  return { type: 'status', label, groups: options }
}

/**
 * Defines a `date` field for a database block schema.
 *
 * @param label The name of the date field.
 * @returns A `Date` field definition object.
 * @example date('Due Date') // Returns: { type: 'date', name: 'Due Date' }
 */
export function date(label: string): Schema.Field.Date {
  return { type: 'date', label }
}

/**
 * Defines a `people` field for a database block schema.
 *
 * @param label The display label for the people field.
 * @returns A `People` field definition object.
 * @example people('Assignee') // Returns: { type: 'people', name: 'Assignee' }
 */
export function people(label: string): Schema.Field.People {
  return { type: 'people', label }
}

/**
 * Defines a `files` field for a database block schema.
 *
 * @param label The name of the files field.
 * @returns A `Files` field definition object.
 * @example files('Attachments') // Returns: { type: 'files', name: 'Attachments' }
 */
export function files(label: string): Schema.Field.Files {
  return { type: 'files', label }
}

/**
 * Defines a `checkbox` field for a database block schema.
 *
 * @param label The name of the checkbox field.
 * @returns A `Checkbox` field definition object.
 * @example checkbox('Completed') // Returns: { type: 'checkbox', name: 'Completed' }
 * @example checkbox('Active', true) // Returns: { type: 'checkbox', name: 'Active', default: true }
 */
export function checkbox(label: string): Schema.Field.Checkbox {
  return { type: 'checkbox', label }
}

/**
 * Defines a `url` field for a database block schema.
 *
 * @param label The name of the URL field.
 * @returns A `Url` field definition object.
 * @example url('Website') // Returns: { type: 'url', name: 'Website' }
 */
export function url(label: string): Schema.Field.Url {
  return { type: 'url', label }
}

/**
 * Defines an `email` field for a database block schema.
 *
 * @param label The name of the email field.
 * @returns An `Email` field definition object.
 * @example email('Contact') // Returns: { type: 'email', name: 'Contact' }
 */
export function email(label: string): Schema.Field.Email {
  return { type: 'email', label }
}

/**
 * Defines a `phone_number` field for a database block schema.
 *
 * @param label The name of the phone number field.
 * @returns A `PhoneNumber` field definition object.
 * @example phone('Mobile') // Returns: { type: 'phone_number', name: 'Mobile' }
 */
export function phone(label: string): Schema.Field.PhoneNumber {
  return { type: 'phone_number', label }
}

/**
 * Defines a `formula` field for a database block schema.
 *
 * @param label The name of the formula field.
 * @param expression The formula expression.
 * @returns A `Formula` field definition object.
 * @example formula('Total', 'prop("Price") * prop("Quantity")')
 */
export function formula(label: string, expression: string): Schema.Field.Formula {
  return { type: 'formula', label, expression }
}

/**
 * Defines a `relation` field for a database block schema.
 *
 * @param label The name of the relation field.
 * @param dataSourceId The ID of the related data source.
 * @param single Whether to limit to a single relation (default: false).
 * @returns A `Relation` field definition object.
 * @example relation('Project', 'abc123') // Dual relation
 * @example relation('Parent', 'abc123', true) // Single relation
 */
export function relation(label: string, dataSourceId: string, single = false): Schema.Field.Relation {
  return {
    type: 'relation',
    label,
    data_source_id: dataSourceId,
    relation_type: single ? 'single_property' : 'dual_property',
  }
}

/**
 * Defines a `rollup` field for a database block schema.
 *
 * @param label The name of the rollup field.
 * @param options Object containing relation name, property name, and aggregation function.
 * @returns A `Rollup` field definition object.
 * @example rollup('Total Tasks', { relation: 'Tasks', property: 'Name', function: 'count' })
 */
export function rollup(label: string, options: Omit<Schema.Field.Rollup, 'label' | 'type'>): Schema.Field.Rollup {
  return { type: 'rollup', label, ...options }
}

/**
 * Defines a `created_time` field for a database block schema.
 *
 * @param label The name of the created time field.
 * @returns A `CreatedTime` field definition object.
 * @example createdTime('Created') // Returns: { type: 'created_time', name: 'Created' }
 */
export function createdTime(label: string): Schema.Field.CreatedTime {
  return { type: 'created_time', label }
}

/**
 * Defines a `created_by` field for a database block schema.
 *
 * @param label The name of the created by field.
 * @returns A `CreatedBy` field definition object.
 * @example createdBy('Author') // Returns: { type: 'created_by', name: 'Author' }
 */
export function createdBy(label: string): Schema.Field.CreatedBy {
  return { type: 'created_by', label }
}

/**
 * Defines a `last_edited_time` field for a database block schema.
 *
 * @param label The name of the last edited time field.
 * @returns A `LastEditedTime` field definition object.
 * @example lastEditedTime('Updated') // Returns: { type: 'last_edited_time', name: 'Updated' }
 */
export function lastEditedTime(label: string): Schema.Field.LastEditedTime {
  return { type: 'last_edited_time', label }
}

/**
 * Defines a `last_edited_by` field for a database block schema.
 *
 * @param label The name of the last edited by field.
 * @returns A `LastEditedBy` field definition object.
 * @example lastEditedBy('Editor') // Returns: { type: 'last_edited_by', name: 'Editor' }
 */
export function lastEditedBy(label: string): Schema.Field.LastEditedBy {
  return { type: 'last_edited_by', label }
}
