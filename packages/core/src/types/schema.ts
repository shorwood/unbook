import type { Pretty } from '@unshared/types'
import type { Color, NumberFormat, RollupFunction } from './common'

/**
 * Schema namespace provides simplified types for defining data source schemas
 * in a user-friendly way. These types are used to define the structure of a
 * data source and can be converted to/from the full Property.Definition types.
 */
export namespace Schema {

  /**********************************************************/
  /* Property Select / Status Option                        */
  /**********************************************************/

  /** Defines a select option with optional label and color. */
  export interface SelectOptionObject {
    id?: string
    label?: string
    color?: Color
  }

  /** Defines a set of select options. */
  export type SelectOptions<T extends string = string> =
    Record<T, SelectOptionObject | string> | T[]

  /** Defines a status group. */
  export interface StatusGroup<T extends string = string> {
    id?: string
    label: string
    color: Color
    options: SelectOptions<T>
  }

  /** Defines a set of status groups. */
  export type StatusOptions<
    T extends string = string,
    U extends string = string,
  > = Record<U, StatusGroup<T>>

  /**********************************************************/
  /* Property Field Definitions                             */
  /**********************************************************/

  export namespace Field {
    interface Base {
      label: string

      /**
       * In Notion, each property has a unique ID defined remotely. This ID is
       * not required for schema definitions, but is necessary when syncing with
       * an existing data source. By including the ID here, it allows for proper
       * updating of the property rather than creating a new one.
       *
       * @example
       * const field: Schema.Field = {
       *   label: 'Name',
       *   type: 'title',
       *   id: 'abcd' // Notion property ID
       * }
       */
      id?: string
    }
    export interface Title extends Base {
      type: 'title'
    }
    export interface RichText extends Base {
      type: 'rich_text'
    }
    export interface Number extends Base {
      type: 'number'
      format?: NumberFormat
    }
    export interface Select<
      T extends string = string,
    > extends Base {
      type: 'select'
      options?: SelectOptions<T>
    }
    export interface MultiSelect<
      T extends string = string,
    > extends Base {
      type: 'multi_select'
      options?: SelectOptions<T>
    }
    export interface Status<
      T extends string = string,
      U extends string = string,
    > extends Base {
      type: 'status'
      groups?: StatusOptions<T, U>
    }
    export interface Date extends Base {
      type: 'date'
    }
    export interface People extends Base {
      type: 'people'
    }
    export interface Files extends Base {
      type: 'files'
    }
    export interface Checkbox extends Base {
      type: 'checkbox'
    }
    export interface Url extends Base {
      type: 'url'
    }
    export interface Email extends Base {
      type: 'email'
    }
    export interface PhoneNumber extends Base {
      type: 'phone_number'
    }
    export interface Formula extends Base {
      type: 'formula'
      expression: string
    }
    export interface RelationSingle extends Base {
      type: 'relation'
      data_source_id: string
      relation_type?: 'single_property'
    }
    export interface RelationDual extends Base {
      type: 'relation'
      data_source_id: string
      relation_type: 'dual_property'
      synced_property_id: string
      synced_property_name: string
    }
    export interface Rollup extends Base {
      type: 'rollup'
      relation_property: string
      rollup_property: string
      function: RollupFunction
    }
    export interface CreatedTime extends Base {
      type: 'created_time'
    }
    export interface CreatedBy extends Base {
      type: 'created_by'
    }
    export interface LastEditedTime extends Base {
      type: 'last_edited_time'
    }
    export interface LastEditedBy extends Base {
      type: 'last_edited_by'
    }
    export interface UniqueId extends Base {
      type: 'unique_id'
      prefix?: string
    }
  }
  export type Field =
    | Field.Checkbox
    | Field.CreatedBy
    | Field.CreatedTime
    | Field.Date
    | Field.Email
    | Field.Files
    | Field.Formula
    | Field.LastEditedBy
    | Field.LastEditedTime
    | Field.MultiSelect
    | Field.Number
    | Field.People
    | Field.PhoneNumber
    | Field.RelationDual
    | Field.RelationSingle
    | Field.RichText
    | Field.Rollup
    | Field.Select
    | Field.Status
    | Field.Title
    | Field.UniqueId
    | Field.Url

  /**********************************************************/
  /* Schema Definition                                      */
  /**********************************************************/

  /**
   * A schema definition maps property keys to their field definitions.
   * The keys are used as internal identifiers, while `label` is the display name.
   *
   * @example
   * const schema: Schema.Definition = {
   *   name: { label: 'Name', type: 'title' },
   *   description: { label: 'Description', type: 'rich_text' },
   *   priority: { label: 'Priority', type: 'select', options: [...] },
   * }
   */
  export type Definition = Record<string, Field>

  /**********************************************************/
  /* Inference                                              */
  /**********************************************************/

  /**
   * Infers the value of a field definition.
   *
   * @example
   * const field: Schema.Field = { label: 'Name', type: 'title' }
   * type ValueType = Schema.InferValue<typeof field> // string
   */
  export type InferValue<T extends Field> =
    T extends Field.Title ? string :
      T extends Field.RichText ? string :
        T extends Field.Number ? number :
          T extends Field.Select<infer U> ? U :
            T extends Field.MultiSelect<infer U> ? U[] :
              T extends Field.Status<infer T> ? T :
                T extends Field.Date ? [Date, Date?] :
                  T extends Field.Checkbox ? boolean :
                    T extends Field.Url ? URL :
                      T extends Field.Email ? string :
                        T extends Field.PhoneNumber ? string :
                          T extends Field.Formula ? unknown :
                            T extends Field.RelationSingle ? string :
                              T extends Field.RelationDual ? string[] :
                                T extends Field.Files ? string[] :
                                  T extends Field.CreatedTime ? Date :
                                    T extends Field.CreatedBy ? string :
                                      T extends Field.LastEditedTime ? Date :
                                        T extends Field.LastEditedBy ? string :
                                          T extends Field.UniqueId ? string :
                                            unknown

  /**
   * Infers a record type from a schema definition.
   *
   * @example
   * const schema: Schema.Definition = {
   *   name: { label: 'Name', type: 'title' },
   *   description: { label: 'Description', type: 'rich_text' },
   *   priority: { label: 'Priority', type: 'select', options: [...] },
   * }
   * type RecordType = Schema.InferRecord<typeof schema>
   * // {
   * //   name?: string
   * //   description?: string
   * //   priority?: string
   * // }
   */
  export type InferRecord<T extends Definition> = Pretty<{
    -readonly [K in keyof T]?: InferValue<T[K]>
  }>

  /**********************************************************/
  /* Schema Diff Types                                      */
  /**********************************************************/

  export namespace Diff {
    export interface Added {
      type: 'added'
      key: string
      field: Field
    }
    export interface Removed {
      type: 'removed'
      key: string
      field: Field
    }
    export interface Modified {
      type: 'modified'
      key: string
      fromKey?: string
      id?: string
      from: Field
      to: Field
      changes: string[]
    }
  }

  /** Union of all possible diff types. */
  export type Diff =
    | Diff.Added
    | Diff.Modified
    | Diff.Removed
}
