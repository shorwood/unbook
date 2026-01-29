import type { DataSourceReference } from './dataSource'
import type { FileInput, FileObject } from './file'
import type { IconInput, IconObject } from './icon'
import type { ParentObject } from './parent'
import type { Property } from './property'
import type { RichText } from './text'
import type { UserReference } from './user'

/**
 * Represents a Database object from the Notion API (2025-09-03+).
 * A database is a container for one or more data sources (tables).
 */
export interface DatabaseObject {
  object: 'database'
  id: string
  url: string
  public_url: null | string
  title: RichText[]
  description: RichText[]
  data_sources: DataSourceReference[]
  parent: ParentObject
  icon: IconObject | null
  cover: FileObject | null
  archived: boolean
  in_trash: boolean
  is_inline: boolean
  created_time: string
  last_edited_time: string
  created_by: UserReference
  last_edited_by: UserReference
}

/**
 * Options for creating a database with an initial data source.
 * This creates a container database and returns its first data source.
 */
export interface CreateDatabaseOptions {
  parent:
    | ParentObject.Block
    | ParentObject.Page
  title?: RichText[]
  description?: RichText[]
  icon?: IconObject | null
  cover?: FileObject | null
  is_inline?: boolean
  initial_data_source?: {
    properties: Record<string, Property.DefinitionInput>
  }
}

/**********************************************************/
/* Create & Update Options Types                          */
/**********************************************************/

/**
 * Options for creating a database via the adapter.
 */
export interface DatabaseCreateOptions {
  parent: ParentObject.Block | ParentObject.Page
  title?: RichText[]
  description?: RichText[]
  icon?: IconInput
  cover?: FileInput
  is_inline?: boolean
  initial_data_source?: {
    properties: Record<string, Property.DefinitionInput>
  }
}

/**
 * Options for updating a database via the adapter.
 */
export interface DatabaseUpdateOptions {
  title?: RichText[]
  description?: RichText[]
  icon?: IconInput
  cover?: FileInput
  archived?: boolean
  in_trash?: boolean
}
