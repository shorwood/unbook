import type { Adapter } from '@/adapter'
import type { BlockAppendOptions, BlockInput, BlockObject, BlockUpdateOptions } from '@/types'
import { renderBlock } from '@/utils'
import { DataSource } from './DataSource'
import { Page } from './Page'
import { User } from './User'

export class Block {
  constructor(
    readonly adapter: Adapter,
    readonly object: BlockObject,
  ) {}

  /**********************************************************/
  /* Inspection                                             */
  /**********************************************************/

  /**
   * Get the ID of the block.
   *
   * @returns The block ID as a string.
   * @example const id = block.id // 'some-block-id'
   */
  get id(): string {
    return this.object.id
  }

  /**
   * Get the type of the block.
   *
   * @returns The block type as a string.
   * @example const type = block.type // 'paragraph'
   */
  get type() {
    return this.object.type
  }

  /**
   * Get the creation time of the block as a Date object.
   *
   * @returns The creation time of the block.
   * @example const createdTime = block.createdAt // Date { ... }
   */
  get createdAt(): Date {
    return new Date(this.object.created_time)
  }

  /**
   * Get the last edited time of the block as a Date object.
   *
   * @returns The last edited time of the block.
   * @example const lastEdited = block.lastEditedAt // Date { ... }
   */
  get lastEditedAt(): Date {
    return new Date(this.object.last_edited_time)
  }

  /**********************************************************/
  /* Resolution                                             */
  /**********************************************************/

  /**
   * Fetches the parent of the block. If the parent is a block, data source, or page,
   * it returns the corresponding instance. If the parent is a workspace or if
   * the parent type is unrecognized, it returns `undefined`.
   *
   * @returns The parent block, data source, or page.
   * @example const parent = await block.getParent() // Block { ... }
   */
  async getParent(): Promise<Block | DataSource | Page | undefined> {
    if (this.object.parent.type === 'block_id') {
      const blockData = await this.adapter.getBlock(this.object.parent.block_id)
      return new Block(this.adapter, blockData)
    }
    else if (this.object.parent.type === 'page_id') {
      const pageData = await this.adapter.getPage(this.object.parent.page_id)
      return new Page(this.adapter, pageData)
    }
    else if (this.object.parent.type === 'data_source_id') {
      const dataSourceData = await this.adapter.getDataSource(this.object.parent.data_source_id)
      return new DataSource(this.adapter, dataSourceData)
    }
  }

  /**
   * Gets the children blocks of this block.
   *
   * @yields The child blocks as an async iterable.
   * @example
   * // Fetch the block.
   * const block = await client.getBlock('some-block-id')
   *
   * // Iterate over the children as they are fetched.
   * for await (const block of block.getChildren()) {
   *   console.log(block)
   * }
   */
  async * getChildren(): AsyncIterable<Block> {
    if (!this.object.has_children) return
    for await (const block of this.adapter.getBlockChildren(this.id))
      yield new Block(this.adapter, block)
  }

  /**
   * Gets the `User` instance representing the creator of the block.
   *
   * @returns A promise that resolves to the `User` who created the block.
   * @example const creator = await block.getCreator() // User { ... }
   */
  async getCreator(): Promise<User> {
    const user = await this.adapter.getUser(this.object.created_by.id)
    return new User(this.adapter, user)
  }

  /**
   * Gets the `User` instance representing the last editor of the block.
   *
   * @returns A promise that resolves to the `User` who last edited the block.
   * @example const editor = await block.getLastEditor() // User { ... }
   */
  async getLastEditor(): Promise<User> {
    const user = await this.adapter.getUser(this.object.last_edited_by.id)
    return new User(this.adapter, user)
  }

  /**********************************************************/
  /* Rendering                                              */
  /**********************************************************/

  /**
   * Get's the markdown equivalent of the block's content. This is a
   * simplified representation and may not capture all formatting details.
   * Roundtripping is not guaranteed to preserve all original content or formatting.
   *
   * @returns The markdown representation of the block's content.
   * @example const markdown = await block.toMarkdown() // '**Bold Text**'
   */
  async render(): Promise<string> {
    return renderBlock(this.object, {
      resolveUser: (id: string) => this.adapter.getUser(id),
      resolvePage: (id: string) => this.adapter.getPage(id),
      resolveChildren: (id: string) => this.adapter.getBlockChildren(id),
    })
  }

  /**********************************************************/
  /* CRUD                                                   */
  /**********************************************************/

  /**
   * Updates the block with the given parameters.
   *
   * @param options The update parameters.
   * @returns The updated block.
   * @example
   * // Update the block's content.
   * const updatedBlock = await block.update({
   *   paragraph: {
   *     text: [{ type: 'text', text: { content: 'Updated content' } }]
   *   }
   * })
   */
  async update(options: BlockUpdateOptions): Promise<Block> {
    const updated = await this.adapter.updateBlock(this.id, options)
    return new Block(this.adapter, updated)
  }

  /**
   * Deletes the block.
   *
   * @returns A promise that resolves when the block is deleted.
   * @example await block.delete()
   */
  async delete(): Promise<void> {
    return this.adapter.deleteBlock(this.id)
  }

  /**
   * Appends child blocks to this block.
   *
   * @param blocks The blocks to append as children.
   * @param options Options for appending the blocks.
   * @returns The appended blocks.
   * @example
   * // Append a paragraph block as a child.
   * const newBlocks = await block.append([
   *   {
   *     type: 'paragraph',
   *     paragraph: { text: [{ type: 'text', text: { content: 'New child block' } }] }
   *   }
   * ])
   */
  async append(blocks: BlockInput[], options?: BlockAppendOptions): Promise<Block[]> {
    const appended = await this.adapter.appendBlock(this.id, blocks, options)
    return appended.map(block => new Block(this.adapter, block))
  }
}
