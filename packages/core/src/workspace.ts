import type { Adapter } from './adapter'
import type { BlockInput, Client, Schema } from './types'
import type { MaybeRichText } from './utils'
import { Database, DataSource, Page, User } from './entities'
import {
  entityToParent,
  toFileInput,
  toIconInput,
  toPropertiesDefinition,
  toRichText,
  toTitleProperties,
} from './utils'

export class Workspace {
  constructor(private adapter: Adapter) {}

  /**********************************************************/
  /* Pages                                                  */
  /**********************************************************/

  /**
   * Gets a page by its ID.
   *
   * @param id The ID of the page to retrieve.
   * @returns A promise that resolves to the retrieved page.
   * @example await workspace.getPage('some-page-id') // Page { ... }
   */
  async getPage(id: string): Promise<Page> {
    const page = await this.adapter.getPage(id)
    return new Page(this.adapter, page)
  }

  /**
   * Creates a new page with the given options.
   *
   * @param title The title of the page.
   * @param options The options for creating the page.
   * @param children The child blocks to include in the page.
   * @returns A promise that resolves to the created page.
   * @example
   * await unbook.createPage({
   *   parent: { database_id: 'some-database-id' },
   *   properties: {
   *     Name: { title: [{ text: { content: 'New Page' } }] }
   *   }
   * })
   */
  async createPage(
    title: MaybeRichText,
    options: Client.Page.CreateOptions = {},
    children: BlockInput[] = [],
  ): Promise<Page> {
    const page = await this.adapter.createPage({
      parent: entityToParent(options.parent),
      cover: toFileInput(options.cover),
      icon: toIconInput(options.icon),
      properties: toTitleProperties(title),
      children,
    })
    return new Page(this.adapter, page)
  }

  /**********************************************************/
  /* Databases                                              */
  /**********************************************************/

  /**
   * Gets a database by its ID.
   *
   * @param id The ID of the database to retrieve.
   * @returns A promise that resolves to the retrieved database.
   */
  async getDatabase(id: string): Promise<Database> {
    const database = await this.adapter.getDatabase(id)
    return new Database(this.adapter, database)
  }

  /**
   * Creates a new database with the given options.
   *
   * @param title The title of the database.
   * @param options The options for creating the database.
   * @returns A promise that resolves to the created database.
   */
  async createDatabase(
    title: MaybeRichText,
    options: Client.Database.CreateOptions,
  ): Promise<Database> {
    const database = await this.adapter.createDatabase({
      parent: entityToParent(options.parent),
      title: toRichText(title),
      description: toRichText(options.description),
      icon: toIconInput(options.icon),
      cover: toFileInput(options.cover),
      initial_data_source: options.schema ? { properties: toPropertiesDefinition(options.schema) } : undefined,
    })
    return new Database(this.adapter, database)
  }

  /**
   * Ensures a database with the given title exists and has the specified schema.
   *
   * If a data source with the given title is found, its schema is synchronized
   * using the provided conflict strategy. If not found, a new database is created
   * with the specified schema.
   *
   * **Conflict Strategies:**
   * - `strict`: Throws an error if remote has fields not in local schema
   * - `merge`: Keeps remote fields that don't conflict, adds/updates local fields (default)
   * - `overwrite`: Replaces remote schema entirely (deletes remote-only fields)
   *
   * @param title The title to search for or create the database with.
   * @param options The options including schema and conflict strategy.
   * @returns A promise that resolves to the DataSource with the schema attached.
   * @throws {SchemaConflictError} When strict mode encounters unrecognized fields.
   *
   * @example
   * // Create or sync a "Tasks" database
   * const tasks = await workspace.ensureDatabase('Tasks', {
   *   parent: parentPage,
   *   schema: {
   *     name: { label: 'Name', type: 'title' },
   *     status: { label: 'Status', type: 'select', options: ['Ongoing', 'Done'] },
   *   },
   *   conflictStrategy: 'merge',
   * })
   *
   * // Now you can query with typed records
   * for await (const task of tasks.query()) {
   *   console.log(task.name, task.status)
   * }
   */
  async ensureDatabase<T extends Schema.Definition>(
    title: string,
    options: Client.Database.EnsureOptions<T>,
  ): Promise<DataSource<T>> {
    const { schema, conflictStrategy = 'merge', ...createOptions } = options

    // --- Search for existing data source by title.
    for await (const result of this.search(title, { filter: 'data_source' })) {
      if (result.title === title)
        return result.ensureSchema(schema, conflictStrategy) as Promise<DataSource<T>>
    }

    // --- Not found, create new database (which creates data source as side effect).
    // --- Get the data source from the newly created database.
    const database = await this.createDatabase(title, { ...createOptions, schema })
    const dataSource = await database.getPrimaryDataSource()
    return dataSource.withSchema(schema) as DataSource<T>
  }

  /**********************************************************/
  /* Users                                                  */
  /**********************************************************/

  /**
   * Gets a user by their ID.
   *
   * @param id The ID of the user to retrieve.
   * @returns A promise that resolves to the retrieved user.
   */
  async getUser(id: string) {
    const userData = await this.adapter.getUser(id)
    return new User(this.adapter, userData)
  }

  /**
   * Gets the current authenticated user. This only works if the adapter
   * supports authentication and it's authenticated context has a user
   * associated with it.
   *
   * @returns A promise that resolves to the current user.
   */
  async getCurrentUser() {
    const userData = await this.adapter.getCurrentUser()
    return new User(this.adapter, userData)
  }

  /**********************************************************/
  /* Search                                                 */
  /**********************************************************/

  /**
   * Searches for data sources and pages matching the query.
   *
   * @param query The search query string.
   * @param options Optional search options.
   * @yields DataSources and Pages matching the search query.
   * @example
   * for await (const result of unbook.search('meeting notes')) {
   *   console.log(result.id)
   * }
   */
  search(query: string, options: Client.SearchOptions & { filter: 'page' }): AsyncIterable<Page>
  search(query: string, options: Client.SearchOptions & { filter: 'data_source' }): AsyncIterable<DataSource>
  search(query: string, options?: Client.SearchOptions): AsyncIterable<DataSource | Page>
  async * search(query: string, options?: Client.SearchOptions): AsyncIterable<DataSource | Page> {
    const results = this.adapter.search(query, {
      filter: options?.filter
        ? { property: 'object', value: options.filter }
        : undefined,
      sort: options?.sortBy
        ? { direction: options.sortBy, timestamp: 'last_edited_time' }
        : undefined,
    })
    for await (const result of results) {
      if (result.object === 'data_source')
        yield new DataSource(this.adapter, result)
      else if (result.object === 'page')
        yield new Page(this.adapter, result)
    }
  }
}
