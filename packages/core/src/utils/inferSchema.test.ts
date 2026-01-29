import { inferSchema } from './inferSchema'

describe('inferSchema', () => {
  describe('title', () => {
    it('should infer title field', () => {
      const result = inferSchema({ Title: { id: 'title', name: 'Title', type: 'title', title: {} } })
      expect(result).toStrictEqual({ title: { label: 'Title', id: 'title', type: 'title' } })
    })
  })

  describe('rich_text', () => {
    it('should infer rich_text field', () => {
      const result = inferSchema({ Description: { id: 'desc', name: 'Description', type: 'rich_text', rich_text: {} } })
      expect(result).toStrictEqual({ description: { label: 'Description', id: 'desc', type: 'rich_text' } })
    })
  })

  describe('number', () => {
    it('should infer number field with format', () => {
      const result = inferSchema({ Price: { id: 'price', name: 'Price', type: 'number', number: { format: 'dollar' } } })
      expect(result).toStrictEqual({ price: { label: 'Price', id: 'price', type: 'number', format: 'dollar' } })
    })

    it('should infer number field with default format', () => {
      const result = inferSchema({ Count: { id: 'count', name: 'Count', type: 'number', number: { format: 'number' } } })
      expect(result).toStrictEqual({ count: { label: 'Count', id: 'count', type: 'number', format: 'number' } })
    })
  })

  describe('checkbox', () => {
    it('should infer checkbox field', () => {
      const result = inferSchema({ 'Is Active': { id: 'active', name: 'Is Active', type: 'checkbox', checkbox: {} } })
      expect(result).toStrictEqual({ isActive: { label: 'Is Active', id: 'active', type: 'checkbox' } })
    })
  })

  describe('date', () => {
    it('should infer date field', () => {
      const result = inferSchema({ 'Due Date': { id: 'due', name: 'Due Date', type: 'date', date: {} } })
      expect(result).toStrictEqual({ dueDate: { label: 'Due Date', id: 'due', type: 'date' } })
    })
  })

  describe('url', () => {
    it('should infer url field', () => {
      const result = inferSchema({ Website: { id: 'website', name: 'Website', type: 'url', url: {} } })
      expect(result).toStrictEqual({ website: { label: 'Website', id: 'website', type: 'url' } })
    })
  })

  describe('email', () => {
    it('should infer email field', () => {
      const result = inferSchema({ 'Email Address': { id: 'email', name: 'Email Address', type: 'email', email: {} } })
      expect(result).toStrictEqual({ emailAddress: { label: 'Email Address', id: 'email', type: 'email' } })
    })
  })

  describe('phone_number', () => {
    it('should infer phone_number field', () => {
      const result = inferSchema({ Phone: { id: 'phone', name: 'Phone', type: 'phone_number', phone_number: {} } })
      expect(result).toStrictEqual({ phone: { label: 'Phone', id: 'phone', type: 'phone_number' } })
    })
  })

  describe('people', () => {
    it('should infer people field', () => {
      const result = inferSchema({ Assignee: { id: 'assignee', name: 'Assignee', type: 'people', people: {} } })
      expect(result).toStrictEqual({ assignee: { label: 'Assignee', id: 'assignee', type: 'people' } })
    })
  })

  describe('files', () => {
    it('should infer files field', () => {
      const result = inferSchema({ Attachments: { id: 'attachments', name: 'Attachments', type: 'files', files: {} } })
      expect(result).toStrictEqual({ attachments: { label: 'Attachments', id: 'attachments', type: 'files' } })
    })
  })

  describe('select', () => {
    it('should infer select field with options', () => {
      const result = inferSchema({
        Priority: {
          id: 'priority',
          name: 'Priority',
          type: 'select',
          select: {
            options: [
              { id: 'opt1', name: 'High', color: 'red' },
              { id: 'opt2', name: 'Medium', color: 'yellow' },
              { id: 'opt3', name: 'Low', color: 'green' },
            ],
          },
        },
      })
      expect(result).toStrictEqual({
        priority: {
          label: 'Priority',
          id: 'priority',
          type: 'select',
          options: {
            high: { label: 'High', color: 'red', id: 'opt1' },
            medium: { label: 'Medium', color: 'yellow', id: 'opt2' },
            low: { label: 'Low', color: 'green', id: 'opt3' },
          },
        },
      })
    })

    it('should infer select field with empty options', () => {
      const result = inferSchema({ Status: { id: 'status', name: 'Status', type: 'select', select: { options: [] } } })
      expect(result).toStrictEqual({ status: { label: 'Status', id: 'status', type: 'select', options: [] } })
    })
  })

  describe('multi_select', () => {
    it('should infer multi_select field with options', () => {
      const result = inferSchema({
        Tags: {
          id: 'tags',
          name: 'Tags',
          type: 'multi_select',
          multi_select: {
            options: [
              { id: 'opt1', name: 'Frontend', color: 'blue' },
              { id: 'opt2', name: 'Backend', color: 'purple' },
            ],
          },
        },
      })
      expect(result).toStrictEqual({
        tags: {
          label: 'Tags',
          id: 'tags',
          type: 'multi_select',
          options: {
            frontend: { label: 'Frontend', color: 'blue', id: 'opt1' },
            backend: { label: 'Backend', color: 'purple', id: 'opt2' },
          },
        },
      })
    })
  })

  describe('status', () => {
    it('should infer status field with groups and options', () => {
      const result = inferSchema({
        Status: {
          id: 'status',
          name: 'Status',
          type: 'status',
          status: {
            options: [
              { id: 'todo', name: 'To Do', color: 'gray' },
              { id: 'inprogress', name: 'In Progress', color: 'blue' },
              { id: 'done', name: 'Done', color: 'green' },
            ],
            groups: [
              { id: 'notstarted', name: 'Not Started', color: 'gray', option_ids: ['todo'] },
              { id: 'active', name: 'Active', color: 'blue', option_ids: ['inprogress'] },
              { id: 'completed', name: 'Completed', color: 'green', option_ids: ['done'] },
            ],
          },
        },
      })
      expect(result).toStrictEqual({
        status: {
          label: 'Status',
          id: 'status',
          type: 'status',
          groups: {
            notStarted: {
              id: 'notstarted',
              label: 'Not Started',
              color: 'gray',
              options: { toDo: { id: 'todo', label: 'To Do', color: 'gray' } },
            },
            active: {
              id: 'active',
              label: 'Active',
              color: 'blue',
              options: { inProgress: { id: 'inprogress', label: 'In Progress', color: 'blue' } },
            },
            completed: {
              id: 'completed',
              label: 'Completed',
              color: 'green',
              options: { done: { id: 'done', label: 'Done', color: 'green' } },
            },
          },
        },
      })
    })
  })

  describe('formula', () => {
    it('should restore formula expression with block property references', () => {
      const databaseId = 'db-123'
      const result = inferSchema({
        'Quantity': { id: '~>s~', name: 'Quantity', type: 'number', number: { format: 'number' } },
        'Unit Price': { id: 'pdS}', name: 'Unit Price', type: 'number', number: { format: 'dollar' } },
        'Total': {
          id: 'total',
          name: 'Total',
          type: 'formula',
          formula: { expression: '{{notion:block_property:~%3Es~:db-123:page-456}} * {{notion:block_property:pdS%7D:db-123:page-456}}' },
        },
      }, databaseId)
      expect(result.total).toMatchObject({
        type: 'formula',
        expression: 'prop("quantity") * prop("unitPrice")',
      })
    })

    it('should preserve formula expression without database ID', () => {
      const result = inferSchema({
        Quantity: { id: '~>s~', name: 'Quantity', type: 'number', number: { format: 'number' } },
        Total: {
          id: 'total',
          name: 'Total',
          type: 'formula',
          formula: { expression: '{{notion:block_property:~%3Es~:db-123:page-456}}' },
        },
      })
      expect(result.total).toMatchObject({
        type: 'formula',
        expression: '{{notion:block_property:~%3Es~:db-123:page-456}}',
      })
    })
  })

  describe('relation', () => {
    it('should infer relation field with dual_property', () => {
      const result = inferSchema({
        Projects: {
          id: 'projects',
          name: 'Projects',
          type: 'relation',
          relation: {
            data_source_id: 'abc-123',
            type: 'dual_property',
            dual_property: {
              synced_property_id: 'def-456',
              synced_property_name: 'Tasks',
            },
          },
        },
      })
      expect(result).toStrictEqual({
        projects: {
          label: 'Projects',
          id: 'projects',
          type: 'relation',
          data_source_id: 'abc-123',
          relation_type: 'dual_property',
          synced_property_id: 'def-456',
          synced_property_name: 'Tasks',
        },
      })
    })

    it('should infer relation field with single_property', () => {
      const result = inferSchema({
        Category: {
          id: 'category',
          name: 'Category',
          type: 'relation',
          relation: {
            data_source_id: 'xyz-789',
            type: 'single_property',
            single_property: {},
          },
        },
      })
      expect(result).toStrictEqual({
        category: {
          label: 'Category',
          id: 'category',
          type: 'relation',
          data_source_id: 'xyz-789',
          relation_type: 'single_property',
        },
      })
    })
  })

  describe('rollup', () => {
    it('should infer rollup field', () => {
      const result = inferSchema({
        'Task Count': {
          id: 'taskcount',
          name: 'Task Count',
          type: 'rollup',
          rollup: {
            relation_property_name: 'Tasks',
            relation_property_id: 'tasks-id',
            rollup_property_name: 'Name',
            rollup_property_id: 'name-id',
            function: 'count',
          },
        },
      })
      expect(result).toStrictEqual({
        taskCount: {
          label: 'Task Count',
          id: 'taskcount',
          type: 'rollup',
          relation_property: 'Tasks',
          rollup_property: 'Name',
          function: 'count',
        },
      })
    })
  })

  describe('unique_id', () => {
    it('should infer unique_id field with prefix', () => {
      const result = inferSchema({ ID: { id: 'id', name: 'ID', type: 'unique_id', unique_id: { prefix: 'TASK' } } })
      expect(result).toStrictEqual({ id: { label: 'ID', id: 'id', type: 'unique_id', prefix: 'TASK' } })
    })

    it('should infer unique_id field with null prefix', () => {
      const result = inferSchema({ ID: { id: 'id', name: 'ID', type: 'unique_id', unique_id: { prefix: null } } })
      expect(result).toStrictEqual({ id: { label: 'ID', id: 'id', type: 'unique_id', prefix: undefined } })
    })
  })

  describe('created_time', () => {
    it('should infer created_time field', () => {
      const result = inferSchema({ 'Created At': { id: 'created', name: 'Created At', type: 'created_time', created_time: {} } })
      expect(result).toStrictEqual({ createdAt: { label: 'Created At', id: 'created', type: 'created_time' } })
    })
  })

  describe('created_by', () => {
    it('should infer created_by field', () => {
      const result = inferSchema({ 'Created By': { id: 'createdby', name: 'Created By', type: 'created_by', created_by: {} } })
      expect(result).toStrictEqual({ createdBy: { label: 'Created By', id: 'createdby', type: 'created_by' } })
    })
  })

  describe('last_edited_time', () => {
    it('should infer last_edited_time field', () => {
      const result = inferSchema({ 'Last Edited': { id: 'edited', name: 'Last Edited', type: 'last_edited_time', last_edited_time: {} } })
      expect(result).toStrictEqual({ lastEdited: { label: 'Last Edited', id: 'edited', type: 'last_edited_time' } })
    })
  })

  describe('last_edited_by', () => {
    it('should infer last_edited_by field', () => {
      const result = inferSchema({ 'Last Editor': { id: 'editor', name: 'Last Editor', type: 'last_edited_by', last_edited_by: {} } })
      expect(result).toStrictEqual({ lastEditor: { label: 'Last Editor', id: 'editor', type: 'last_edited_by' } })
    })
  })

  describe('key generation', () => {
    it('should convert multi-word labels to camelCase keys', () => {
      const result = inferSchema({ 'My Long Property Name': { id: 'prop', name: 'My Long Property Name', type: 'rich_text', rich_text: {} } })
      expect(result).toHaveProperty('myLongPropertyName')
    })

    it('should strip special characters from keys', () => {
      const result = inferSchema({ 'Price ($)': { id: 'price', name: 'Price ($)', type: 'number', number: { format: 'dollar' } } })
      expect(result).toHaveProperty('price')
    })
  })

  describe('id decoding', () => {
    it('should decode percent-encoded property IDs from property definitions', () => {
      const result = inferSchema({ 'Special Prop': { id: 'special%20prop%21', name: 'Special Prop', type: 'rich_text', rich_text: {} } })
      expect(result).toHaveProperty('specialProp')
      expect(result.specialProp.id).toBe('special prop!')
    })

    it('should decode percent-encoded option IDs in select fields', () => {
      const result = inferSchema({
        Category: {
          id: 'category',
          name: 'Category',
          type: 'select',
          select: {
            options: [
              { id: 'option%201', name: 'Option 1', color: 'red' },
              { id: 'option%202', name: 'Option 2', color: 'blue' },
            ],
          },
        },
      })
      expect(result).toHaveProperty('category')
      expect(result.category).toMatchObject({
        options: {
          option1: { id: 'option 1' },
          option2: { id: 'option 2' },
        },
      })
    })

    it('should decode percent-encoded option IDs in multi_select fields', () => {
      const result = inferSchema({
        Tags: {
          id: 'tags',
          name: 'Tags',
          type: 'multi_select',
          multi_select: {
            options: [
              { id: 'tag%201', name: 'Tag 1', color: 'green' },
              { id: 'tag%202', name: 'Tag 2', color: 'yellow' },
            ],
          },
        },
      })
      expect(result).toHaveProperty('tags')
      expect(result.tags).toMatchObject({
        options: {
          tag1: { id: 'tag 1' },
          tag2: { id: 'tag 2' },
        },
      })
    })

    it('should decode percent-encoded option and group IDs in status fields', () => {
      const result = inferSchema({
        Status: {
          id: 'status',
          name: 'Status',
          type: 'status',
          status: {
            options: [
              { id: 'option%201', name: 'Option 1', color: 'red' },
              { id: 'option%202', name: 'Option 2', color: 'blue' },
            ],
            groups: [
              { id: 'group%201', name: 'Group 1', color: 'gray', option_ids: ['option%201'] },
              { id: 'group%202', name: 'Group 2', color: 'red', option_ids: ['option%202'] },
            ],
          },
        },
      })
      expect(result).toHaveProperty('status')
      expect(result.status).toMatchObject({
        groups: {
          group1: {
            id: 'group 1',
            options: {
              option1: { id: 'option 1' },
            },
          },
          group2: {
            id: 'group 2',
            options: {
              option2: { id: 'option 2' },
            },
          },
        },
      })
    })
  })
})
