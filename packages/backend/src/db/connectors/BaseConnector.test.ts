import { QueryBuilder } from 'knex';

import { holdTransaction, rollbackTransaction } from '~/db';

import { BaseConnector } from './BaseConnector';
import { FieldsMap } from './types';

beforeAll(holdTransaction);
afterAll(rollbackTransaction);

class TestConnector extends BaseConnector<any, any> {
  constructor() {
    super();
    this._tableName = 'test_table';
    this._graphqlTypeName = 'TestType';
  }

  public fieldsByType(fields: string[]): this {
    this._fieldsByType = new Map([[this._graphqlTypeName, new Set(fields)]]);
    return this;
  }

  public fieldsMap(map: FieldsMap<any, any>): this {
    this._fieldsMap = map;
    return this;
  }

  public sqlFields(fields: string[]): this {
    this._sqlFields = Array.from(new Set([...this._sqlFields, ...fields]));
    return this;
  }

  public language(lng: string): this {
    this._language = lng;
    return this;
  }

  public getBatchQuery(keys: string[]): QueryBuilder {
    return super.getBatchQuery(keys);
  }
}

describe('generic query', () => {
  it('should build basic query', () => {
    const query = new TestConnector()
      .fieldsByType(['name', 'age', '__typename'])
      .buildGenericQuery()
      .toString();
    expect(query).toMatchInlineSnapshot(
      `"select \\"id\\", \\"name\\", \\"age\\" from \\"test_table\\""`,
    );
  });

  it('should omit __typename', () => {
    const query = new TestConnector()
      .fieldsByType(['name', 'age', '__typename'])
      .buildGenericQuery()
      .toString();
    expect(query).not.toContain('typename');
  });

  it('should map camel-cased columns', () => {
    const query = new TestConnector()
      .fieldsByType(['firstName'])
      .buildGenericQuery()
      .toString();
    expect(query).toContain('first_name');
  });

  it('should map columns based on fieldsMap', () => {
    const query = new TestConnector()
      .fieldsByType(['firstName'])
      .fieldsMap({ firstName: 'name' })
      .buildGenericQuery()
      .toString();
    expect(query).not.toContain('first');
    expect(query).toContain('name');
  });

  it('should omit columns', () => {
    const query = new TestConnector()
      .fieldsByType(['firstName', 'lastName'])
      .fieldsMap({ lastName: null })
      .buildGenericQuery()
      .toString();
    expect(query).toContain('first_name');
    expect(query).not.toContain('last_name');
  });

  it('should map one graphql field to many columns', () => {
    const query = new TestConnector()
      .fieldsByType(['name'])
      .fieldsMap({ name: ['first_name', 'last_name'] })
      .buildGenericQuery()
      .toString();
    expect(query).toContain('first_name');
    expect(query).toContain('last_name');
  });

  it('should add arbitrary sql fields', () => {
    const query = new TestConnector()
      .fieldsByType(['name'])
      .sqlFields(['age'])
      .buildGenericQuery()
      .toString();

    expect(query).toContain('id');
    expect(query).toContain('age');
    expect(query).toContain('name');
  });

  it('should add language filter', () => {
    const query = new TestConnector()
      .fieldsByType(['name'])
      .language('en')
      .buildGenericQuery()
      .toString();

    expect(query).toContain('"language" = \'en\'');
  });
});

describe('batch query', () => {
  it('should filter by id', () => {
    const query = new TestConnector()
      .fieldsByType(['name', 'age'])
      .getBatchQuery(['a1', 'b2'])
      .toString();
    expect(query).toContain(`"id" in ('a1', 'b2')`);
  });
});
