import type { Schema } from '@/types'
import { applySchemaChanges } from './applySchemaChanges'

// --- Fixtures: reusable field factories.
const title = (label: string, id?: string): Schema.Field.Title => ({ label, type: 'title', id })
const text = (label: string, id?: string): Schema.Field.RichText => ({ label, type: 'rich_text', id })
const number = (label: string, id?: string): Schema.Field.Number => ({ label, type: 'number', id })

// --- Fixtures: reusable diff factories.
const added = (key: string, field: Schema.Field): Schema.Diff.Added => ({ type: 'added', key, field })
const removed = (key: string, field: Schema.Field): Schema.Diff.Removed => ({ type: 'removed', key, field })
function modified(key: string, from: Schema.Field, to: Schema.Field, changes: string[], options?: { fromKey?: string; id?: string }): Schema.Diff.Modified {
  return { type: 'modified', key, from, to, changes, ...options }
}

describe('applySchemaChanges', () => {
  describe('added fields', () => {
    it('should create properties for added fields', () => {
      const schema: Schema.Definition = { name: title('Name'), desc: text('Description') }
      const diff: Schema.Diff[] = [added('name', title('Name')), added('desc', text('Description'))]
      const result = applySchemaChanges(schema, diff)
      expect(result).toMatchObject({
        Name: { type: 'title' },
        Description: { type: 'rich_text' },
      })
    })
  })

  describe('modified fields', () => {
    it('should update properties for modified fields', () => {
      const schema: Schema.Definition = { count: number('Count') }
      const diff: Schema.Diff[] = [modified('count', text('Count'), number('Count'), ['type'])]
      const result = applySchemaChanges(schema, diff)
      expect(result).toMatchObject({ Count: { type: 'number' } })
    })

    it('should handle key renames using id', () => {
      const schema: Schema.Definition = { newKey: title('Title', 'abc123') }
      const diff: Schema.Diff[] = [modified('newKey', title('Title', 'abc123'), title('Title', 'abc123'), ['key'], { fromKey: 'oldKey', id: 'abc123' })]
      const result = applySchemaChanges(schema, diff)
      expect(result).toMatchObject({ Title: { type: 'title', id: 'abc123' } })
    })

    it('should handle label changes', () => {
      const schema: Schema.Definition = { name: title('New Name', 'abc') }
      const diff: Schema.Diff[] = [modified('name', title('Old Name', 'abc'), title('New Name', 'abc'), ['label'])]
      const result = applySchemaChanges(schema, diff)
      // When renaming, use old label as key and set name to new label
      expect(result).toMatchObject({ 'Old Name': { type: 'title', id: 'abc', name: 'New Name' } })
    })
  })

  describe('removed fields - merge strategy', () => {
    it('should ignore removed fields in merge mode', () => {
      const schema: Schema.Definition = { name: title('Name') }
      const diff: Schema.Diff[] = [removed('extra', text('Extra'))]
      const result = applySchemaChanges(schema, diff, 'merge')
      expect(result).toEqual({})
    })
  })

  describe('removed fields - strict strategy', () => {
    it('should throw Error for unrecognized fields', () => {
      const schema: Schema.Definition = { name: title('Name') }
      const diff: Schema.Diff[] = [removed('extra', text('Extra')), removed('other', number('Other'))]
      const shouldThrow = () => applySchemaChanges(schema, diff, 'strict')
      expect(shouldThrow).toThrow(Error)
    })

    it('should include unrecognized field keys in error message', () => {
      const schema: Schema.Definition = {}
      const diff: Schema.Diff[] = [removed('foo', text('Foo')), removed('bar', text('Bar'))]
      const shouldThrow = () => applySchemaChanges(schema, diff, 'strict')
      expect(shouldThrow).toThrow('Unrecognized remote fields: foo, bar')
    })
  })

  describe('removed fields - overwrite strategy', () => {
    it('should set removed fields to null', () => {
      const schema: Schema.Definition = { name: title('Name') }
      const diff: Schema.Diff[] = [removed('extra', text('Extra')), removed('old', number('Old'))]
      const result = applySchemaChanges(schema, diff, 'overwrite')
      expect(result).toEqual({ Extra: null, Old: null })
    })
  })

  describe('mixed operations', () => {
    it('should handle add, modify, and remove together', () => {
      const schema: Schema.Definition = {
        name: title('Name'),
        count: number('Count'),
      }
      const diff: Schema.Diff[] = [
        added('name', title('Name')),
        modified('count', text('Count'), number('Count'), ['type']),
        removed('old', text('Old')),
      ]
      const result = applySchemaChanges(schema, diff, 'overwrite')
      expect(result).toMatchObject({
        Name: { type: 'title' },
        Count: { type: 'number' },
        Old: null,
      })
    })
  })

  describe('edge cases', () => {
    it('should return empty object for empty diff', () => {
      const result = applySchemaChanges({ name: title('Name') }, [])
      expect(result).toEqual({})
    })

    it('should default to merge strategy', () => {
      const schema: Schema.Definition = {}
      const diff: Schema.Diff[] = [removed('extra', text('Extra'))]
      const result = applySchemaChanges(schema, diff)
      expect(result).toEqual({})
    })
  })
})
