import type { Property, Schema } from '@/types'
import { hydrateValue } from './hydrateValue'

function createRichText(plain_text: string): Property.Value.RichText {
  return {
    id: 'test-id',
    type: 'rich_text',
    rich_text: [{
      type: 'text',
      text: { content: plain_text, link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text,
      href: null,
    }],
  }
}

function createTitle(plain_text: string): Property.Value.Title {
  return {
    id: 'test-id',
    type: 'title',
    title: [{
      type: 'text',
      text: { content: plain_text, link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text,
      href: null,
    }],
  }
}

describe('hydrateValue', () => {

  describe('title field', () => {
    it('should extract plain text from title', () => {
      const property = createTitle('Hello World')
      const field: Schema.Field = { label: 'Name', type: 'title' }
      const result = hydrateValue(property, field)
      expect(result).toBe('Hello World')
    })

    it('should join multiple text segments', () => {
      const property: Property.Value.Title = {
        id: 'test-id',
        type: 'title',
        title: [
          { type: 'text', text: { content: 'Hello ', link: null }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, plain_text: 'Hello ', href: null },
          { type: 'text', text: { content: 'World', link: null }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, plain_text: 'World', href: null },
        ],
      }
      const field: Schema.Field = { label: 'Name', type: 'title' }
      const result = hydrateValue(property, field)
      expect(result).toBe('Hello World')
    })
  })

  describe('rich_text field', () => {
    it('should extract plain text from rich_text', () => {
      const property = createRichText('Some description')
      const field: Schema.Field = { label: 'Description', type: 'rich_text' }
      const result = hydrateValue(property, field)
      expect(result).toBe('Some description')
    })
  })

  describe('number field', () => {
    it('should extract number value', () => {
      const property: Property.Value.Number = { id: 'test-id', type: 'number', number: 42 }
      const field: Schema.Field = { label: 'Count', type: 'number' }
      const result = hydrateValue(property, field)
      expect(result).toBe(42)
    })

    it('should return null for null number', () => {
      const property: Property.Value.Number = { id: 'test-id', type: 'number', number: null }
      const field: Schema.Field = { label: 'Count', type: 'number' }
      const result = hydrateValue(property, field)
      expect(result).toBeNull()
    })
  })

  describe('checkbox field', () => {
    it('should extract boolean value', () => {
      const property: Property.Value.Checkbox = { id: 'test-id', type: 'checkbox', checkbox: true }
      const field: Schema.Field = { label: 'Active', type: 'checkbox' }
      const result = hydrateValue(property, field)
      expect(result).toBe(true)
    })
  })

  describe('url field', () => {
    it('should extract url value', () => {
      const property: Property.Value.Url = { id: 'test-id', type: 'url', url: 'https://example.com' }
      const field: Schema.Field = { label: 'Website', type: 'url' }
      const result = hydrateValue(property, field)
      expect(result).toBe('https://example.com')
    })
  })

  describe('email field', () => {
    it('should extract email value', () => {
      const property: Property.Value.Email = { id: 'test-id', type: 'email', email: 'test@example.com' }
      const field: Schema.Field = { label: 'Email', type: 'email' }
      const result = hydrateValue(property, field)
      expect(result).toBe('test@example.com')
    })
  })

  describe('phone_number field', () => {
    it('should extract phone number value', () => {
      const property: Property.Value.PhoneNumber = { id: 'test-id', type: 'phone_number', phone_number: '+1234567890' }
      const field: Schema.Field = { label: 'Phone', type: 'phone_number' }
      const result = hydrateValue(property, field)
      expect(result).toBe('+1234567890')
    })
  })

  describe('date field', () => {
    it('should extract date object', () => {
      const dateValue = { start: '2024-01-15', end: '2024-01-20', time_zone: null }
      const property: Property.Value.Date = { id: 'test-id', type: 'date', date: dateValue }
      const field: Schema.Field = { label: 'Due Date', type: 'date' }
      const result = hydrateValue(property, field)
      expect(result).toEqual(dateValue)
    })
  })

  describe('created_time field', () => {
    it('should extract created_time value', () => {
      const property: Property.Value.CreatedTime = { id: 'test-id', type: 'created_time', created_time: '2024-01-15T10:00:00.000Z' }
      const field: Schema.Field = { label: 'Created', type: 'created_time' }
      const result = hydrateValue(property, field)
      expect(result).toBe('2024-01-15T10:00:00.000Z')
    })
  })

  describe('last_edited_time field', () => {
    it('should extract last_edited_time value', () => {
      const property: Property.Value.LastEditedTime = { id: 'test-id', type: 'last_edited_time', last_edited_time: '2024-01-20T15:30:00.000Z' }
      const field: Schema.Field = { label: 'Updated', type: 'last_edited_time' }
      const result = hydrateValue(property, field)
      expect(result).toBe('2024-01-20T15:30:00.000Z')
    })
  })

  describe('created_by field', () => {
    it('should extract user id', () => {
      const property: Property.Value.CreatedBy = { id: 'test-id', type: 'created_by', created_by: { object: 'user', id: 'user-123' } }
      const field: Schema.Field = { label: 'Creator', type: 'created_by' }
      const result = hydrateValue(property, field)
      expect(result).toBe('user-123')
    })
  })

  describe('last_edited_by field', () => {
    it('should extract user id', () => {
      const property: Property.Value.LastEditedBy = { id: 'test-id', type: 'last_edited_by', last_edited_by: { object: 'user', id: 'user-456' } }
      const field: Schema.Field = { label: 'Editor', type: 'last_edited_by' }
      const result = hydrateValue(property, field)
      expect(result).toBe('user-456')
    })
  })

  describe('unique_id field', () => {
    it('should format unique_id with prefix', () => {
      const property: Property.Value.UniqueId = { id: 'test-id', type: 'unique_id', unique_id: { prefix: 'TASK', number: 123 } }
      const field: Schema.Field = { label: 'ID', type: 'unique_id' }
      const result = hydrateValue(property, field)
      expect(result).toBe('TASK-123')
    })

    it('should format unique_id without prefix', () => {
      const property: Property.Value.UniqueId = { id: 'test-id', type: 'unique_id', unique_id: { prefix: null, number: 456 } }
      const field: Schema.Field = { label: 'ID', type: 'unique_id' }
      const result = hydrateValue(property, field)
      expect(result).toBe('456')
    })
  })

  describe('relation field', () => {
    it('should extract array of relation ids', () => {
      const property: Property.Value.Relation = { id: 'test-id', type: 'relation', relation: [{ id: 'page-1' }, { id: 'page-2' }], has_more: false }
      const field: Schema.Field = { label: 'Related', type: 'relation', data_source_id: 'db-123' }
      const result = hydrateValue(property, field)
      expect(result).toEqual(['page-1', 'page-2'])
    })
  })

  describe('people field', () => {
    it('should extract array of user ids', () => {
      const property: Property.Value.People = { id: 'test-id', type: 'people', people: [{ object: 'user', id: 'user-1' }, { object: 'user', id: 'user-2' }] }
      const field: Schema.Field = { label: 'Assignees', type: 'people' }
      const result = hydrateValue(property, field)
      expect(result).toEqual(['user-1', 'user-2'])
    })
  })

  describe('files field', () => {
    it('should extract array of file urls', () => {
      const property: Property.Value.Files = {
        id: 'test-id',
        type: 'files',
        files: [
          { type: 'external', name: 'file1.pdf', external: { url: 'https://example.com/file1.pdf' } },
          { type: 'file', name: 'file2.pdf', file: { url: 'https://s3.example.com/file2.pdf', expiry_time: '2024-01-20T00:00:00.000Z' } },
        ],
      }
      const field: Schema.Field = { label: 'Attachments', type: 'files' }
      const result = hydrateValue(property, field)
      expect(result).toEqual(['https://example.com/file1.pdf', 'https://s3.example.com/file2.pdf'])
    })
  })

  describe('formula field', () => {
    it('should extract string formula result', () => {
      const property: Property.Value.Formula = { id: 'test-id', type: 'formula', formula: { type: 'string', string: 'result' } }
      const field: Schema.Field = { label: 'Calc', type: 'formula', expression: '"result"' }
      const result = hydrateValue(property, field)
      expect(result).toBe('result')
    })

    it('should extract number formula result', () => {
      const property: Property.Value.Formula = { id: 'test-id', type: 'formula', formula: { type: 'number', number: 42 } }
      const field: Schema.Field = { label: 'Calc', type: 'formula', expression: '21*2' }
      const result = hydrateValue(property, field)
      expect(result).toBe(42)
    })

    it('should extract boolean formula result', () => {
      const property: Property.Value.Formula = { id: 'test-id', type: 'formula', formula: { type: 'boolean', boolean: true } }
      const field: Schema.Field = { label: 'Calc', type: 'formula', expression: 'true' }
      const result = hydrateValue(property, field)
      expect(result).toBe(true)
    })

    it('should extract date formula result', () => {
      const dateValue = { start: '2024-01-15', end: null, time_zone: null }
      const property: Property.Value.Formula = { id: 'test-id', type: 'formula', formula: { type: 'date', date: dateValue } }
      const field: Schema.Field = { label: 'Calc', type: 'formula', expression: 'now()' }
      const result = hydrateValue(property, field)
      expect(result).toEqual(dateValue)
    })
  })

  describe('rollup field', () => {
    it('should extract number rollup result', () => {
      const property: Property.Value.Rollup = { id: 'test-id', type: 'rollup', rollup: { type: 'number', number: 100, function: 'sum' } }
      const field: Schema.Field = { label: 'Total', type: 'rollup', relation_property: 'Tasks', rollup_property: 'Hours', function: 'sum' }
      const result = hydrateValue(property, field)
      expect(result).toBe(100)
    })

    it('should extract date rollup result', () => {
      const dateValue = { start: '2024-01-15', end: null, time_zone: null }
      const property: Property.Value.Rollup = { id: 'test-id', type: 'rollup', rollup: { type: 'date', date: dateValue, function: 'latest_date' } }
      const field: Schema.Field = { label: 'Latest', type: 'rollup', relation_property: 'Tasks', rollup_property: 'Due', function: 'latest_date' }
      const result = hydrateValue(property, field)
      expect(result).toEqual(dateValue)
    })

    it('should extract array rollup result with raw values', () => {
      const property: Property.Value.Rollup = {
        id: 'test-id',
        type: 'rollup',
        rollup: {
          type: 'array',
          function: 'show_original',
          array: [
            { id: 'p1', type: 'number', number: 10 },
            { id: 'p2', type: 'number', number: 20 },
          ],
        },
      }
      const field: Schema.Field = { label: 'All', type: 'rollup', relation_property: 'Tasks', rollup_property: 'Hours', function: 'show_original' }
      const result = hydrateValue(property, field)
      expect(result).toEqual([10, 20])
    })
  })

  describe('select field', () => {
    it('should return undefined for null select', () => {
      const property: Property.Value.Select = { id: 'test-id', type: 'select', select: null }
      const field: Schema.Field = { label: 'Priority', type: 'select' }
      const result = hydrateValue(property, field)
      expect(result).toBeUndefined()
    })

    it('should return name when no options defined', () => {
      const property: Property.Value.Select = { id: 'test-id', type: 'select', select: { id: 'opt-1', name: 'High', color: 'red' } }
      const field: Schema.Field = { label: 'Priority', type: 'select' }
      const result = hydrateValue(property, field)
      expect(result).toBe('High')
    })

    it('should return name when using array options', () => {
      const property: Property.Value.Select = { id: 'test-id', type: 'select', select: { id: 'opt-1', name: 'High', color: 'red' } }
      const field: Schema.Field = { label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] }
      const result = hydrateValue(property, field)
      expect(result).toBe('High')
    })

    it('should translate name to key with record options using string values', () => {
      const property: Property.Value.Select = { id: 'test-id', type: 'select', select: { id: 'opt-1', name: 'High Priority', color: 'red' } }
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: { low: 'Low Priority', medium: 'Medium Priority', high: 'High Priority' },
      }
      const result = hydrateValue(property, field)
      expect(result).toBe('high')
    })

    it('should translate name to key with record options using object values', () => {
      const property: Property.Value.Select = { id: 'test-id', type: 'select', select: { id: 'opt-1', name: 'Low Priority', color: 'green' } }
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: {
          low: { label: 'Low Priority', color: 'green' },
          high: { label: 'High Priority', color: 'red' },
        },
      }
      const result = hydrateValue(property, field)
      expect(result).toBe('low')
    })

    it('should use key when label matches key', () => {
      const property: Property.Value.Select = { id: 'test-id', type: 'select', select: { id: 'opt-1', name: 'low', color: 'green' } }
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: { low: { color: 'green' } },
      }
      const result = hydrateValue(property, field)
      expect(result).toBe('low')
    })

    it('should return name for unknown option', () => {
      const property: Property.Value.Select = { id: 'test-id', type: 'select', select: { id: 'opt-1', name: 'Unknown', color: 'gray' } }
      const field: Schema.Field = {
        label: 'Priority',
        type: 'select',
        options: { low: 'Low', high: 'High' },
      }
      const result = hydrateValue(property, field)
      expect(result).toBe('Unknown')
    })
  })

  describe('multi_select field', () => {
    it('should return names when no options defined', () => {
      const property: Property.Value.MultiSelect = {
        id: 'test-id',
        type: 'multi_select',
        multi_select: [
          { id: 'opt-1', name: 'Frontend', color: 'blue' },
          { id: 'opt-2', name: 'Backend', color: 'purple' },
        ],
      }
      const field: Schema.Field = { label: 'Tags', type: 'multi_select' }
      const result = hydrateValue(property, field)
      expect(result).toEqual(['Frontend', 'Backend'])
    })

    it('should translate names to keys with record options', () => {
      const property: Property.Value.MultiSelect = {
        id: 'test-id',
        type: 'multi_select',
        multi_select: [
          { id: 'opt-1', name: 'Frontend Dev', color: 'blue' },
          { id: 'opt-2', name: 'Backend Dev', color: 'purple' },
        ],
      }
      const field: Schema.Field = {
        label: 'Tags',
        type: 'multi_select',
        options: {
          frontend: { label: 'Frontend Dev', color: 'blue' },
          backend: { label: 'Backend Dev', color: 'purple' },
        },
      }
      const result = hydrateValue(property, field)
      expect(result).toEqual(['frontend', 'backend'])
    })

    it('should handle mix of known and unknown options', () => {
      const property: Property.Value.MultiSelect = {
        id: 'test-id',
        type: 'multi_select',
        multi_select: [
          { id: 'opt-1', name: 'Frontend Dev', color: 'blue' },
          { id: 'opt-2', name: 'Unknown Tag', color: 'gray' },
        ],
      }
      const field: Schema.Field = {
        label: 'Tags',
        type: 'multi_select',
        options: { frontend: 'Frontend Dev' },
      }
      const result = hydrateValue(property, field)
      expect(result).toEqual(['frontend', 'Unknown Tag'])
    })
  })

  describe('status field', () => {
    it('should return undefined for null status', () => {
      const property: Property.Value.Status = { id: 'test-id', type: 'status', status: null }
      const field: Schema.Field = { label: 'Status', type: 'status' }
      const result = hydrateValue(property, field)
      expect(result).toBeUndefined()
    })

    it('should return name when no groups defined', () => {
      const property: Property.Value.Status = { id: 'test-id', type: 'status', status: { id: 'opt-1', name: 'In Progress', color: 'blue' } }
      const field: Schema.Field = { label: 'Status', type: 'status' }
      const result = hydrateValue(property, field)
      expect(result).toBe('In Progress')
    })

    it('should translate name to key with status groups', () => {
      const property: Property.Value.Status = { id: 'test-id', type: 'status', status: { id: 'opt-1', name: 'Working on it', color: 'blue' } }
      const field: Schema.Field = {
        label: 'Status',
        type: 'status',
        groups: {
          todo: { label: 'To Do', color: 'gray', options: ['Not Started'] },
          inProgress: { label: 'In Progress', color: 'blue', options: { working: 'Working on it' } },
          done: { label: 'Done', color: 'green', options: { completed: { label: 'Completed' } } },
        },
      }
      const result = hydrateValue(property, field)
      expect(result).toBe('working')
    })

    it('should handle array options in status groups', () => {
      const property: Property.Value.Status = { id: 'test-id', type: 'status', status: { id: 'opt-1', name: 'Not Started', color: 'gray' } }
      const field: Schema.Field = {
        label: 'Status',
        type: 'status',
        groups: {
          todo: { label: 'To Do', color: 'gray', options: ['Not Started', 'Blocked'] },
        },
      }
      const result = hydrateValue(property, field)
      expect(result).toBe('Not Started')
    })

    it('should return name for unknown status', () => {
      const property: Property.Value.Status = { id: 'test-id', type: 'status', status: { id: 'opt-1', name: 'Unknown Status', color: 'gray' } }
      const field: Schema.Field = {
        label: 'Status',
        type: 'status',
        groups: {
          todo: { label: 'To Do', color: 'gray', options: ['Not Started'] },
        },
      }
      const result = hydrateValue(property, field)
      expect(result).toBe('Unknown Status')
    })
  })
})
