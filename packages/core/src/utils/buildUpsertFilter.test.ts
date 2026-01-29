import type { Schema } from '@/types'
import { buildUpsertFilter } from './buildUpsertFilter'

describe('buildUpsertFilter', () => {
  it('should build a title filter', () => {
    const schema = {
      name: { label: 'Name', type: 'title' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['name'], { name: 'Test' })

    expect(result).toEqual({
      property: 'Name',
      title: { equals: 'Test' },
    })
  })

  it('should build a rich_text filter', () => {
    const schema = {
      description: { label: 'Description', type: 'rich_text' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['description'], { description: 'Some text' })

    expect(result).toEqual({
      property: 'Description',
      rich_text: { equals: 'Some text' },
    })
  })

  it('should build a number filter', () => {
    const schema = {
      age: { label: 'Age', type: 'number' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['age'], { age: 25 })

    expect(result).toEqual({
      property: 'Age',
      number: { equals: 25 },
    })
  })

  it('should build a checkbox filter', () => {
    const schema = {
      active: { label: 'Active', type: 'checkbox' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['active'], { active: true })

    expect(result).toEqual({
      property: 'Active',
      checkbox: { equals: true },
    })
  })

  it('should build a select filter', () => {
    const schema = {
      status: { label: 'Status', type: 'select' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['status'], { status: 'Active' })

    expect(result).toEqual({
      property: 'Status',
      select: { equals: 'Active' },
    })
  })

  it('should build a status filter', () => {
    const schema = {
      progress: { label: 'Progress', type: 'status' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['progress'], { progress: 'In Progress' })

    expect(result).toEqual({
      property: 'Progress',
      status: { equals: 'In Progress' },
    })
  })

  it('should build a url filter with URL object', () => {
    const schema = {
      website: { label: 'Website', type: 'url' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['website'], { website: new URL('https://example.com') })

    expect(result).toEqual({
      property: 'Website',
      rich_text: { equals: 'https://example.com/' },
    })
  })

  it('should build a compound AND filter for multiple properties', () => {
    const schema = {
      name: { label: 'Name', type: 'title' },
      email: { label: 'Email', type: 'email' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['name', 'email'], {
      name: 'John',
      email: 'john@example.com',
    })

    expect(result).toEqual({
      and: [
        { property: 'Name', title: { equals: 'John' } },
        { property: 'Email', rich_text: { equals: 'john@example.com' } },
      ],
    })
  })

  it('should throw for unsupported property types', () => {
    const schema = {
      tags: { label: 'Tags', type: 'multi_select' },
    } as const satisfies Schema.Definition

    expect(() => buildUpsertFilter(schema, ['tags'], { tags: ['a', 'b'] }))
      .toThrow('Property type "multi_select" is not supported for upsert matching.')
  })

  it('should throw for unknown properties', () => {
    const schema = {
      name: { label: 'Name', type: 'title' },
    } as const satisfies Schema.Definition

    expect(() => buildUpsertFilter(schema, ['unknown' as keyof Schema.InferRecord<typeof schema>], {}))
      .toThrow('Property "unknown" not found in schema.')
  })

  it('should handle undefined values as empty strings for text types', () => {
    const schema = {
      name: { label: 'Name', type: 'title' },
    } as const satisfies Schema.Definition

    const result = buildUpsertFilter(schema, ['name'], {})

    expect(result).toEqual({
      property: 'Name',
      title: { equals: '' },
    })
  })
})
