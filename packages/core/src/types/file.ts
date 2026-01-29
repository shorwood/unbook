/* eslint-disable @typescript-eslint/no-redeclare */
import type { RichText } from './text'

export namespace FileObject {
  interface Base {
    name?: string
    caption?: RichText[]
  }
  export interface External extends Base {
    type: 'external'
    external: {
      url: string
    }
  }
  export interface Hosted extends Base {
    type: 'file'
    file: {
      url: string
      expiry_time: string
    }
  }
}

export type FileObject =
  | FileObject.External
  | FileObject.Hosted

export namespace FileInput {
  interface Base {
    name?: string
    caption?: RichText[]
  }
  export interface External extends Base {
    type: 'external'
    external: {
      url: string
    }
  }
  export interface FileUpload extends Base {
    type: 'file_upload'
    file_upload: {
      id: string
    }
  }
}

export type FileInput =
  | FileInput.External
  | FileInput.FileUpload
