import type { IconInput, IconObject } from './icon'
import type { ParentObject } from './parent'
import type { Property } from './property'
import type { RichText } from './text'
import type { UserReference } from './user'

/**
 * Represents a Data Source object from the Notion API (2025-09-03+).
 * A data source is the actual table with schema and rows, living under a Database.
 */
export interface DataSourceObject {
  object: 'data_source'
  id: string
  parent: ParentObject.Database
  database_parent: ParentObject
  properties: Record<string, Property.Definition>
  title: RichText[]
  description: RichText[]
  icon: IconObject | null
  archived: boolean
  in_trash: boolean
  created_time: string
  last_edited_time: string
  created_by: UserReference
  last_edited_by: UserReference
}

/**
 * Lightweight reference to a data source, as returned in `Database.data_sources`.
 */
export interface DataSourceReference {
  id: string
  name: string
}

/**********************************************************/
/* Create & Update Options Types                          */
/**********************************************************/

export interface DataSourceCreateOptions {
  parent: ParentObject.Database
  icon?: IconInput
  title?: RichText[]
  properties: Record<string, Property.DefinitionInput>
}

export interface DataSourceUpdateOptions {
  parent?: ParentObject.Database
  icon?: IconInput
  title?: RichText[]
  properties?: Record<string, null | Property.DefinitionInput>
  archived?: boolean
  in_trash?: boolean
}

/**********************************************************/
/* Query Options Types                                    */
/**********************************************************/

export namespace DataSourceQueryOptions {

  export namespace Filter {
    export interface Title {
      property: string
      title: {
        equals?: string
        does_not_equal?: string
        contains?: string
        does_not_contain?: string
        starts_with?: string
        ends_with?: string
        is_empty?: true
        is_not_empty?: true
      }
    }
    export interface RichText {
      property: string
      rich_text: {
        equals?: string
        does_not_equal?: string
        contains?: string
        does_not_contain?: string
        starts_with?: string
        ends_with?: string
        is_empty?: true
        is_not_empty?: true
      }
    }
    export interface NumberFilter {
      property: string
      number: {
        equals?: number
        does_not_equal?: number
        greater_than?: number
        less_than?: number
        greater_than_or_equal_to?: number
        less_than_or_equal_to?: number
        is_empty?: true
        is_not_empty?: true
      }
    }
    export interface Checkbox {
      property: string
      checkbox: {
        equals?: boolean
        does_not_equal?: boolean
      }
    }
    export interface Select {
      property: string
      select: {
        equals?: string
        does_not_equal?: string
        is_empty?: true
        is_not_empty?: true
      }
    }
    export interface MultiSelect {
      property: string
      multi_select: {
        contains?: string
        does_not_contain?: string
        is_empty?: true
        is_not_empty?: true
      }
    }
    export interface Status {
      property: string
      status: {
        equals?: string
        does_not_equal?: string
        is_empty?: true
        is_not_empty?: true
      }
    }
    export interface Date {
      property: string
      date: {
        equals?: string
        before?: string
        after?: string
        on_or_before?: string
        on_or_after?: string
        is_empty?: true
        is_not_empty?: true
        past_week?: object
        past_month?: object
        past_year?: object
        next_week?: object
        next_month?: object
        next_year?: object
      }
    }
    export interface People {
      property: string
      people: {
        contains?: string
        does_not_contain?: string
        is_empty?: true
        is_not_empty?: true
      }
    }
    export interface Files {
      property: string
      files: { is_empty?: true; is_not_empty?: true }
    }
    export interface Relation {
      property: string
      relation: {
        contains?: string
        does_not_contain?: string
        is_empty?: true
        is_not_empty?: true
      }
    }
    export interface Formula {
      property: string
      formula: {
        string?: RichText['rich_text']
        number?: NumberFilter['number']
        checkbox?: Checkbox['checkbox']
        date?: Date['date']
      }
    }
    export interface Rollup {
      property: string
      rollup: {
        any?: Filter
        every?: Filter
        none?: Filter
        number?: NumberFilter['number']
        date?: Date['date']
      }
    }
    export interface Timestamp {
      timestamp: 'created_time' | 'last_edited_time'
      created_time?: Date['date']
      last_edited_time?: Date['date']
    }
    export interface And {
      and: Filter[]
    }
    export interface Or {
      or: Filter[]
    }
  }

  export type Filter =
    | Filter.And
    | Filter.Checkbox
    | Filter.Date
    | Filter.Files
    | Filter.Formula
    | Filter.MultiSelect
    | Filter.NumberFilter
    | Filter.Or
    | Filter.People
    | Filter.Relation
    | Filter.RichText
    | Filter.Rollup
    | Filter.Select
    | Filter.Status
    | Filter.Timestamp
    | Filter.Title

  /**********************************************************/
  /* Sort and Pagination Types                              */
  /**********************************************************/

  export interface Sort {
    property?: string
    timestamp?: 'created_time' | 'last_edited_time'
    direction: 'ascending' | 'descending'
  }

  export interface PaginationOptions {
    start_cursor?: string
    page_size?: number
  }

  export interface Paginated<T> {
    object: 'list'
    results: T[]
    next_cursor: null | string
    has_more: boolean
  }
}

export interface DataSourceQueryOptions {
  filter?: DataSourceQueryOptions.Filter
  sorts?: DataSourceQueryOptions.Sort[]
  start_cursor?: string
  page_size?: number
}
