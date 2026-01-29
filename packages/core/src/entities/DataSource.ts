import type { Adapter } from '@/adapter'
import type { Client, DataSourceObject, DataSourceQueryOptions, Schema } from '@/types'
import type { ConflictStrategy } from '@/utils'
import type { Block } from './Block'
import {
  applySchemaChanges,
  buildUpsertFilter,
  dehydrate,
  diffSchema,
  entityToParent,
  hydrate,
  inferSchema,
  toIconInput,
  toPropertiesDefinition,
  toRichText,
} from '@/utils'
import { Database } from './Database'
import { Page } from './Page'
import { User } from './User'

/**
 * Represents a data source in the underlying adapter system.
 * A data source is the actual table of data with a schema and rows,
 * living under a parent Database.
 *
 * @param adapter The adapter used to interact with the underlying system.
 * @param data The raw data of the data source from the adapter.
 * @param schema Optional schema definition for hydration/dehydration.
 */
export class DataSource<T extends Schema.Definition = Schema.Definition> {
  constructor(
    private readonly adapter: Adapter,
    private readonly object: DataSourceObject,
    private schema?: T,
  ) {}

  /**
   * Creates a new DataSource instance with the given schema.
   *
   * @param schema The schema definition to use.
   * @returns A new DataSource instance with the schema attached.
   */
  withSchema(schema: T): DataSource<T> {
    this.schema = schema
    return this as DataSource<T>
  }

  /**********************************************************/
  /* Inspection                                             */
  /**********************************************************/

  /**
   * Gets the ID of the data source.
   *
   * @returns The ID of the data source as a string.
   * @example dataSource.id // 'some-data-source-id'
   */
  get id() {
    return this.object.id
  }

  /**
   * Gets the plain text title of the data source.
   *
   * @returns The title of the data source as a string.
   * @example dataSource.title // 'My Data Source'
   */
  get title() {
    return this.object.title.map(t => t.plain_text).join('')
  }

  /**
   * Gets the properties (schema) of the data source.
   *
   * @returns The properties definition of the data source.
   * @example dataSource.properties // { Name: { type: 'title', ... }, ... }
   */
  get properties() {
    return this.object.properties
  }

  /**
   * Get the creation time of the data source as a Date object.
   *
   * @returns The creation time of the data source.
   * @example const createdTime = dataSource.createdAt // Date { ... }
   */
  get createdAt(): Date {
    return new Date(this.object.created_time)
  }

  /**
   * Get the last edited time of the data source as a Date object.
   *
   * @returns The last edited time of the data source.
   * @example const lastEdited = dataSource.lastEditedAt // Date { ... }
   */
  get lastEditedAt(): Date {
    return new Date(this.object.last_edited_time)
  }

  /**********************************************************/
  /* Resolution                                             */
  /**********************************************************/

  /**
   * Gets the parent database of the data source.
   *
   * @returns The parent database.
   * @example const parent = await dataSource.getParent() // Database { ... }
   */
  async getParent(): Promise<Database> {
    const database = await this.adapter.getDatabase(this.object.parent.database_id)
    return new Database(this.adapter, database)
  }

  /**
   * Gets the parent of the database of the data source.
   *
   * @returns The parent page or block of the database. Returns `undefined` if the parent is a workspace.
   * @example const grandParent = await dataSource.getDatabaseParent() // Page { ... } | Block { ... }
   */
  async getDatabaseParent(): Promise<Block | Page | undefined> {
    const database = await this.getParent()
    return database.getParent()
  }

  /**
   * Gets the `User` instance representing the creator of the data source.
   *
   * @returns A promise that resolves to the `User` who created the data source.
   * @example const creator = await dataSource.getCreator() // User { ... }
   */
  async getCreator(): Promise<User> {
    const user = await this.adapter.getUser(this.object.created_by.id)
    return new User(this.adapter, user)
  }

  /**
   * Gets the `User` instance representing the last editor of the data source.
   *
   * @returns A promise that resolves to the `User` who last edited the data source.
   * @example const editor = await dataSource.getLastEditor() // User { ... }
   */
  async getLastEditor(): Promise<User> {
    const user = await this.adapter.getUser(this.object.last_edited_by.id)
    return new User(this.adapter, user)
  }

  /**
   * Infer the `Schema.Definition` type from the properties of the data source.
   *
   * @returns The inferred schema definition.
   * @example const schema = dataSource.inferSchema() // { name: { label: 'Name', type: 'title' }, ... }
   */
  inferSchema(): Schema.Definition {
    return inferSchema(this.object.properties, this.object.id)
  }

  /**
   * Ensures the data source schema matches the provided schema definition.
   * Computes a diff between the remote schema and the provided schema, then
   * applies changes based on the conflict resolution strategy.
   *
   * **Conflict Strategies:**
   * - `strict`: Throws an error if remote has fields not in local schema
   * - `merge`: Keeps remote fields that don't conflict, adds/updates local fields (default)
   * - `overwrite`: Replaces remote schema entirely (deletes remote-only fields)
   *
   * @param schema The desired schema definition.
   * @param strategy The conflict resolution strategy (default: 'merge').
   * @returns A promise that resolves to the updated DataSource with the new schema attached.
   * @throws {SchemaConflictError} When strict mode encounters unrecognized fields.
   *
   * @example
   * // Sync schema, keeping any extra remote fields
   * const updated = await dataSource.ensureSchema(mySchema, 'merge')
   *
   * @example
   * // Strict mode: fail if remote has unknown fields
   * const updated = await dataSource.ensureSchema(mySchema, 'strict')
   *
   * @example
   * // Overwrite: remove any remote fields not in local schema
   * const updated = await dataSource.ensureSchema(mySchema, 'overwrite')
   */
  async ensureSchema(
    schema: T,
    strategy: ConflictStrategy = 'merge',
  ): Promise<DataSource<T>> {

    // --- Infer current remote schema.
    // --- Compute diff: what changed from remote to our desired schema.
    // --- If no changes, return early with schema attached.
    const remoteSchema = this.inferSchema()
    const diff = diffSchema(remoteSchema, schema)
    if (diff.length === 0) return new DataSource(this.adapter, this.object, schema)

    // --- Apply changes based on strategy and return a set of property updates.
    // --- If no property updates needed (e.g., all changes were ignored), return early.
    const properties = applySchemaChanges(schema, diff, strategy)
    if (Object.keys(properties).length === 0)
      return new DataSource(this.adapter, this.object, schema)

    // --- Update the data source with the computed changes.
    const object = await this.adapter.updateDataSource(this.id, { properties })
    return new DataSource(this.adapter, object, schema)
  }

  /**
   * Updates the data source with the given options.
   *
   * @param options The options to update the data source with.
   * @returns A promise that resolves to the updated data source.
   * @example await dataSource.update({ title: [...] })
   */
  async update(options: Client.DataSource.UpdateOptions): Promise<DataSource> {
    const object = await this.adapter.updateDataSource(this.id, {
      parent: entityToParent(options.parent),
      icon: toIconInput(options.icon),
      archived: options.isArchived,
      in_trash: options.isInTrash,
      properties: options.schema ? toPropertiesDefinition(options.schema) : undefined,
      title: toRichText(options.title),
    })
    return new DataSource(this.adapter, object, this.schema)
  }

  /**
   * Queries pages (rows) from this data source.
   *
   * @param options Query options including filter, sorts, and pagination.
   * @yields Page instances matching the query.
   * @example
   * for await (const page of dataSource.findPages()) {
   *   console.log(page.title)
   * }
   */
  async * findPages(options?: DataSourceQueryOptions): AsyncGenerator<Page> {
    for await (const page of this.adapter.queryDataSource(this.id, options))
      yield new Page(this.adapter, page)
  }

  /**
   * Find a single page matching the query options.
   *
   * @param options Query options including filter, sorts, and pagination.
   * @returns The first matching Page, or `undefined` if none found.
   * @example await dataSource.findOnePage({ ... }) // Page { ... } | undefined
   */
  async findOnePage(options?: DataSourceQueryOptions): Promise<Page | undefined> {
    for await (const page of this.findPages({ ...options, page_size: 1 }))
      return page
    return undefined
  }

  /**********************************************************/
  /* CRUD                                                   */
  /**********************************************************/

  /**
   * Queries pages and hydrates them into typed records.
   * Requires a schema to be set on the data source.
   *
   * @param options Query options including filter, sorts, and pagination.
   * @yields Hydrated records matching the query.
   * @example
   * for await (const record of dataSource.find()) {
   *   console.log(record) // { name: '...', description: '...', ... }
   * }
   */
  async * find(options?: DataSourceQueryOptions): AsyncGenerator<Schema.InferRecord<T>> {
    if (!this.schema)
      throw new Error('Cannot query records without a schema. Use queryPages() instead or set a schema.')
    for await (const page of this.findPages({ page_size: 4, ...options }))
      yield hydrate(this.schema, page.object.properties) as Schema.InferRecord<T>
  }

  /**
   * Find a single record matching the query options.
   * Requires a schema to be set on the data source.
   *
   * @param options Query options including filter, sorts, and pagination.
   * @returns The first matching record, or `undefined` if none found.
   * @example await dataSource.findOne({ ... }) // { name: '...', ... } | undefined
   */
  async findOne(options?: DataSourceQueryOptions): Promise<Schema.InferRecord<T> | undefined> {
    for await (const record of this.find({ ...options, page_size: 1 }))
      return record
    return undefined
  }

  /**
   * Upsert a record based on a unique property.
   * Requires a schema to be set on the data source.
   *
   * @param uniqueBy The property keys that uniquely identify a record.
   * @param data The record data to upsert.
   * @returns A promise that resolves to the upserted Page.
   * @throws {Error} If no schema is defined.
   * @example
   * const page = await dataSource.upsert(['name'], {
   *   name: 'My Record',
   *   description: 'Some description',
   * })
   */
  async upsert(
    uniqueBy: Array<keyof Schema.InferRecord<T>>,
    data: Schema.InferRecord<T>,
  ): Promise<Page> {
    if (!this.schema) throw new Error('Cannot upsert records without a schema.')

    // --- Build filter to find existing record based on schema types
    // --- and try to find existing record matching unique properties.
    const filter = buildUpsertFilter(this.schema, uniqueBy, data)
    const existing = await this.findOnePage({ filter })

    // --- Update existing record if it exists.
    if (existing) {
      const properties = dehydrate(this.schema, data as Record<string, unknown>)
      const page = await this.adapter.updatePage(existing.id, { properties })
      return new Page(this.adapter, page)
    }

    // --- Insert new record otherwise.
    return this.insert(data)
  }

  /**
   * Inserts a new record (page) in this data source.
   * Requires a schema to be set on the data source.
   *
   * @param data The record data to create.
   * @returns A promise that resolves to the created Page.
   * @throws {Error} If no schema is defined.
   * @example
   * const page = await dataSource.insert({
   *   name: 'My Record',
   *   description: 'Some description',
   * })
   */
  async insert(data: Schema.InferRecord<T>): Promise<Page> {
    if (!this.schema) throw new Error('Cannot create records without a schema.')
    const properties = dehydrate(this.schema, data as Record<string, unknown>)
    const page = await this.adapter.createPage({ parent: entityToParent(this), properties })
    return new Page(this.adapter, page)
  }
}
