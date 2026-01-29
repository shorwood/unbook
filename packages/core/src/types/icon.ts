/* eslint-disable @typescript-eslint/no-redeclare */

/**
 * Icon objects represent icons in Notion.
 * These can be emojis, external images, or hosted files.
 */
export namespace IconObject {
  export interface Emoji {
    type: 'emoji'
    emoji: string
  }
  export interface External {
    type: 'external'
    external: {
      url: string
    }
  }
  export interface File {
    type: 'file'
    file: {
      url: string
      expiry_time: string
    }
  }
}

/** Icon can be an emoji, an external image, or a hosted file */
export type IconObject =
  | IconObject.Emoji
  | IconObject.External
  | IconObject.File

/**
 * Icon input for creating or updating icons.
 */
export namespace IconInput {
  export interface Emoji {
    type: 'emoji'
    emoji: string
  }
  export interface External {
    type: 'external'
    external: {
      url: string
    }
  }
  export interface FileUpload {
    type: 'file_upload'
    file_upload: {
      id: string
    }
  }
}

/** Icon input can be an emoji, an external image, or a file upload */
export type IconInput =
  | IconInput.Emoji
  | IconInput.External
  | IconInput.FileUpload
