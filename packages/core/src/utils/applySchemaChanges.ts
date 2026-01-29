/* eslint-disable unicorn/no-null */
import type { Property, Schema } from '@/types'
import { toPropertyDefinition } from './toPropertyDefinition'

/** Conflict resolution strategy for schema synchronization. */
export type ConflictStrategy =
  | 'merge'
  | 'overwrite'
  | 'strict'

/**
 * Applies schema changes based on a diff and conflict resolution strategy.
 *
 * This function takes the diff between a local schema and a remote schema,
 * and produces a property update payload that can be sent to the API.
 *
 * **Conflict Strategies:**
 * - `strict`: Throws an error if remote has fields not in local schema (unless matched by id)
 * - `merge`: Keeps remote fields that don't conflict, adds/updates local fields
 * - `overwrite`: Replaces remote schema entirely (deletes remote-only fields)
 *
 * @param localSchema The desired schema definition.
 * @param diffs The diff result from comparing remote to local schema.
 * @param strategy The conflict resolution strategy.
 * @returns A record of property definitions to send to the API.
 *
 * @example
 * const diff = diffSchema(remoteSchema, localSchema)
 * const updates = applySchemaChanges(localSchema, diff, 'merge')
 * await dataSource.update({ schema: updates })
 */
export function applySchemaChanges(
  localSchema: Schema.Definition,
  diffs: Schema.Diff[],
  strategy: ConflictStrategy = 'merge',
): Record<string, null | Property.DefinitionInput> {
  const result: Record<string, null | Property.DefinitionInput> = {}

  // --- Separate diffs by type for easier processing.
  const added: Schema.Diff.Added[] = []
  const removed: Schema.Diff.Removed[] = []
  const modified: Schema.Diff.Modified[] = []

  for (const diff of diffs) {
    if (diff.type === 'added') added.push(diff)
    else if (diff.type === 'removed') removed.push(diff)
    else if (diff.type === 'modified') modified.push(diff)
  }

  // --- Handle "added" fields (in remote but not in local).
  // --- These are fields that exist remotely but we don't have in our schema.
  // --- Note: diffSchema(remote, local) means "added" = in local but not remote.
  // --- But we call diffSchema(remoteSchema, localSchema), so:
  // ---   added = fields in localSchema but not in remoteSchema (we need to create)
  // ---   removed = fields in remoteSchema but not in localSchema (remote-only)
  // ---
  // --- Actually, let's clarify: diffSchema(from, to) returns:
  // ---   added = keys in `to` that are not in `from`
  // ---   removed = keys in `from` that are not in `to`
  // ---   modified = keys that changed between `from` and `to`
  // ---
  // --- We'll call diffSchema(remoteSchema, localSchema):
  // ---   added = fields we want to CREATE (in local but not remote)
  // ---   removed = fields we might DELETE (in remote but not local)
  // ---   modified = fields we need to UPDATE

  // --- Process ADDED fields (create them).
  for (const diff of added) {
    const field = localSchema[diff.key]
    if (field) result[field.label] = toPropertyDefinition(field)
  }

  // --- Process MODIFIED fields (update them).
  for (const diff of modified) {
    const field = localSchema[diff.key]
    if (!field) continue

    const definition = toPropertyDefinition(field) as Property.DefinitionInput & { name?: string }

    // --- If we have an id from the diff (id-matched), use it.
    // --- Otherwise, try to get the id from the source field.
    // --- This is especially important for title properties where
    // --- the id is required for updates but may not be in local schema.
    const id = diff.id ?? diff.from.id
    if (id) definition.id = id

    // --- Determine if the label is being renamed.
    const isLabelRenamed = diff.changes.includes('label')

    // --- When renaming a property label:
    // --- 1. Use the OLD label as the key (to target the existing property)
    // --- 2. Set the `name` field to the NEW label
    if (isLabelRenamed) {
      definition.name = field.label
      result[diff.from.label] = definition
    }
    else {
      result[field.label] = definition
    }
  }

  // --- Process REMOVED fields (in remote but not in local).
  // --- Behavior depends on strategy.
  if (removed.length > 0) {

    // --- In strict mode, unrecognized remote fields cause an error.
    // --- However, if a field was matched by id (key rename), it's not "unrecognized".
    if (strategy === 'strict') {
      const unrecognized = removed.map(d => d.key)
      if (unrecognized.length > 0)
        throw new Error(`Unrecognized remote fields: ${unrecognized.join(', ')}`)
    }

    // --- In overwrite mode, delete remote-only fields by setting to null.
    else if (strategy === 'overwrite') {
      for (const d of removed)
        result[d.field.label] = null
    }

    // --- In merge mode, we simply ignore removed fields (keep them).
  }

  return result
}
