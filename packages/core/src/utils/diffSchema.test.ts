import type { Schema } from '@/types'
import { diffSchema } from './diffSchema'

// --- Fixtures: reusable field factories.
const title = (label: string, id?: string): Schema.Field.Title => ({ label, type: 'title', id })
const text = (label: string, id?: string): Schema.Field.RichText => ({ label, type: 'rich_text', id })
const select = (label: string, id?: string): Schema.Field.Select => ({ label, type: 'select', id, options: [] })
const multiSelect = (label: string, id?: string): Schema.Field.MultiSelect => ({ label, type: 'multi_select', id, options: [] })
const createdTime = (label: string, id?: string): Schema.Field.CreatedTime => ({ label, type: 'created_time', id })

describe('diffSchema', () => {
  describe('added fields', () => {
    it('should detect an added field', () => {
      const from: Schema.Definition = { name: title('Name') }
      const to: Schema.Definition = { name: title('Name'), description: text('Description') }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([
        { type: 'added', key: 'description', field: { label: 'Description', type: 'rich_text' } },
      ])
    })

    it('should detect multiple added fields', () => {
      const from: Schema.Definition = {}
      const to: Schema.Definition = { name: title('Name'), description: text('Description') }
      const result = diffSchema(from, to)
      expect(result).toHaveLength(2)
      expect(result).toMatchObject([
        { type: 'added', key: 'name' },
        { type: 'added', key: 'description' },
      ])
    })
  })

  describe('removed fields', () => {
    it('should detect a removed field', () => {
      const from: Schema.Definition = { name: title('Name'), description: text('Description') }
      const to: Schema.Definition = { name: title('Name') }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([
        { type: 'removed', key: 'description', field: { label: 'Description', type: 'rich_text' } },
      ])
    })
  })

  describe('modified fields', () => {
    it('should detect a label change', () => {
      const from: Schema.Definition = { desc: text('Description') }
      const to: Schema.Definition = { desc: text('Summary') }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([
        {
          type: 'modified',
          key: 'desc',
          from: { label: 'Description', type: 'rich_text' },
          to: { label: 'Summary', type: 'rich_text' },
          changes: ['label'],
        },
      ])
    })

    it('should detect a type change', () => {
      const from: Schema.Definition = { priority: select('Priority') }
      const to: Schema.Definition = { priority: multiSelect('Priority') }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([
        { type: 'modified', key: 'priority', changes: ['type'] },
      ])
    })

    it('should detect both label and type changes', () => {
      const from: Schema.Definition = { field: select('Old Label') }
      const to: Schema.Definition = { field: multiSelect('New Label') }
      const result = diffSchema(from, to)
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        type: 'modified',
        key: 'field',
        changes: ['label', 'type'],
      })
    })
  })

  describe('unchanged fields', () => {
    it('should not include unchanged fields in the diff', () => {
      const from: Schema.Definition = { name: title('Name'), description: text('Description') }
      const to: Schema.Definition = { name: title('Name'), description: text('Description') }
      const result = diffSchema(from, to)
      expect(result).toHaveLength(0)
    })
  })

  describe('complex scenarios', () => {
    it('should handle a combination of added, removed, and modified fields', () => {
      const from: Schema.Definition = {
        name: title('Name'),
        description: text('Description'),
        priority: select('Priority'),
      }
      const to: Schema.Definition = {
        name: title('Name'),
        description: text('Summary'), // label changed
        tags: multiSelect('Tags'), // added
        // priority removed
      }
      const result = diffSchema(from, to)
      expect(result).toHaveLength(3)
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'added', key: 'tags' }),
          expect.objectContaining({ type: 'removed', key: 'priority' }),
          expect.objectContaining({ type: 'modified', key: 'description', changes: ['label'] }),
        ]),
      )
    })
  })

  describe('id-based matching', () => {
    it('should detect key rename when id matches', () => {
      const from: Schema.Definition = { oldKey: title('Field', 'abc123') }
      const to: Schema.Definition = { newKey: title('Field', 'abc123') }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([{
        type: 'modified',
        key: 'newKey',
        fromKey: 'oldKey',
        id: 'abc123',
        changes: ['key'],
      }])
    })

    it('should detect key rename with label change', () => {
      const from: Schema.Definition = { oldKey: title('Old Label', 'abc123') }
      const to: Schema.Definition = { newKey: title('New Label', 'abc123') }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([{
        type: 'modified',
        key: 'newKey',
        fromKey: 'oldKey',
        id: 'abc123',
        changes: ['key', 'label'],
      }])
    })

    it('should not report key rename when ids are different', () => {
      const from: Schema.Definition = { field: title('Field', 'id1') }
      const to: Schema.Definition = { field: title('Field', 'id2') }
      const result = diffSchema(from, to)
      // Since ids are different, matching falls back to key-based
      // Same key means no changes detected
      expect(result).toHaveLength(0)
    })

    it('should handle mixed id and non-id fields', () => {
      const from: Schema.Definition = {
        withId: title('With ID', 'abc123'),
        withoutId: text('Without ID'),
      }
      const to: Schema.Definition = {
        renamedKey: title('With ID', 'abc123'),
        withoutId: text('Updated Label'),
      }
      const result = diffSchema(from, to)
      expect(result).toHaveLength(2)
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'modified',
            key: 'renamedKey',
            fromKey: 'withId',
            id: 'abc123',
            changes: ['key'],
          }),
          expect.objectContaining({
            type: 'modified',
            key: 'withoutId',
            changes: ['label'],
          }),
        ]),
      )
    })

    it('should not include fromKey when key is unchanged', () => {
      const from: Schema.Definition = { field: title('Old Label', 'abc123') }
      const to: Schema.Definition = { field: title('New Label', 'abc123') }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([{ type: 'modified', key: 'field', id: 'abc123', changes: ['label'] }])
      expect(result[0]).not.toHaveProperty('fromKey')
    })

    it('should detect added field when id does not exist in from', () => {
      const from: Schema.Definition = { existing: title('Existing', 'id1') }
      const to: Schema.Definition = {
        existing: title('Existing', 'id1'),
        newField: text('New Field', 'id2'),
      }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([{ type: 'added', key: 'newField' }])
    })

    it('should detect removed field when id does not exist in to', () => {
      const from: Schema.Definition = {
        existing: title('Existing', 'id1'),
        removed: text('Removed', 'id2'),
      }
      const to: Schema.Definition = { existing: title('Existing', 'id1') }
      const result = diffSchema(from, to)
      expect(result).toMatchObject([{ type: 'removed', key: 'removed' }])
    })

    it('should not report unchanged fields with matching ids', () => {
      const from: Schema.Definition = { field: title('Field', 'abc123') }
      const to: Schema.Definition = { field: title('Field', 'abc123') }
      const result = diffSchema(from, to)
      expect(result).toHaveLength(0)
    })
  })

  describe('label-based matching', () => {
    it('should match by label when keys differ and to has no id', () => {
      const from: Schema.Definition = { nom: title('Nom', 'title') }
      const to: Schema.Definition = { name: title('Nom') } // Different key, same label, no id
      const result = diffSchema(from, to)
      expect(result).toMatchObject([
        {
          type: 'modified',
          key: 'name',
          fromKey: 'nom',
          id: 'title',
          from: { label: 'Nom', id: 'title', type: 'title' },
          to: { label: 'Nom', type: 'title' },
          changes: ['key'],
        },
      ])
    })

    it('should match multiple fields by label', () => {
      const from: Schema.Definition = {
        dateDeCration: createdTime('Date de création', 'created'),
        statut: select('Statut', 'status'),
      }
      const to: Schema.Definition = {
        created_at: createdTime('Date de création'),
        status: select('Statut'),
      }
      const result = diffSchema(from, to)
      expect(result).toHaveLength(2)
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'modified', key: 'created_at', fromKey: 'dateDeCration', id: 'created' }),
          expect.objectContaining({ type: 'modified', key: 'status', fromKey: 'statut', id: 'status' }),
        ]),
      )
    })

    it('should not treat label-matched fields as added/removed', () => {
      const from: Schema.Definition = { nom: title('Title', 'title') }
      const to: Schema.Definition = { name: title('Title') }
      const result = diffSchema(from, to)
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('modified')
      expect(result.filter(d => d.type === 'added')).toHaveLength(0)
      expect(result.filter(d => d.type === 'removed')).toHaveLength(0)
    })
  })

  describe('unique type matching', () => {
    it('should match title fields by type when labels differ', () => {
      const from: Schema.Definition = { nom: title('Nom', 'title') }
      const to: Schema.Definition = { name: title('Title') } // Different label

      const result = diffSchema(from, to)

      expect(result).toMatchObject([
        {
          type: 'modified',
          key: 'name',
          fromKey: 'nom',
          id: 'title',
          changes: ['key', 'label'],
        },
      ])
    })

    it('should not treat title fields as added/removed when labels differ', () => {
      const from: Schema.Definition = { oldTitle: title('Old Title', 'title') }
      const to: Schema.Definition = { newTitle: title('New Title') }

      const result = diffSchema(from, to)

      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('modified')
      expect(result.filter(d => d.type === 'added')).toHaveLength(0)
      expect(result.filter(d => d.type === 'removed')).toHaveLength(0)
    })
  })
})
