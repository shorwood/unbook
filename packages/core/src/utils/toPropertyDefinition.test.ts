import type { Schema } from '@/types'
import { toPropertyDefinition } from './toPropertyDefinition'

describe('toPropertyDefinition', () => {
  describe('simple types', () => {
    it('should convert title field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'title' })
      expect(result).toMatchObject({ type: 'title', title: {} })
    })

    it('should convert rich_text field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'rich_text' })
      expect(result).toMatchObject({ type: 'rich_text', rich_text: {} })
    })

    it('should convert date field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'date' })
      expect(result).toMatchObject({ type: 'date', date: {} })
    })

    it('should convert people field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'people' })
      expect(result).toMatchObject({ type: 'people', people: {} })
    })

    it('should convert files field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'files' })
      expect(result).toMatchObject({ type: 'files', files: {} })
    })

    it('should convert checkbox field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'checkbox' })
      expect(result).toMatchObject({ type: 'checkbox', checkbox: {} })
    })

    it('should convert url field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'url' })
      expect(result).toMatchObject({ type: 'url', url: {} })
    })

    it('should convert email field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'email' })
      expect(result).toMatchObject({ type: 'email', email: {} })
    })

    it('should convert phone_number field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'phone_number' })
      expect(result).toMatchObject({ type: 'phone_number', phone_number: {} })
    })

    it('should convert created_time field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'created_time' })
      expect(result).toMatchObject({ type: 'created_time', created_time: {} })
    })

    it('should convert created_by field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'created_by' })
      expect(result).toMatchObject({ type: 'created_by', created_by: {} })
    })

    it('should convert last_edited_time field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'last_edited_time' })
      expect(result).toMatchObject({ type: 'last_edited_time', last_edited_time: {} })
    })

    it('should convert last_edited_by field', () => {
      const result = toPropertyDefinition({ label: 'Test', type: 'last_edited_by' })
      expect(result).toMatchObject({ type: 'last_edited_by', last_edited_by: {} })
    })
  })

  describe('number field', () => {
    it('should convert with default format', () => {
      const field: Schema.Field = { label: 'Count', type: 'number' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({ type: 'number', number: { format: 'number' } })
    })

    it('should convert with custom format', () => {
      const field: Schema.Field = { label: 'Price', type: 'number', format: 'dollar' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({ type: 'number', number: { format: 'dollar' } })
    })
  })

  describe('unique_id field', () => {
    it('should convert with null prefix by default', () => {
      const field: Schema.Field = { label: 'ID', type: 'unique_id' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({ type: 'unique_id', unique_id: { prefix: null } })
    })

    it('should convert with custom prefix', () => {
      const field: Schema.Field = { label: 'ID', type: 'unique_id', prefix: 'TASK' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({ type: 'unique_id', unique_id: { prefix: 'TASK' } })
    })
  })

  describe('formula field', () => {
    it('should convert with expression', () => {
      const field: Schema.Field = { label: 'Formula', type: 'formula', expression: 'prop("A") + prop("B")' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({ type: 'formula', formula: { expression: 'prop("A") + prop("B")' } })
    })
  })

  describe('relation field', () => {
    it('should convert with single_property by default', () => {
      const field: Schema.Field = { label: 'Related', type: 'relation', data_source_id: 'db-123' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'relation',
        relation: {
          data_source_id: 'db-123',
          type: 'single_property',
          single_property: {},
        },
      })
    })

    it('should convert with dual_property', () => {
      const field: Schema.Field = {
        label: 'Related',
        type: 'relation',
        data_source_id: 'db-123',
        relation_type: 'dual_property',
        synced_property_id: 'prop-456',
        synced_property_name: 'Synced Prop',
      }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'relation',
        relation: {
          data_source_id: 'db-123',
          type: 'dual_property',
          dual_property: {
            synced_property_id: 'prop-456',
            synced_property_name: 'Synced Prop',
          },
        },
      })
    })
  })

  describe('rollup field', () => {
    it('should convert rollup field', () => {
      const field: Schema.Field = {
        label: 'Total',
        type: 'rollup',
        relation_property: 'Tasks',
        rollup_property: 'Hours',
        function: 'sum',
      }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'rollup',
        rollup: {
          relation_property_name: 'Tasks',
          relation_property_id: '',
          rollup_property_name: 'Hours',
          rollup_property_id: '',
          function: 'sum',
        },
      })
    })
  })

  describe('select field', () => {
    it('should convert select without options', () => {
      const field: Schema.Field = { label: 'Priority', type: 'select' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({ type: 'select', select: { options: [] } })
    })

    it('should convert select with array options', () => {
      const field: Schema.Field = { label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'select',
        select: {
          options: [
            { id: '', name: 'Low', color: 'default' },
            { id: '', name: 'Medium', color: 'default' },
            { id: '', name: 'High', color: 'default' },
          ],
        },
      })
    })

    it('should convert select with record options using string values', () => {
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: { low: 'Low', medium: 'Medium', high: 'High' },
      }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'select',
        select: {
          options: [
            { id: '', name: 'Low', color: 'default' },
            { id: '', name: 'Medium', color: 'default' },
            { id: '', name: 'High', color: 'default' },
          ],
        },
      })
    })

    it('should convert select with record options using object values', () => {
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: {
          low: { label: 'Low', color: 'green' },
          medium: { label: 'Medium', color: 'yellow' },
          high: { label: 'High', color: 'red' },
        },
      }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'select',
        select: {
          options: [
            { id: '', name: 'Low', color: 'green' },
            { id: '', name: 'Medium', color: 'yellow' },
            { id: '', name: 'High', color: 'red' },
          ],
        },
      })
    })

    it('should use key as label when label is not provided', () => {
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: { low: { color: 'green' } },
      }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'select',
        select: {
          options: [{ id: '', name: 'low', color: 'green' }],
        },
      })
    })
  })

  describe('multi_select field', () => {
    it('should convert multi_select without options', () => {
      const field: Schema.Field = { label: 'Tags', type: 'multi_select' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({ type: 'multi_select', multi_select: { options: [] } })
    })

    it('should convert multi_select with array options', () => {
      const field: Schema.Field = { label: 'Tags', type: 'multi_select', options: ['Frontend', 'Backend'] }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'multi_select',
        multi_select: {
          options: [
            { id: '', name: 'Frontend', color: 'default' },
            { id: '', name: 'Backend', color: 'default' },
          ],
        },
      })
    })

    it('should convert multi_select with record options', () => {
      const field: Schema.Field = {
        label: 'Tags',
        type: 'multi_select',
        options: {
          frontend: { label: 'Frontend', color: 'blue' },
          backend: { label: 'Backend', color: 'purple' },
        },
      }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'multi_select',
        multi_select: {
          options: [
            { id: '', name: 'Frontend', color: 'blue' },
            { id: '', name: 'Backend', color: 'purple' },
          ],
        },
      })
    })
  })

  describe('status field', () => {
    it('should convert status to empty object (status options are read-only in Notion API)', () => {
      const field: Schema.Field = { label: 'Status', type: 'status' }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({ type: 'status', status: {} })
    })

    it('should ignore groups when converting status (status options are read-only in Notion API)', () => {
      const field: Schema.Field = {
        label: 'Status',
        type: 'status',
        groups: {
          todo: { label: 'To Do', color: 'gray', options: ['Not Started', 'Blocked'] },
          inProgress: { label: 'In Progress', color: 'blue', options: ['Working'] },
          done: { label: 'Done', color: 'green', options: ['Completed'] },
        },
      }
      const result = toPropertyDefinition(field)
      expect(result).toMatchObject({
        type: 'status',
        status: {},
      })
    })
  })
})
