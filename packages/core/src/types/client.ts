import type * as Entities from '@/entities'
import type { ConflictStrategy, MaybeFileInput, MaybeIconInput, MaybeRichText } from '@/utils'
import type { Schema } from './schema'

/**
 * Types related to the Client class. These are simplified and adapted
 * versions of the underlying adapter options to provide a more ergonomic
 * interface for users of the Client.
 */
export namespace Client {
  export interface SearchOptions {
    filter?: 'data_source' | 'page'
    sortBy?: 'ascending' | 'descending'
  }

  export namespace Page {
    export interface CreateOptions {
      parent?: Entities.Block | Entities.DataSource | Entities.Page
      icon?: MaybeIconInput
      cover?: MaybeFileInput
    }

    export interface UpdateOptions {
      title?: MaybeRichText
      icon?: MaybeIconInput
      cover?: MaybeFileInput
      isLocked?: boolean
      eraseContent?: boolean
      isArchived?: boolean
      isInTrash?: boolean
    }
  }

  export namespace Database {
    export interface CreateOptions {
      parent: Entities.Block | Entities.Page
      title?: MaybeRichText
      description?: MaybeRichText
      icon?: MaybeIconInput
      cover?: MaybeFileInput
      schema?: Schema.Definition
      isInline?: boolean
    }

    export interface UpdateOptions {
      title?: MaybeRichText
      description?: MaybeRichText
      icon?: MaybeIconInput
      cover?: MaybeFileInput
      isArchived?: boolean
      isInTrash?: boolean
    }

    export interface EnsureOptions<T extends Schema.Definition>
      extends Omit<Client.Database.CreateOptions, 'schema'> {
      schema: T

      /**
       * Conflict resolution strategy when the remote schema differs from the local schema.
       *
       * - `merge` (default): Keeps remote fields that don't conflict, adds/updates local fields.
       * Use this when you want to preserve manually-added fields in Notion.
       *
       * - `overwrite`: Replaces remote schema entirely, deleting fields not in local schema.
       * Use this when you want the remote schema to exactly match your local definition.
       *
       * - `strict`: Throws an error if remote has fields not in local schema.
       * Use this when you want to detect unexpected schema drift.
       *
       * @default 'merge'
       */
      conflictStrategy?: ConflictStrategy
    }
  }

  export namespace DataSource {
    export interface CreateOptions {
      parent?: Entities.Database
      icon?: MaybeIconInput
      title?: MaybeRichText
      schema?: Schema.Definition
    }

    export interface UpdateOptions {
      parent?: Entities.Database
      icon?: MaybeIconInput
      title?: MaybeRichText
      schema?: Schema.Definition
      isArchived?: boolean
      isInTrash?: boolean
    }
  }
}
