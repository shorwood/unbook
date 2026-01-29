import type { BlockInput } from './blockInput'

/** Utility type to strip `children` and make content properties optional for updates. */
type ToUpdateInput<T extends BlockInput> = T extends { type: infer Type; [K: string]: unknown }
  ? Type extends keyof T
    ? Record<Type, Partial<Omit<T[keyof T & Type], 'children'>>> & { type?: Type; archived?: boolean }
    : never
  : never

/** Options for updating a block via the Update block endpoint. */
export type BlockUpdateOptions = ToUpdateInput<BlockInput>

/** Options for appending blocks as children to a block. */
export interface BlockAppendOptions {
  position?:
    | { type: 'after_block'; after_block: { id: string } }
    | { type: 'end' }
    | { type: 'start' }
}
