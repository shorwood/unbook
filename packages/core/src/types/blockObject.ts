/* eslint-disable @typescript-eslint/no-redeclare */
import type { BlockContent } from './blockContent'
import type { FileObject } from './file'
import type { ParentObject } from './parent'
import type { UserReference } from './user'

export namespace BlockObject {
  export type Parent =
    | ParentObject.Block
    | ParentObject.DataSource
    | ParentObject.Page
  export interface Base {
    object: 'block'
    id: string
    parent: Parent
    created_time: string
    last_edited_time: string
    created_by: UserReference
    last_edited_by: UserReference
    archived: boolean
    in_trash: boolean
    has_children: boolean
  }
  export interface Paragraph extends Base {
    type: 'paragraph'
    paragraph: BlockContent.Paragraph
  }
  export interface Heading1 extends Base {
    type: 'heading_1'
    heading_1: BlockContent.Heading
  }
  export interface Heading2 extends Base {
    type: 'heading_2'
    heading_2: BlockContent.Heading
  }
  export interface Heading3 extends Base {
    type: 'heading_3'
    heading_3: BlockContent.Heading
  }
  export interface Quote extends Base {
    type: 'quote'
    quote: BlockContent.Quote
  }
  export interface Callout extends Base {
    type: 'callout'
    callout: BlockContent.Callout
  }
  export interface BulletedListItem extends Base {
    type: 'bulleted_list_item'
    bulleted_list_item: BlockContent.BulletedListItem
  }
  export interface NumberedListItem extends Base {
    type: 'numbered_list_item'
    numbered_list_item: BlockContent.NumberedListItem
  }
  export interface ToDo extends Base {
    type: 'to_do'
    to_do: BlockContent.ToDo
  }
  export interface Toggle extends Base {
    type: 'toggle'
    toggle: BlockContent.Toggle
  }
  export interface Code extends Base {
    type: 'code'
    code: Required<BlockContent.Code>
  }
  export interface Template extends Base {
    type: 'template'
    template: BlockContent.Template
  }
  export interface Image extends Base {
    type: 'image'
    image: FileObject
  }
  export interface Video extends Base {
    type: 'video'
    video: FileObject
  }
  export interface FileBlock extends Base {
    type: 'file'
    file: FileObject
  }
  export interface Pdf extends Base {
    type: 'pdf'
    pdf: FileObject
  }
  export interface Audio extends Base {
    type: 'audio'
    audio: FileObject
  }
  export interface Bookmark extends Base {
    type: 'bookmark'
    bookmark: Required<BlockContent.Bookmark>
  }
  export interface Embed extends Base {
    type: 'embed'
    embed: BlockContent.Embed
  }
  export interface LinkPreview extends Base {
    type: 'link_preview'
    link_preview: BlockContent.LinkPreview
  }
  export interface Equation extends Base {
    type: 'equation'
    equation: BlockContent.Equation
  }
  export interface Divider extends Base {
    type: 'divider'
    divider: object
  }
  export interface TableOfContents extends Base {
    type: 'table_of_contents'
    table_of_contents: Required<BlockContent.TableOfContents>
  }
  export interface Breadcrumb extends Base {
    type: 'breadcrumb'
    breadcrumb: object
  }
  export interface ColumnList extends Base {
    type: 'column_list'
    column_list: object
  }
  export interface Column extends Base {
    type: 'column'
    column: object
  }
  export interface ChildPage extends Base {
    type: 'child_page'
    child_page: BlockContent.ChildEntity
  }
  export interface ChildDatabase extends Base {
    type: 'child_database'
    child_database: BlockContent.ChildEntity
  }
  export interface LinkToPage extends Base {
    type: 'link_to_page'
    link_to_page: BlockContent.LinkToPage
  }
  export interface SyncedBlock extends Base {
    type: 'synced_block'
    synced_block: BlockContent.SyncedBlock
  }
  export interface Table extends Base {
    type: 'table'
    table: Required<BlockContent.Table>
  }
  export interface TableRow extends Base {
    type: 'table_row'
    table_row: BlockContent.TableRow
  }
  export interface Unsupported extends Base {
    type: 'unsupported'
    unsupported: object
  }
}

export type BlockObject =
  | BlockObject.Audio
  | BlockObject.Bookmark
  | BlockObject.Breadcrumb
  | BlockObject.BulletedListItem
  | BlockObject.Callout
  | BlockObject.ChildDatabase
  | BlockObject.ChildPage
  | BlockObject.Code
  | BlockObject.Column
  | BlockObject.ColumnList
  | BlockObject.Divider
  | BlockObject.Embed
  | BlockObject.Equation
  | BlockObject.FileBlock
  | BlockObject.Heading1
  | BlockObject.Heading2
  | BlockObject.Heading3
  | BlockObject.Image
  | BlockObject.LinkPreview
  | BlockObject.LinkToPage
  | BlockObject.NumberedListItem
  | BlockObject.Paragraph
  | BlockObject.Pdf
  | BlockObject.Quote
  | BlockObject.SyncedBlock
  | BlockObject.Table
  | BlockObject.TableOfContents
  | BlockObject.TableRow
  | BlockObject.Template
  | BlockObject.ToDo
  | BlockObject.Toggle
  | BlockObject.Unsupported
  | BlockObject.Video
