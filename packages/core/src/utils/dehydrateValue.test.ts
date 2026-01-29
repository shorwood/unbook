import type { Schema } from '@/types'
import { dehydrateValue } from './dehydrateValue'

describe('dehydrateValue', () => {
  describe('title', () => {
    it('should convert string to rich text', () => {
      const field: Schema.Field = { label: 'Name', type: 'title' }
      const result = dehydrateValue(field, 'Hello World')
      expect(result).toMatchObject({
        type: 'title',
        title: [{ type: 'text', text: { content: 'Hello World' } }],
      })
    })
  })

  describe('rich_text', () => {
    it('should convert string to rich text', () => {
      const field: Schema.Field = { label: 'Description', type: 'rich_text' }
      const result = dehydrateValue(field, 'Some text')
      expect(result).toMatchObject({
        type: 'rich_text',
        rich_text: [{ type: 'text', text: { content: 'Some text' } }],
      })
    })
  })

  describe('number', () => {
    it('should pass through number value', () => {
      const field: Schema.Field = { label: 'Count', type: 'number' }
      const result = dehydrateValue(field, 42)
      expect(result).toMatchObject({ type: 'number', number: 42 })
    })

    it('should pass through null value', () => {
      const field: Schema.Field = { label: 'Count', type: 'number' }
      const result = dehydrateValue(field, null)
      expect(result).toMatchObject({ type: 'number', number: null })
    })
  })

  describe('checkbox', () => {
    it('should pass through boolean value', () => {
      const field: Schema.Field = { label: 'Active', type: 'checkbox' }
      const result = dehydrateValue(field, true)
      expect(result).toMatchObject({ type: 'checkbox', checkbox: true })
    })
  })

  describe('url', () => {
    it('should pass through url value', () => {
      const field: Schema.Field = { label: 'Website', type: 'url' }
      const result = dehydrateValue(field, 'https://example.com')
      expect(result).toMatchObject({ type: 'url', url: 'https://example.com' })
    })
  })

  describe('email', () => {
    it('should pass through email value', () => {
      const field: Schema.Field = { label: 'Email', type: 'email' }
      const result = dehydrateValue(field, 'test@example.com')
      expect(result).toMatchObject({ type: 'email', email: 'test@example.com' })
    })
  })

  describe('phone_number', () => {
    it('should pass through phone number value', () => {
      const field: Schema.Field = { label: 'Phone', type: 'phone_number' }
      const result = dehydrateValue(field, '+1234567890')
      expect(result).toMatchObject({ type: 'phone_number', phone_number: '+1234567890' })
    })
  })

  describe('date', () => {
    it('should pass through date object', () => {
      const field: Schema.Field = { label: 'Due Date', type: 'date' }
      const dateValue = { start: '2024-01-15', end: '2024-01-20' }
      const result = dehydrateValue(field, dateValue)
      expect(result).toMatchObject({ type: 'date', date: dateValue })
    })
  })

  describe('relation', () => {
    it('should convert array of ids to relation objects', () => {
      const field: Schema.Field = { label: 'Related', type: 'relation', data_source_id: 'db-123' }
      const result = dehydrateValue(field, ['id-1', 'id-2'])
      expect(result).toMatchObject({
        type: 'relation',
        relation: [{ id: 'id-1' }, { id: 'id-2' }],
        has_more: false,
      })
    })
  })

  describe('people', () => {
    it('should convert array of ids to user references', () => {
      const field: Schema.Field = { label: 'Assignees', type: 'people' }
      const result = dehydrateValue(field, ['user-1', 'user-2'])
      expect(result).toMatchObject({
        type: 'people',
        people: [
          { object: 'user', id: 'user-1' },
          { object: 'user', id: 'user-2' },
        ],
      })
    })
  })

  describe('select', () => {
    it('should return null select when value is falsy', () => {
      const field: Schema.Field = { label: 'Priority', type: 'select' }
      const result = dehydrateValue(field, null)
      expect(result).toMatchObject({ type: 'select', select: null })
    })

    it('should pass through value as name when no options defined', () => {
      const field: Schema.Field = { label: 'Priority', type: 'select' }
      const result = dehydrateValue(field, 'High')
      expect(result).toMatchObject({ type: 'select', select: { name: 'High' } })
    })

    it('should translate key to name with array options', () => {
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: ['Low', 'Medium', 'High'],
      }
      const result = dehydrateValue(field, 'High')
      expect(result).toMatchObject({ type: 'select', select: { name: 'High' } })
    })

    it('should translate key to name with record options using string values', () => {
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: { low: 'Low Priority', medium: 'Medium Priority', high: 'High Priority' },
      }
      const result = dehydrateValue(field, 'high')
      expect(result).toMatchObject({ type: 'select', select: { name: 'High Priority' } })
    })

    it('should translate key to name with record options using object values', () => {
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: {
          low: { label: 'Low Priority', color: 'green' },
          high: { label: 'High Priority', color: 'red' },
        },
      }
      const result = dehydrateValue(field, 'low')
      expect(result).toMatchObject({ type: 'select', select: { name: 'Low Priority' } })
    })

    it('should use key as name when label is not provided', () => {
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: { low: { color: 'green' } },
      }
      const result = dehydrateValue(field, 'low')
      expect(result).toMatchObject({ type: 'select', select: { name: 'low' } })
    })

    it('should pass through unknown key as name', () => {
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: { low: 'Low', high: 'High' },
      }
      const result = dehydrateValue(field, 'unknown')
      expect(result).toMatchObject({ type: 'select', select: { name: 'unknown' } })
    })
  })

  describe('multi_select', () => {
    it('should pass through values as names when no options defined', () => {
      const field: Schema.Field = { label: 'Tags', type: 'multi_select' }
      const result = dehydrateValue(field, ['Frontend', 'Backend'])
      expect(result).toMatchObject({
        type: 'multi_select',
        multi_select: [{ name: 'Frontend' }, { name: 'Backend' }],
      })
    })

    it('should translate keys to names with record options', () => {
      const field: Schema.Field = {
        label: 'Tags',
        type: 'multi_select',
        options: {
          frontend: { label: 'Frontend', color: 'blue' },
          backend: { label: 'Backend', color: 'purple' },
        },
      }
      const result = dehydrateValue(field, ['frontend', 'backend'])
      expect(result).toMatchObject({
        type: 'multi_select',
        multi_select: [{ name: 'Frontend' }, { name: 'Backend' }],
      })
    })

    it('should handle mix of known and unknown keys', () => {
      const field: Schema.Field = {
        label: 'Tags',
        type: 'multi_select',
        options: { frontend: 'Frontend' },
      }
      const result = dehydrateValue(field, ['frontend', 'unknown'])
      expect(result).toMatchObject({
        type: 'multi_select',
        multi_select: [{ name: 'Frontend' }, { name: 'unknown' }],
      })
    })
  })

  describe('status', () => {
    it('should return null status when value is falsy', () => {
      const field: Schema.Field = { label: 'Status', type: 'status' }
      const result = dehydrateValue(field, null)
      expect(result).toMatchObject({ type: 'status', status: null })
    })

    it('should pass through value as name when no groups defined', () => {
      const field: Schema.Field = { label: 'Status', type: 'status' }
      const result = dehydrateValue(field, 'In Progress')
      expect(result).toMatchObject({ type: 'status', status: { name: 'In Progress' } })
    })

    it('should translate array option key to name with status groups', () => {
      const field: Schema.Field = {
        label: 'Status',
        type: 'status',
        groups: {
          todo: { label: 'To Do', color: 'gray', options: ['Not Started', 'Blocked'] },
        },
      }
      const result = dehydrateValue(field, 'Not Started')
      expect(result).toMatchObject({ type: 'status', status: { name: 'Not Started' } })
    })

    it('should translate record string option key to name with status groups', () => {
      const field: Schema.Field = {
        label: 'Status',
        type: 'status',
        groups: {
          inProgress: { label: 'In Progress', color: 'blue', options: { working: 'Working on it' } },
        },
      }
      const result = dehydrateValue(field, 'working')
      expect(result).toMatchObject({ type: 'status', status: { name: 'Working on it' } })
    })

    it('should translate record object option key to name with status groups', () => {
      const field: Schema.Field = {
        label: 'Status',
        type: 'status',
        groups: {
          done: { label: 'Done', color: 'green', options: { completed: { label: 'Completed' } } },
        },
      }
      const result = dehydrateValue(field, 'completed')
      expect(result).toMatchObject({ type: 'status', status: { name: 'Completed' } })
    })
  })

  describe('unsupported', () => {
    it('should return undefined for formula', () => {
      const field: Schema.Field = { label: 'Calc', type: 'formula', expression: '1+1' }
      const result = dehydrateValue(field, 'anything')
      expect(result).toBeUndefined()
    })

    it('should return undefined for rollup', () => {
      const field: Schema.Field = {
        label: 'Sum',
        type: 'rollup',
        relation_property: 'Tasks',
        rollup_property: 'Hours',
        function: 'sum',
      }
      const result = dehydrateValue(field, 'anything')
      expect(result).toBeUndefined()
    })

    it('should return undefined for created_time', () => {
      const field: Schema.Field = { label: 'Created', type: 'created_time' }
      const result = dehydrateValue(field, 'anything')
      expect(result).toBeUndefined()
    })

    it('should return undefined for created_by', () => {
      const field: Schema.Field = { label: 'Creator', type: 'created_by' }
      const result = dehydrateValue(field, 'anything')
      expect(result).toBeUndefined()
    })

    it('should return undefined for last_edited_time', () => {
      const field: Schema.Field = { label: 'Updated', type: 'last_edited_time' }
      const result = dehydrateValue(field, 'anything')
      expect(result).toBeUndefined()
    })

    it('should return undefined for last_edited_by', () => {
      const field: Schema.Field = { label: 'Editor', type: 'last_edited_by' }
      const result = dehydrateValue(field, 'anything')
      expect(result).toBeUndefined()
    })

    it('should return undefined for unique_id', () => {
      const field: Schema.Field = { label: 'ID', type: 'unique_id' }
      const result = dehydrateValue(field, 'anything')
      expect(result).toBeUndefined()
    })

    it('should return undefined for files', () => {
      const field: Schema.Field = { label: 'Attachments', type: 'files' }
      const result = dehydrateValue(field, 'anything')
      expect(result).toBeUndefined()
    })
  })
})
