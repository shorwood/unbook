import type { Adapter } from '@/adapter'
import type { BlockObject, DatabaseObject, DataSourceObject, PageObject } from '@/types'
import { Block, Database, DataSource, Page } from '@/entities'
import { entityToParent } from './entityToParent'

const MOCK_ADAPTER = {} as Adapter
const MOCK_BLOCK = { id: 'block-123' } as BlockObject
const MOCK_PAGE = { id: 'page-123' } as PageObject
const MOCK_DATA_SOURCE = { id: 'datasource-123' } as DataSourceObject
const MOCK_DATABASE = { id: 'database-123' } as DatabaseObject

describe('entityToParent', () => {
  describe('Block', () => {
    it('should convert Block entity to ParentObject.Block', () => {
      const block = new Block(MOCK_ADAPTER, MOCK_BLOCK)
      const result = entityToParent(block)
      expect(result).toMatchObject({
        type: 'block_id',
        block_id: 'block-123',
      })
    })
  })

  describe('Page', () => {
    it('should convert Page entity to ParentObject.Page', () => {
      const page = new Page(MOCK_ADAPTER, MOCK_PAGE)
      const result = entityToParent(page)
      expect(result).toMatchObject({
        type: 'page_id',
        page_id: 'page-123',
      })
    })
  })

  describe('DataSource', () => {
    it('should convert DataSource entity to ParentObject.DataSource', () => {
      const dataSource = new DataSource(MOCK_ADAPTER, MOCK_DATA_SOURCE)
      const result = entityToParent(dataSource)
      expect(result).toMatchObject({
        type: 'data_source_id',
        data_source_id: 'datasource-123',
      })
    })
  })

  describe('Database', () => {
    it('should convert Database entity to ParentObject.Database', () => {
      const database = new Database(MOCK_ADAPTER, MOCK_DATABASE)
      const result = entityToParent(database)
      expect(result).toMatchObject({
        type: 'database_id',
        database_id: 'database-123',
      })
    })
  })
})
