import type { NumberFormat, RollupFunction, StatusColor } from './common'
import type { DateObject } from './date'
import type { FileObject } from './file'
import type { UserReference } from './user'

export namespace Property {

  export interface SelectOption {
    id: string
    name: string
    color: StatusColor
  }

  /** Select option input for API writes (only name is required). */
  export interface SelectOptionInput {
    name: string
  }

  export interface StatusOption {
    id: string
    name: string
    color: StatusColor
  }

  /** Status option input for API writes (only name is required). */
  export interface StatusOptionInput {
    name: string
  }

  export interface StatusGroup {
    id: string
    name: string
    color: StatusColor
    option_ids: string[]
  }

  /**********************************************************/
  /* Property Definitions                                   */
  /**********************************************************/

  export namespace Definition {
    interface Base {
      id: string
      name: string
    }
    export interface Title extends Base {
      type: 'title'
      title: object
    }
    export interface RichText extends Base {
      type: 'rich_text'
      rich_text: object
    }
    export interface Number extends Base {
      type: 'number'
      number: {
        format: NumberFormat
      }
    }
    export interface Select extends Base {
      type: 'select'
      select: {
        options: SelectOption[]
      }
    }
    export interface MultiSelect extends Base {
      type: 'multi_select'
      multi_select: {
        options: SelectOption[]
      }
    }
    export interface Status extends Base {
      type: 'status'
      status: {
        options: StatusOption[]
        groups: StatusGroup[]
      }
    }
    export interface Date extends Base {
      type: 'date'
      date: object
    }
    export interface People extends Base {
      type: 'people'
      people: object
    }
    export interface Files extends Base {
      type: 'files'
      files: object
    }
    export interface Checkbox extends Base {
      type: 'checkbox'
      checkbox: object
    }
    export interface Url extends Base {
      type: 'url'
      url: object
    }
    export interface Email extends Base {
      type: 'email'
      email: object
    }
    export interface PhoneNumber extends Base {
      type: 'phone_number'
      phone_number: object
    }
    export interface Formula extends Base {
      type: 'formula'
      formula: { expression: string }
    }
    export interface Relation extends Base {
      type: 'relation'
      relation: {
        data_source_id: string
        type: 'dual_property' | 'single_property'
        single_property?: object
        dual_property?: {
          synced_property_id: string
          synced_property_name: string
        }
      }
    }
    export interface Rollup extends Base {
      type: 'rollup'
      rollup: {
        relation_property_name: string
        relation_property_id: string
        rollup_property_name: string
        rollup_property_id: string
        function: RollupFunction
      }
    }
    export interface CreatedTime extends Base {
      type: 'created_time'
      created_time: object
    }
    export interface CreatedBy extends Base {
      type: 'created_by'
      created_by: object
    }
    export interface LastEditedTime extends Base {
      type: 'last_edited_time'
      last_edited_time: object
    }
    export interface LastEditedBy extends Base {
      type: 'last_edited_by'
      last_edited_by: object
    }
    export interface UniqueId extends Base {
      type: 'unique_id'
      unique_id: { prefix: null | string }
    }
  }
  export type Definition =
    | Definition.Checkbox
    | Definition.CreatedBy
    | Definition.CreatedTime
    | Definition.Date
    | Definition.Email
    | Definition.Files
    | Definition.Formula
    | Definition.LastEditedBy
    | Definition.LastEditedTime
    | Definition.MultiSelect
    | Definition.Number
    | Definition.People
    | Definition.PhoneNumber
    | Definition.Relation
    | Definition.RichText
    | Definition.Rollup
    | Definition.Select
    | Definition.Status
    | Definition.Title
    | Definition.UniqueId
    | Definition.Url

  /**********************************************************/
  /* Property Values                                        */
  /**********************************************************/

  export namespace Value {
    interface Base {
      id: string
    }
    export interface Title extends Base {
      type: 'title'
      title: Array<import('./text').RichText>
    }
    export interface RichText extends Base {
      type: 'rich_text'
      rich_text: Array<import('./text').RichText>
    }
    export interface Number extends Base {
      type: 'number'
      number: null | number
    }
    export interface Select extends Base {
      type: 'select'
      select: null | SelectOption
    }
    export interface MultiSelect extends Base {
      type: 'multi_select'
      multi_select: SelectOption[]
    }
    export interface Status extends Base {
      type: 'status'
      status: null | StatusOption
    }
    export interface Date extends Base {
      type: 'date'
      date: DateObject | null
    }
    export interface People extends Base {
      type: 'people'
      people: UserReference[]
    }
    export interface Files extends Base {
      type: 'files'
      files: FileObject[]
    }
    export interface Checkbox extends Base {
      type: 'checkbox'
      checkbox: boolean
    }
    export interface Url extends Base {
      type: 'url'
      url: null | string
    }
    export interface Email extends Base {
      type: 'email'
      email: null | string
    }
    export interface PhoneNumber extends Base {
      type: 'phone_number'
      phone_number: null | string
    }
    export interface Formula extends Base {
      type: 'formula'
      formula:
        | { type: 'boolean'; boolean: boolean | null }
        | { type: 'date'; date: DateObject | null }
        | { type: 'number'; number: null | number }
        | { type: 'string'; string: null | string }
    }
    export interface Relation extends Base {
      type: 'relation'
      relation: Array<{ id: string }>
      has_more: boolean
    }
    export namespace Rollup {
      export interface Array {
        type: 'array'
        array: Value[]
        function: RollupFunction
      }
      export interface Date {
        type: 'date'
        date: DateObject | null
        function: RollupFunction
      }
      export interface Number {
        type: 'number'
        number: null | number
        function: RollupFunction
      }
    }
    export interface Rollup extends Base {
      type: 'rollup'
      rollup:
        | Rollup.Array
        | Rollup.Date
        | Rollup.Number
    }
    export interface CreatedTime extends Base {
      type: 'created_time'
      created_time: string
    }
    export interface CreatedBy extends Base {
      type: 'created_by'
      created_by: UserReference
    }
    export interface LastEditedTime extends Base {
      type: 'last_edited_time'
      last_edited_time: string
    }
    export interface LastEditedBy extends Base {
      type: 'last_edited_by'
      last_edited_by: UserReference
    }
    export interface UniqueId extends Base {
      type: 'unique_id'
      unique_id: { prefix: null | string; number: number }
    }
  }
  export type Value =
    | Value.Checkbox
    | Value.CreatedBy
    | Value.CreatedTime
    | Value.Date
    | Value.Email
    | Value.Files
    | Value.Formula
    | Value.LastEditedBy
    | Value.LastEditedTime
    | Value.MultiSelect
    | Value.Number
    | Value.People
    | Value.PhoneNumber
    | Value.Relation
    | Value.RichText
    | Value.Rollup
    | Value.Select
    | Value.Status
    | Value.Title
    | Value.UniqueId
    | Value.Url

  /**********************************************************/
  /* Input Types (for API writes)                           */
  /**********************************************************/

  /**
   * Property definition input types for creating/updating data sources.
   * These don't include `id` and `name` since those are assigned by the API.
   */
  export type DefinitionInput<T extends Property.Definition = Property.Definition> =
    T extends infer U extends Property.Definition
      ? Omit<U, 'id' | 'name'> & { id?: string }
      : never

  /**
   * Value input types for API writes. These use simplified option types
   * that only require `name` for select/multi_select/status fields.
   */
  export namespace ValueInput {
    export interface Title {
      type: 'title'
      title: Array<import('./text').RichText>
    }
    export interface RichText {
      type: 'rich_text'
      rich_text: Array<import('./text').RichText>
    }
    export interface Number {
      type: 'number'
      number: null | number
    }
    export interface Select {
      type: 'select'
      select: null | SelectOptionInput
    }
    export interface MultiSelect {
      type: 'multi_select'
      multi_select: SelectOptionInput[]
    }
    export interface Status {
      type: 'status'
      status: null | StatusOptionInput
    }
    export interface Date {
      type: 'date'
      date: DateObject | null
    }
    export interface People {
      type: 'people'
      people: Array<{ object: 'user'; id: string }>
    }
    export interface Checkbox {
      type: 'checkbox'
      checkbox: boolean
    }
    export interface Url {
      type: 'url'
      url: null | string
    }
    export interface Email {
      type: 'email'
      email: null | string
    }
    export interface PhoneNumber {
      type: 'phone_number'
      phone_number: null | string
    }
    export interface Relation {
      type: 'relation'
      relation: Array<{ id: string }>
      has_more: boolean
    }
  }

  export type ValueInput =
    | ValueInput.Checkbox
    | ValueInput.Date
    | ValueInput.Email
    | ValueInput.MultiSelect
    | ValueInput.Number
    | ValueInput.People
    | ValueInput.PhoneNumber
    | ValueInput.Relation
    | ValueInput.RichText
    | ValueInput.Select
    | ValueInput.Status
    | ValueInput.Title
    | ValueInput.Url
}
