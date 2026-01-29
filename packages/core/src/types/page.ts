import type { BlockInput } from './blockInput'
import type { FileInput, FileObject } from './file'
import type { IconInput, IconObject } from './icon'
import type { ParentObject } from './parent'
import type { Property } from './property'
import type { UserReference } from './user'

export interface PageObject {
  object: 'page'
  id: string
  url: string
  public_url: null | string
  properties: Record<string, Property.Value>
  parent:
    | ParentObject.Block
    | ParentObject.Database
    | ParentObject.DataSource
    | ParentObject.Page
    | ParentObject.Workspace
  icon: IconObject | null
  cover: FileObject | null
  archived: boolean
  in_trash: boolean
  is_locked?: boolean
  created_time: string
  last_edited_time: string
  created_by: UserReference
  last_edited_by: UserReference
}

export interface PageCreateOptions {
  parent?: { block_id: string } | { data_source_id: string } | { page_id: string }
  properties?: Record<string, Property.ValueInput>
  icon?: IconInput | null
  cover?: FileInput | null
  children?: BlockInput[]
}

export interface PageUpdateOptions {
  icon?: IconInput | null
  cover?: FileInput | null
  is_locked?: boolean
  properties?: Record<string, Property.ValueInput>
  template?: { type: 'default' } | { type: 'template_id'; template_id: string }
  erase_content?: boolean
  archived?: boolean
  in_trash?: boolean
}
