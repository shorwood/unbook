import type {
  Adapter,
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
} from '@unbook/core'
import { NotionError } from './error'

export namespace Notion {

  /** Options for configuring the Notion adapter. */
  export interface Options {
    token: string
    baseUrl?: string
    version?:
      | '2021-05-13'
      | '2022-06-28'
      | '2025-09-03'
  }
}

export class Notion implements Adapter {
  readonly name = '@unbook/notion'
  protected readonly token: string
  protected readonly baseUrl: string = 'https://api.notion.com'
  protected readonly version: string = '2025-09-03'

  constructor(options: Notion.Options) {
    this.token = options.token
    if (options.baseUrl) this.baseUrl = options.baseUrl
    if (options.version) this.version = options.version
  }

  private toNotionId(id: string): string {
    return id.replaceAll('-', '')
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Notion-Version': this.version,
        'Content-Type': 'application/json',
      },
      body: body
        ? JSON.stringify(body)
        : undefined,
    })

    if (!response.ok)
      throw await new NotionError().fromResponse(response)

    return response.json() as Promise<T>
  }

  /**********************************************************/
  /* Pages                                                  */
  /**********************************************************/

  getPage(id: string): Promise<PageObject> {
    return this.request('GET', `/v1/pages/${this.toNotionId(id)}`)
  }

  createPage(options: PageCreateOptions): Promise<PageObject> {
    return this.request('POST', '/v1/pages', options)
  }

  updatePage(id: string, options: PageUpdateOptions): Promise<PageObject> {
    return this.request('PATCH', `/v1/pages/${id}`, options)
  }

  async archivePage(id: string): Promise<void> {
    await this.request('PATCH', `/v1/pages/${id}`, { archived: true })
  }

  async restorePage(id: string): Promise<void> {
    await this.request('PATCH', `/v1/pages/${id}`, { archived: false })
  }

  /**********************************************************/
  /* Databases                                              */
  /**********************************************************/

  getDatabase(id: string): Promise<DatabaseObject> {
    return this.request('GET', `/v1/databases/${this.toNotionId(id)}`)
  }

  createDatabase(options: DatabaseCreateOptions): Promise<DatabaseObject> {
    return this.request('POST', '/v1/databases', options)
  }

  updateDatabase(id: string, options: DatabaseUpdateOptions): Promise<DatabaseObject> {
    return this.request('PATCH', `/v1/databases/${this.toNotionId(id)}`, options)
  }

  async deleteDatabase(id: string): Promise<void> {
    await this.request('PATCH', `/v1/databases/${this.toNotionId(id)}`, { archived: true })
  }

  restoreDatabase(id: string): Promise<DatabaseObject> {
    return this.request('PATCH', `/v1/databases/${this.toNotionId(id)}`, { archived: false })
  }

  /**********************************************************/
  /* Data Sources                                           */
  /**********************************************************/

  getDataSource(id: string): Promise<DataSourceObject> {
    return this.request('GET', `/v1/data_sources/${id}`)
  }

  createDataSource(options: DataSourceCreateOptions): Promise<DataSourceObject> {
    return this.request('POST', '/v1/data_sources', options)
  }

  async * queryDataSource(id: string, query?: DataSourceQueryOptions): AsyncIterable<PageObject> {
    let cursor: string | undefined = query?.start_cursor
    do {
      const body: Record<string, unknown> = { ...query }
      if (cursor) body.start_cursor = cursor
      const response = await this.request<{
        results: PageObject[]
        next_cursor: null | string
        has_more: boolean
      }>('POST', `/v1/data_sources/${id}/query`, body)
      for (const page of response.results) yield page
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined
    } while (cursor)
  }

  updateDataSource(id: string, options: DataSourceUpdateOptions): Promise<DataSourceObject> {
    return this.request('PATCH', `/v1/data_sources/${id}`, options)
  }

  async deleteDataSource(id: string): Promise<void> {
    await this.request('DELETE', `/v1/data_sources/${id}`)
  }

  restoreDataSource(id: string): Promise<DataSourceObject> {
    return this.request('PATCH', `/v1/data_sources/${id}`, { archived: false })
  }

  /**********************************************************/
  /* Blocks                                                 */
  /**********************************************************/

  getBlock(id: string): Promise<BlockObject> {
    return this.request('GET', `/v1/blocks/${id}`)
  }

  async * getBlockChildren(id: string): AsyncIterable<BlockObject> {
    let cursor: string | undefined
    do {
      const parameters = new URLSearchParams()
      if (cursor) parameters.set('start_cursor', cursor)
      const query = parameters.toString()
      const response = await this.request<{ results: BlockObject[]; has_more: boolean; next_cursor: null | string }>('GET', `/v1/blocks/${id}/children${query ? `?${query}` : ''}`)
      for (const block of response.results) yield block
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined
    } while (cursor)
  }

  async appendBlock(id: string, blocks: BlockInput[], options?: BlockAppendOptions): Promise<BlockObject[]> {
    const body: Record<string, unknown> = { children: blocks }
    if (options?.position?.type === 'after_block')
      body.after = options.position.after_block.id
    const response = await this.request<{ results: BlockObject[] }>('PATCH', `/v1/blocks/${id}/children`, body)
    return response.results
  }

  updateBlock(id: string, options: BlockUpdateOptions): Promise<BlockObject> {
    return this.request('PATCH', `/v1/blocks/${id}`, options)
  }

  async deleteBlock(id: string): Promise<void> {
    await this.request('DELETE', `/v1/blocks/${id}`)
  }

  /**********************************************************/
  /* Users                                                  */
  /**********************************************************/

  getUser(id: string): Promise<UserObject> {
    return this.request('GET', `/v1/users/${id}`)
  }

  getCurrentUser(): Promise<UserObject> {
    return this.request('GET', '/v1/users/me')
  }

  /**********************************************************/
  /* Search                                                 */
  /**********************************************************/

  async * search(query: string, options?: SearchOptions): AsyncIterable<DataSourceObject | PageObject> {
    let cursor: string | undefined = options?.start_cursor
    do {
      const body: Record<string, unknown> = { query }
      if (cursor) body.start_cursor = cursor
      if (options?.filter) body.filter = options.filter
      if (options?.page_size) body.page_size = options.page_size

      const response = await this.request<{
        results: Array<DataSourceObject | PageObject>
        next_cursor: null | string
        has_more: boolean
      }>('POST', '/v1/search', body)

      for (const result of response.results) yield result
      cursor = response.next_cursor ?? undefined
    }
    while (cursor)
  }
}
