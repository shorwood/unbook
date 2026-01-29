import type { Adapter } from '@/adapter'
import type { Client, DatabaseObject } from '@/types'
import { entityToParent, toFileInput, toIconInput, toPropertiesDefinition, toRichText } from '@/utils'
import { Block } from './Block'
import { DataSource } from './DataSource'
import { Page } from './Page'
import { User } from './User'

/**
 * Represents a Database in the underlying adapter system.
 * A database is a container for one or more data sources (tables).
 *
 * @param adapter The adapter used to interact with the underlying system.
 * @param object The raw data of the database from the adapter.
 */
export class Database {
  constructor(
    readonly adapter: Adapter,
    readonly object: DatabaseObject,
  ) {}

  /**********************************************************/
  /* Inspection                                             */
  /**********************************************************/

  /**
   * Gets the ID of the database.
   *
   * @returns The ID of the database as a string.
   * @example database.id // 'some-database-id'
   */
  get id() {
    return this.object.id
  }

  /**
   * Gets the title of the database.
   *
   * @returns The title as a plain text string.
   * @example database.title // 'My Database'
   */
  get title() {
    return this.object.title.map(t => t.plain_text).join('')
  }

  /**
   * Gets the description of the database.
   *
   * @returns The description as a plain text string.
   * @example database.description // 'This is my database'
   */
  get description() {
    return this.object.description.map(t => t.plain_text).join('')
  }

  /**
   * Gets the URL of the database.
   *
   * @returns The URL of the database.
   * @example database.url // 'https://notion.so/...'
   */
  get url() {
    return this.object.url
  }

  /**
   * Gets the public URL of the database.
   *
   * @returns The public URL of the database, or null if not published.
   * @example database.publicUrl // 'https://notion.so/...'
   */
  get publicUrl() {
    return this.object.public_url
  }

  /**
   * Gets the icon of the database.
   *
   * @returns The icon object or null.
   */
  get icon() {
    return this.object.icon
  }

  /**
   * Gets the cover of the database.
   *
   * @returns The cover file object or null.
   */
  get cover() {
    return this.object.cover
  }

  /**
   * Gets whether the database is archived.
   *
   * @returns True if archived, false otherwise.
   */
  get isArchived() {
    return this.object.archived
  }

  /**
   * Gets whether the database is in trash.
   *
   * @returns True if in trash, false otherwise.
   */
  get isInTrash() {
    return this.object.in_trash
  }

  /**
   * Gets whether the database is inline.
   *
   * @returns True if inline, false otherwise.
   */
  get isInline() {
    return this.object.is_inline
  }

  /**
   * Get the creation time of the database as a Date object.
   *
   * @returns The creation time of the database.
   * @example const createdTime = database.createdAt // Date { ... }
   */
  get createdAt(): Date {
    return new Date(this.object.created_time)
  }

  /**
   * Get the last edited time of the database as a Date object.
   *
   * @returns The last edited time of the database.
   * @example const lastEdited = database.lastEditedAt // Date { ... }
   */
  get lastEditedAt(): Date {
    return new Date(this.object.last_edited_time)
  }

  /**********************************************************/
  /* Resolution                                             */
  /**********************************************************/

  /**
   * Gets the parent of the database.
   *
   * @returns The parent page or block. Returns `undefined` if the parent is a workspace.
   * @example const parent = await database.getParent() // Page { ... } | Block { ... }
   */
  async getParent(): Promise<Block | Page | undefined> {
    if (this.object.parent.type === 'page_id') {
      const page = await this.adapter.getPage(this.object.parent.page_id)
      return new Page(this.adapter, page)
    }
    else if (this.object.parent.type === 'block_id') {
      const block = await this.adapter.getBlock(this.object.parent.block_id)
      return new Block(this.adapter, block)
    }
  }

  /**
   * Gets the `User` instance representing the creator of the database.
   *
   * @returns A promise that resolves to the `User` who created the database.
   * @example const creator = await database.getCreator() // User { ... }
   */
  async getCreator(): Promise<User> {
    const user = await this.adapter.getUser(this.object.created_by.id)
    return new User(this.adapter, user)
  }

  /**
   * Gets the `User` instance representing the last editor of the database.
   *
   * @returns A promise that resolves to the `User` who last edited the database.
   * @example const editor = await database.getLastEditor() // User { ... }
   */
  async getLastEditor(): Promise<User> {
    const user = await this.adapter.getUser(this.object.last_edited_by.id)
    return new User(this.adapter, user)
  }

  /**********************************************************/
  /* Data Source Management                                 */
  /**********************************************************/

  /**
   * Gets the list of data source references in this database.
   *
   * @returns An array of data source references.
   * @example database.dataSources // [{ id: '...', name: '...' }]
   */
  get dataSources() {
    return this.object.data_sources
  }

  /**
   * Gets a data source by its ID.
   *
   * @param id The ID of the data source to retrieve.
   * @returns A promise that resolves to the DataSource instance.
   * @example const dataSource = await database.getDataSource('some-id')
   */
  async getDataSource(id: string): Promise<DataSource> {
    const object = await this.adapter.getDataSource(id)
    return new DataSource(this.adapter, object)
  }

  /**
   * Gets the first (primary) data source of this database.
   *
   * @returns A promise that resolves to the primary DataSource instance.
   * @throws {Error} If the database has no data sources.
   * @example const dataSource = await database.getPrimaryDataSource()
   */
  async getPrimaryDataSource(): Promise<DataSource> {
    const first = this.object.data_sources[0]
    if (!first) throw new Error('Database has no data sources.')
    return this.getDataSource(first.id)
  }

  /**
   * Gets all data sources of this database.
   *
   * @yields DataSource instances for each data source in the database.
   * @example
   * for await (const dataSource of database.getDataSources()) {
   *   console.log(dataSource.title)
   * }
   */
  async * getDataSources(): AsyncGenerator<DataSource> {
    for (const ref of this.object.data_sources)
      yield this.getDataSource(ref.id)
  }

  /**
   * Creates a new data source in this database.
   *
   * @param options The options for creating the data source.
   * @returns A promise that resolves to the created DataSource.
   * @example
   * const dataSource = await database.createDataSource({
   *   title: 'New Table',
   *   schema: { name: 'title', description: 'rich_text' }
   * })
   */
  async createDataSource(options: Client.DataSource.CreateOptions): Promise<DataSource> {
    const object = await this.adapter.createDataSource({
      parent: entityToParent(this),
      icon: toIconInput(options.icon),
      title: toRichText(options.title),
      properties: options.schema ? toPropertiesDefinition(options.schema) : {},
    })
    return new DataSource(this.adapter, object)
  }

  /**********************************************************/
  /* Database Operations                                    */
  /**********************************************************/

  /**
   * Updates the database with the given options.
   *
   * @param options The options to update the database with.
   * @returns A promise that resolves to the updated Database.
   * @example await database.update({ title: 'New Title' })
   */
  async update(options: Client.Database.UpdateOptions): Promise<Database> {
    const object = await this.adapter.updateDatabase(this.id, {
      title: toRichText(options.title),
      description: toRichText(options.description),
      icon: toIconInput(options.icon),
      cover: toFileInput(options.cover),
      archived: options.isArchived,
      in_trash: options.isInTrash,
    })
    return new Database(this.adapter, object)
  }

  /**
   * Archives the database.
   *
   * @returns A promise that resolves when the database is archived.
   * @example await database.archive()
   */
  async archive(): Promise<void> {
    return await this.adapter.deleteDatabase(this.id)
  }

  /**
   * Restores the database from archive.
   *
   * @returns A promise that resolves when the database is restored.
   * @example await database.restore()
   */
  async restore(): Promise<Database> {
    return await this.update({ isArchived: false })
  }

  /**
   * Deletes the database permanently.
   *
   * @returns A promise that resolves when the database is deleted.
   * @example await database.delete()
   */
  async delete(): Promise<void> {
    await this.adapter.deleteDatabase(this.id)
  }
}
