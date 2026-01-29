/* eslint-disable @typescript-eslint/no-redeclare */

/** Reference to a user object by ID */
export interface UserReference {
  object: 'user'
  id: string
}

export namespace UserObject {
  export namespace Owner {
    export interface User {
      type: 'user'
      user: UserReference
    }
    export interface Workspace {
      type: 'workspace'
      workspace: true
    }
  }
  export type Owner =
    | Owner.User
    | Owner.Workspace
  export interface Person {
    object: 'user'
    id: string
    type: 'person'
    name: null | string
    avatar_url: null | string
    person: { email: string }
  }
  export interface Bot {
    object: 'user'
    id: string
    type: 'bot'
    name: null | string
    avatar_url: null | string
    bot: { owner: Owner }
  }
}

export type UserObject =
  | UserObject.Bot
  | UserObject.Person
