import type { Adapter } from '@/adapter'
import type { UserObject } from '@/types'

/**
 * Represents a user in the underlying adapter system.
 *
 * @param adapter The adapter used to interact with the underlying system.
 * @param data The raw data of the user from the adapter.
 */
export class User {
  constructor(
    readonly adapter: Adapter,
    readonly object: UserObject,
  ) {}

  /**********************************************************/
  /* Inspection                                             */
  /**********************************************************/

  /**
   * Gets the ID of the user.
   *
   * @returns The ID of the user as a string.
   * @example user.id // 'some-user-id'
   */
  get id(): string {
    return this.object.id
  }

  /**
   * Gets the type of the user.
   *
   * @returns The type of the user, either 'person' or 'bot'.
   * @example user.type // 'person'
   */
  get type(): 'bot' | 'person' {
    return this.object.type
  }

  /**
   * Gets the name of the user.
   *
   * @returns The name of the user, or `null` if not available.
   * @example user.name // 'John Doe'
   */
  get name(): string | undefined {
    return this.object.name ?? undefined
  }

  /**
   * Gets the avatar URL of the user.
   *
   * @returns The avatar URL of the user, or `null` if not available.
   * @example user.avatarUrl // 'https://example.com/avatar.png'
   */
  get avatarUrl(): string | undefined {
    return this.object.avatar_url ?? undefined
  }

  /**
   * Gets the email of a person user.
   *
   * @returns The email of the user, or `undefined` if the user is a bot or email is not available.
   * @example user.email // 'john@example.com'
   */
  get email(): string | undefined {
    if (this.object.type === 'person')
      return this.object.person.email
  }

  /**
   * Checks if the user is a person.
   *
   * @returns `true` if the user is a person, `false` otherwise.
   * @example user.isPerson() // true
   */
  isPerson(): boolean {
    return this.object.type === 'person'
  }

  /**
   * Checks if the user is a bot.
   *
   * @returns `true` if the user is a bot, `false` otherwise.
   * @example user.isBot() // true
   */
  isBot(): boolean {
    return this.object.type === 'bot'
  }

  /**********************************************************/
  /* Resolution                                             */
  /**********************************************************/

  /**
   * Gets the owner of a bot user.
   *
   * @returns The owner user if the bot is owned by a user, or `undefined` if owned by a workspace or not a bot.
   * @example const owner = await bot.getOwner() // User { ... }
   */
  async getOwner(): Promise<undefined | User> {
    if (this.object.type !== 'bot') return
    const owner = this.object.bot.owner
    if (owner.type === 'user' && owner.user) {
      const user = await this.adapter.getUser(owner.user.id)
      return new User(this.adapter, user)
    }
  }
}
