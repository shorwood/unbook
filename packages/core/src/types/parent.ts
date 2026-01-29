/* eslint-disable @typescript-eslint/no-redeclare */
export namespace ParentObject {
  export interface Database {
    type: 'database_id'
    database_id: string
  }
  export interface DataSource {
    type: 'data_source_id'
    data_source_id: string

    /** The ID of the database that the data source belongs to, provided for convenience. */
    database_id?: string
  }
  export interface Page {
    type: 'page_id'
    page_id: string
  }
  export interface Block {
    type: 'block_id'
    block_id: string
  }
  export interface Workspace {
    type: 'workspace'
    workspace: true
  }
}

export type ParentObject =
  | ParentObject.Block
  | ParentObject.Database
  | ParentObject.DataSource
  | ParentObject.Page
  | ParentObject.Workspace
