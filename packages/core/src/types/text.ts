/* eslint-disable @typescript-eslint/no-redeclare */
import type { Color } from './common'
import type { DateObject } from './date'
import type { UserObject, UserReference } from './user'

export namespace RichText {

  /** Text styling annotations */
  export interface Annotations {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: Color
  }

  /** Base interface for all rich text objects */
  interface Base {
    annotations: Annotations
    plain_text: string
    href: null | string
  }

  /** Text object representing a string with optional link */
  export interface Text extends Base {
    type: 'text'
    text: {
      content: string
      link: null | { url: string }
    }
  }

  /** Equation object representing a mathematical expression */
  export interface Equation extends Base {
    type: 'equation'
    equation: { expression: string }
  }

  /** Mention type objects representing references to Notion objects */
  export namespace Mention {
    export interface Database {
      type: 'database'
      database: { id: string }
    }
    export interface Date {
      type: 'date'
      date: DateObject
    }
    export interface LinkPreview {
      type: 'link_preview'
      link_preview: { url: string }
    }
    export interface Page {
      type: 'page'
      page: { id: string }
    }
    export interface User {
      type: 'user'
      user: UserObject | UserReference
    }
    export interface TemplateMentionDate {
      type: 'template_mention'
      template_mention: {
        type: 'template_mention_date'
        template_mention_date: 'now' | 'today'
      }
    }
    export interface TemplateMentionUser {
      type: 'template_mention'
      template_mention: {
        type: 'template_mention_user'
        template_mention_user: 'me'
      }
    }
  }

  /** Mention object representing an inline @-mention */
  export interface Mention extends Base {
    type: 'mention'
    mention:
      | Mention.Database
      | Mention.Date
      | Mention.LinkPreview
      | Mention.Page
      | Mention.TemplateMentionDate
      | Mention.TemplateMentionUser
      | Mention.User
  }
}

/** RichText can be a Text, Mention, or Equation */
export type RichText =
  | RichText.Equation
  | RichText.Mention
  | RichText.Text
