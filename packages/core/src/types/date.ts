export namespace DataObject {
  export interface Date {
    start: string
    end?: null
    time_zone?: null | string
  }
  export interface Range {
    start: string
    end: string
    time_zone?: null | string
  }
}

export type DateObject =
  | DataObject.Date
  | DataObject.Range
