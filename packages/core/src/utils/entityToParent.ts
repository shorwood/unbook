import type { ParentObject } from '@/types'
import { Block, Database, DataSource, Page } from '@/entities'

/** Union type of all supported entity types. */
type Entity =
  | Block
  | Database
  | DataSource
  | Page

/** Map an entity type to its corresponding ParentObject type. */
type EntityToParent<T extends Entity> =
  T extends Block ? ParentObject.Block :
    T extends DataSource ? ParentObject.DataSource :
      T extends Database ? ParentObject.Database :
        T extends Page ? ParentObject.Page :
          never

/**
 * Convert an entity to its corresponding ParentObject representation.
 *
 * @param entity The entity to convert (Block, DataSource, Database, or Page).
 * @returns The ParentObject representation of the entity.
 * @example
 *
 * // Convert a Block entity to ParentObject
 * const block = new Block(adapter, blockData)
 * const parentObject = entityToParent(block) // { type: 'block_id', block_id: '...' }
 *
 * // Convert a DataSource entity to ParentObject
 * const dataSource = new DataSource(adapter, dataSourceData)
 * const parentObject = entityToParent(dataSource) // { type: 'data_source_id', data_source_id: '...' }
 *
 * // Convert a Database entity to ParentObject
 * const database = new Database(adapter, databaseData)
 * const parentObject = entityToParent(database) // { type: 'database_id', database_id: '...' }
 *
 * // Convert a Page entity to ParentObject
 * const page = new Page(adapter, pageData)
 * const parentObject = entityToParent(page) // { type: 'page_id', page_id: '...' }
 */
export function entityToParent<T extends Entity>(entity: T): EntityToParent<T>
export function entityToParent<T extends Entity>(entity?: T): EntityToParent<T> | undefined
export function entityToParent<T extends Entity>(entity?: T): EntityToParent<T> | undefined {
  if (!entity) return
  else if (entity instanceof Block)
    return { type: 'block_id', block_id: entity.id } as EntityToParent<T>
  else if (entity instanceof DataSource)
    return { type: 'data_source_id', data_source_id: entity.id } as EntityToParent<T>
  else if (entity instanceof Database)
    return { type: 'database_id', database_id: entity.id } as EntityToParent<T>
  else if (entity instanceof Page)
    return { type: 'page_id', page_id: entity.id } as EntityToParent<T>
  throw new Error('Unsupported entity type')
}
