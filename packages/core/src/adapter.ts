import type {
  BlockAppendOptions,
  BlockInput,
  BlockObject,
  BlockUpdateOptions,
  DatabaseCreateOptions,
  DatabaseObject,
  DatabaseUpdateOptions,
  DataSourceCreateOptions,
  DataSourceObject,
  DataSourceQueryOptions,
  DataSourceUpdateOptions,
  PageCreateOptions,
  PageObject,
  PageUpdateOptions,
  SearchOptions,
  UserObject,
} from './types'

/**
 * The adapter interface defines the methods required to interact with
 * different backends or services in a consistent manner. Adapters implementing
 * this interface can be used interchangeably within the application.
 *
 * @example
 * ```ts
 * import { defineAdapter } from '@unbook/core'
 *
 * // Define a custom adapter.
 * const myAdapter = defineAdapter({
 *   name: 'my-adapter',
 *   async getPage(id) {
 *     // Implementation here...
 *   },
 *   // Other methods...
 * })
 *
 * // Use the adapter behind the `Unbook` client.
 * const unbook = new Unbook({ adapter: myAdapter })
 * const page = await unbook.getPage('some-page-id')
 * page.update({ title: 'New Title' })
 * ```
 */
export interface Adapter {

  /**
   * The name of the adapter. Used for debugging purposes only.
   *
   * @example '@unbook/notion'
   */
  readonly name: string

  /**
   * Get a page by its ID.
   *
   * @param id The ID of the page to retrieve.
   * @returns A promise that resolves to the retrieved page.
   * @example await adapter.getPage('some-page-id') // PageObject { ... }
   */
  getPage(id: string): Promise<PageObject>

  /**
   * Create a new page.
   *
   * @param options The options for creating the page.
   * @returns A promise that resolves to the created page.
   * @example
   * await adapter.createPage({
   *   parent: { data_source_id: 'some-data-source-id' },
   *   properties: {
   *     Name: { title: [{ text: { content: 'New Page' } }] }
   *   }
   * })
   */
  createPage(options: PageCreateOptions): Promise<PageObject>

  /**
   * Update a page given its ID and update options.
   *
   * @param id The ID of the page to update.
   * @param options The update options for the page.
   * @returns A promise that resolves to the updated page.
   * @example
   * await adapter.updatePage('some-page-id', {
   *   properties: {
   *     Name: { title: [{ text: { content: 'Updated Page Title' } }] }
   *   }
   * })
   */
  updatePage(id: string, options: PageUpdateOptions): Promise<PageObject>

  /**
   * Archive a page given its ID.
   *
   * @param id The ID of the page to archive.
   * @returns A promise that resolves when the page is archived.
   * @example await adapter.archivePage('some-page-id')
   */
  archivePage(id: string): Promise<void>

  /**
   * Restore a page from archive given its ID.
   *
   * @param id The ID of the page to restore.
   * @returns A promise that resolves when the page is restored.
   * @example await adapter.restorePage('some-page-id')
   */
  restorePage(id: string): Promise<void>

  /**********************************************************/
  /* Databases                                              */
  /**********************************************************/

  getDatabase(id: string): Promise<DatabaseObject>
  createDatabase(options: DatabaseCreateOptions): Promise<DatabaseObject>
  updateDatabase(id: string, options: DatabaseUpdateOptions): Promise<DatabaseObject>
  deleteDatabase(id: string): Promise<void>
  restoreDatabase(id: string): Promise<DatabaseObject>

  /**********************************************************/
  /* Data Sources                                           */
  /**********************************************************/

  getDataSource(id: string): Promise<DataSourceObject>
  createDataSource(options: DataSourceCreateOptions): Promise<DataSourceObject>
  queryDataSource(id: string, query?: DataSourceQueryOptions): AsyncIterable<PageObject>
  updateDataSource(id: string, options: DataSourceUpdateOptions): Promise<DataSourceObject>
  deleteDataSource(id: string): Promise<void>
  restoreDataSource(id: string): Promise<DataSourceObject>

  /**********************************************************/
  /* Blocks                                                 */
  /**********************************************************/

  getBlock(id: string): Promise<BlockObject>
  getBlockChildren(id: string): AsyncIterable<BlockObject>
  appendBlock(id: string, blocks: BlockInput[], options?: BlockAppendOptions): Promise<BlockObject[]>
  updateBlock(id: string, options: BlockUpdateOptions): Promise<BlockObject>
  deleteBlock(id: string): Promise<void>

  /**********************************************************/
  /* Users                                                  */
  /**********************************************************/

  getUser(id: string): Promise<UserObject>
  // listUsers(options?: PaginationOptions): Promise<UserObject[]>
  getCurrentUser(): Promise<UserObject>

  /**********************************************************/
  /* Search                                                 */
  /**********************************************************/

  search(query: string, options?: SearchOptions): AsyncIterable<DataSourceObject | PageObject>
}

export function defineAdapter(adapter: Adapter): Adapter {
  return adapter
}
