/* eslint-disable @typescript-eslint/no-redeclare */
import type { CodeLanguage, Color, ListFormat } from './common'
import type { IconInput } from './icon'
import type { RichText } from './text'

/**
 * Block content types shared between BlockInput (request) and BlockObject (response).
 *
 * These types represent the inner content of blocks, without the wrapper structure
 * (type discriminator, metadata, children, etc.).
 */
export namespace BlockContent {
  export interface Paragraph {
    rich_text: RichText[]
    color?: Color
  }
  export interface Heading {
    rich_text: RichText[]
    color?: Color
    is_toggleable?: boolean
  }
  export interface Quote {
    rich_text: RichText[]
    color?: Color
  }
  export interface Callout {
    rich_text: RichText[]
    color?: Color
    icon?: IconInput | null
  }
  export interface BulletedListItem {
    rich_text: RichText[]
    color?: Color
  }
  export interface NumberedListItem {
    rich_text: RichText[]
    color?: Color
    list_start_index?: number
    list_format?: ListFormat
  }
  export interface ToDo {
    rich_text: RichText[]
    color?: Color
    checked?: boolean
  }
  export interface Toggle {
    rich_text: RichText[]
    color?: Color
  }
  export interface Code {
    rich_text: RichText[]
    caption?: RichText[]
    language?: CodeLanguage
  }
  export interface Template {
    rich_text: RichText[]
  }
  export interface Bookmark {
    url: string
    caption?: RichText[]
  }
  export interface Embed {
    url: string
    caption?: RichText[]
  }
  export interface LinkPreview {
    url: string
  }
  export interface Equation {
    expression: string
  }
  export interface TableOfContents {
    color?: Color
  }
  export interface ChildEntity {
    title: string
  }
  export namespace LinkToPage {
    export interface DatabaseLink {
      type: 'database_id'
      database_id: string
    }
    export interface PageLink {
      type: 'page_id'
      page_id: string
    }
  }
  export type LinkToPage =
    | LinkToPage.DatabaseLink
    | LinkToPage.PageLink
  export interface SyncedBlock {
    synced_from: null | { type: 'block_id'; block_id: string }
  }
  export interface Table {
    table_width: number
    has_column_header?: boolean
    has_row_header?: boolean
  }
  export interface TableRow {
    cells: RichText[][]
  }
}

export type BlockContent =
  | BlockContent.Bookmark
  | BlockContent.BulletedListItem
  | BlockContent.Callout
  | BlockContent.ChildEntity
  | BlockContent.Code
  | BlockContent.Embed
  | BlockContent.Equation
  | BlockContent.Heading
  | BlockContent.LinkPreview
  | BlockContent.LinkToPage
  | BlockContent.NumberedListItem
  | BlockContent.Paragraph
  | BlockContent.Quote
  | BlockContent.SyncedBlock
  | BlockContent.Table
  | BlockContent.TableOfContents
  | BlockContent.TableRow
  | BlockContent.Template
  | BlockContent.ToDo
  | BlockContent.Toggle
