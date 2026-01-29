/* eslint-disable @typescript-eslint/no-redeclare */
import type { BlockContent } from './blockContent'
import type { FileInput } from './file'

export namespace BlockInput {
  type WithChildren<T, U extends BlockInput = BlockInput> = T & {
    children?: U[]
  }
  export interface Paragraph {
    type: 'paragraph'
    paragraph: WithChildren<BlockContent.Paragraph>
  }
  export interface Heading1 {
    type: 'heading_1'
    heading_1: WithChildren<BlockContent.Heading>
  }
  export interface Heading2 {
    type: 'heading_2'
    heading_2: WithChildren<BlockContent.Heading>
  }
  export interface Heading3 {
    type: 'heading_3'
    heading_3: WithChildren<BlockContent.Heading>
  }
  export interface Quote {
    type: 'quote'
    quote: WithChildren<BlockContent.Quote>
  }
  export interface Callout {
    type: 'callout'
    callout: WithChildren<BlockContent.Callout>
  }
  export interface BulletedListItem {
    type: 'bulleted_list_item'
    bulleted_list_item: WithChildren<BlockContent.BulletedListItem>
  }
  export interface NumberedListItem {
    type: 'numbered_list_item'
    numbered_list_item: WithChildren<BlockContent.NumberedListItem>
  }
  export interface ToDo {
    type: 'to_do'
    to_do: WithChildren<BlockContent.ToDo>
  }
  export interface Toggle {
    type: 'toggle'
    toggle: WithChildren<BlockContent.Toggle>
  }
  export interface Code {
    type: 'code'
    code: BlockContent.Code
  }
  export interface Template {
    type: 'template'
    template: WithChildren<BlockContent.Template>
  }
  export interface Image {
    type: 'image'
    image: FileInput
  }
  export interface Video {
    type: 'video'
    video: FileInput
  }
  export interface FileBlock {
    type: 'file'
    file: FileInput
  }
  export interface Pdf {
    type: 'pdf'
    pdf: FileInput
  }
  export interface Audio {
    type: 'audio'
    audio: FileInput
  }
  export interface Bookmark {
    type: 'bookmark'
    bookmark: BlockContent.Bookmark
  }
  export interface Embed {
    type: 'embed'
    embed: BlockContent.Embed
  }
  export interface Equation {
    type: 'equation'
    equation: BlockContent.Equation
  }
  export interface Divider {
    type: 'divider'
    divider?: object
  }
  export interface TableOfContents {
    type: 'table_of_contents'
    table_of_contents?: BlockContent.TableOfContents
  }
  export interface Breadcrumb {
    type: 'breadcrumb'
    breadcrumb?: object
  }
  export interface ColumnList {
    type: 'column_list'
    column_list: WithChildren<object, Column>
  }
  export interface Column {
    type: 'column'
    column: WithChildren<object, BlockInput>
  }
  export interface LinkToPage {
    type: 'link_to_page'
    link_to_page: BlockContent.LinkToPage
  }
  export interface SyncedBlock {
    type: 'synced_block'
    synced_block: WithChildren<BlockContent.SyncedBlock>
  }
  export interface Table {
    type: 'table'
    table: WithChildren<BlockContent.Table, TableRow>
  }
  export interface TableRow {
    type: 'table_row'
    table_row: BlockContent.TableRow
  }
}

export type BlockInput =
  | BlockInput.Audio
  | BlockInput.Bookmark
  | BlockInput.Breadcrumb
  | BlockInput.BulletedListItem
  | BlockInput.Callout
  | BlockInput.Code
  | BlockInput.Column
  | BlockInput.ColumnList
  | BlockInput.Divider
  | BlockInput.Embed
  | BlockInput.Equation
  | BlockInput.FileBlock
  | BlockInput.Heading1
  | BlockInput.Heading2
  | BlockInput.Heading3
  | BlockInput.Image
  | BlockInput.LinkToPage
  | BlockInput.NumberedListItem
  | BlockInput.Paragraph
  | BlockInput.Pdf
  | BlockInput.Quote
  | BlockInput.SyncedBlock
  | BlockInput.Table
  | BlockInput.TableOfContents
  | BlockInput.TableRow
  | BlockInput.Template
  | BlockInput.ToDo
  | BlockInput.Toggle
  | BlockInput.Video
