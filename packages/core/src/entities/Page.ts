import type { Adapter } from '@/adapter'
import type { BlockAppendOptions, BlockInput, Client, PageObject } from '@/types'
import { renderPageTitle, toFileInput, toIconInput, toTitleProperties } from '@/utils'
import { Block } from './Block'
import { DataSource } from './DataSource'
import { User } from './User'

/**
 * Represents a page in the underlying adapter system.
 *
 * @param adapter The adapter used to interact with the underlying system.
 * @param data The raw data of the page from the adapter.
 */
export class Page {
  constructor(
    private adapter: Adapter,
    public object: PageObject,
  ) {}

  /**********************************************************/
  /* Inspection                                             */
  /**********************************************************/

  /**
   * Gets the ID of the page.
   *
   * @returns The ID of the page as a string.
   * @example page.id // 'some-page-id'
   */
  get id() {
    return this.object.id
  }

  /**
   * Get the plain text title of the page by extracting text from its title property.
   * If no title property is found, it returns the page ID as a fallback.
   *
   * @returns The title of the page as a string.
   */
  get title(): string {
    for (const property of Object.values(this.object.properties)) {
      if (property.type === 'title')
        return property.title.map(t => t.plain_text).join('')
    }
    return this.object.id
  }

  /**
   * Gets the URL of the page.
   *
   * @returns The URL of the page.
   * @example page.url // 'https://notion.so/...'
   */
  get url(): string {
    return this.object.url
  }

  /**
   * Get the creation time of the page as a Date object.
   *
   * @returns The creation time of the page.
   * @example const createdTime = page.getCreatedTime() // Date { ... }
   */
  get createdAt(): Date {
    return new Date(this.object.created_time)
  }

  /**
   * Get the last edited time of the page as a Date object.
   *
   * @returns The last edited time of the page.
   * @example const lastEdited = page.getLastEditedTime() // Date { ... }
   */
  get lastEditedAt(): Date {
    return new Date(this.object.last_edited_time)
  }

  /**********************************************************/
  /* Resolution                                             */
  /**********************************************************/

  /**
   * Gets the title of the page by extracting text from its title property.
   * If no title property is found, it returns the page ID as a fallback.
   *
   * @returns The title of the page as a string.
   * @example await page.getTitle() // 'My Page Title'
   */
  async getTitle(): Promise<string | undefined> {
    return await renderPageTitle(this.object, {
      resolveUser: (id: string) => this.adapter.getUser(id),
      resolvePage: (id: string) => this.adapter.getPage(id),
    })
  }

  /**
   * Gets the parent of the page.
   *
   * @returns The parent page, block, or data source. Returns `undefined` if the parent is a workspace.
   * @example const parent = await page.getParent() // Page { ... } | Block { ... } | DataSource { ... }
   */
  async getParent(): Promise<Block | DataSource | Page | undefined> {
    if (this.object.parent.type === 'page_id') {
      const page = await this.adapter.getPage(this.object.parent.page_id)
      return new Page(this.adapter, page)
    }
    else if (this.object.parent.type === 'block_id') {
      const block = await this.adapter.getBlock(this.object.parent.block_id)
      return new Block(this.adapter, block)
    }
    else if (this.object.parent.type === 'data_source_id') {
      const dataSource = await this.adapter.getDataSource(this.object.parent.data_source_id)
      return new DataSource(this.adapter, dataSource)
    }
  }

  /**
   * Gets the children blocks of the page.
   *
   * @yields The child blocks of the page as an async iterable.
   * @example for await (const block of page.getChildren()) { ... }
   */
  async * getChildren() {
    for await (const block of this.adapter.getBlockChildren(this.id))
      yield new Block(this.adapter, block)
  }

  /**
   * Gets the `User` instance representing the creator of the page.
   *
   * @returns A promise that resolves to the `User` who created the page.
   * @example const creator = await page.getCreator() // User { ... }
   */
  async getCreator(): Promise<User> {
    const user = await this.adapter.getUser(this.object.created_by.id)
    return new User(this.adapter, user)
  }

  /**
   * Gets the `User` instance representing the last editor of the page.
   *
   * @returns A promise that resolves to the `User` who last edited the page.
   * @example const editor = await page.getLastEditor() // User { ... }
   */
  async getLastEditor(): Promise<User> {
    const user = await this.adapter.getUser(this.object.last_edited_by.id)
    return new User(this.adapter, user)
  }

  /**********************************************************/
  /* Rendering                                              */
  /**********************************************************/

  /**
   * Get the content of the page as Markdown.
   *
   * @returns A promise that resolves to the Markdown content of the page.
   * @example await page.render() // '# My Page Title\n\n...'
   */
  async render(): Promise<string> {
    let markdown = ''
    let isFirst = true

    // --- Collect all child blocks and convert to markdown.
    for await (const block of this.getChildren()) {

      // --- Ensure proper spacing before headings.
      if (!isFirst && block.object.type.startsWith('heading_'))
        markdown += '\n'

      // --- Append block markdown.
      markdown += await block.render()
      markdown += '\n'
      isFirst = false
    }

    // --- Return trimmed markdown.
    return markdown.trim()
  }

  /**********************************************************/
  /* CRUD                                                   */
  /**********************************************************/

  /**
   * Updates the page with the given options.
   *
   * @param options The update options.
   * @returns A promise that resolves to the updated Page instance.
   * @example await page.update({ title: 'New Title' }) // Page { ... }
   */
  async update(options: Client.Page.UpdateOptions): Promise<Page> {
    const page = await this.adapter.updatePage(this.id, {
      icon: toIconInput(options.icon),
      cover: toFileInput(options.cover),
      is_locked: options.isLocked,
      archived: options.isArchived,
      in_trash: options.isInTrash,
      erase_content: options.eraseContent,
      properties: toTitleProperties(options.title),
    })
    return new Page(this.adapter, page)
  }

  /**
   * Appends blocks to the end of the page.
   *
   * @param blocks The blocks to append to the page.
   * @param options Options for appending blocks.
   * @returns A promise that resolves to an array of the appended blocks.
   * @example await page.appendBlocks(block1, block2) // [ Block { ... }, Block { ... } ]
   */
  async append(blocks: BlockInput[], options?: BlockAppendOptions): Promise<Block[]> {
    const appended = await this.adapter.appendBlock(this.id, blocks, options)
    return appended.map(block => new Block(this.adapter, block))
  }

  /**
   * Clear all content from the page.
   *
   * @returns A promise that resolves when the page content has been cleared.
   * @example await page.clear()
   */
  async clear(): Promise<void> {
    await this.adapter.updatePage(this.id, { erase_content: true })
  }

  /**
   * Archives the page.
   *
   * @returns A promise that resolves when the page has been archived.
   * @example await page.archive()
   */
  archive(): Promise<void> {
    return this.adapter.archivePage(this.id)
  }

  /**
   * Restores the page from archive.
   *
   * @returns A promise that resolves when the page has been restored.
   * @example await page.restore()
   */
  restore(): Promise<void> {
    return this.adapter.restorePage(this.id)
  }
}
