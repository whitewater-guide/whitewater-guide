import type { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';

import { Context } from '../../apollo/index';
import { holdTransaction, rollbackTransaction } from '../../db/index';
import { OffsetConnector } from './OffsetConnector';
import type { FieldsMap } from './types';

const mockInfo: GraphQLResolveInfo = {} as any;

jest.mock('graphql-fields', () => jest.fn());
const graphqlFields: jest.Mock<any> = gqf as any;

beforeAll(holdTransaction);
afterAll(rollbackTransaction);

class TestConnector extends OffsetConnector<any, any> {
  constructor() {
    super(new Context());
    this._tableName = 'test_table';
    this._graphqlTypeName = 'TestType';
    this._language = undefined;
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
}

describe('clauses', () => {
  beforeEach(() => {
    graphqlFields.mockReturnValueOnce({ count: {}, nodes: {} });
  });

  it('should apply custom where clause', () => {
    const query = new TestConnector()
      .fieldsByType(['name', 'age'])
      .getMany(mockInfo, { where: { location: 'somewhere' } })
      .toString();
    expect(query).toContain(`"location" = 'somewhere'`);
  });

  it('should limit', () => {
    const query = new TestConnector()
      .fieldsByType(['name', 'age'])
      .getMany(mockInfo, {
        page: { limit: 5 },
      })
      .toString();
    expect(query).toContain(`limit 5`);
  });

  it('should offset', () => {
    const query = new TestConnector()
      .fieldsByType(['name', 'age'])
      .getMany(mockInfo, {
        page: { limit: 5, offset: 3 },
      })
      .toString();
    expect(query).toContain(`limit 5`);
    expect(query).toContain(`offset 3`);
  });

  it('should count', () => {
    const query = new TestConnector()
      .fieldsByType(['name', 'age'])
      .getMany(mockInfo)
      .toString();
    expect(query).toContain(`count(*)`);
  });

  it('apply sort', () => {
    const query = new TestConnector()
      .fieldsByType(['name', 'age'])
      .getMany(mockInfo, {
        orderBy: [{ column: 'age' }, { column: 'name', direction: 'desc' }],
      })
      .toString();
    expect(query).toContain(`order by`);
    expect(query).toContain(`"name" desc`);
    expect(query).toContain(`"age" asc`);
    expect(query).not.toContain(`"created_at" desc`);
  });
});

describe('offset connection', () => {
  describe('count-only queries', () => {
    beforeEach(() => {
      graphqlFields.mockReturnValueOnce({ count: {} });
    });

    it('should build correct query', () => {
      const query = new TestConnector().getMany(mockInfo).toString();
      expect(query).toMatchInlineSnapshot(
        `"select count(*) from "test_table""`,
      );
    });

    it('should correct apply language filter', () => {
      const query = new TestConnector()
        .language('ru')
        .getMany(mockInfo)
        .toString();
      expect(query).toContain(`"language" = 'ru'`);
    });

    it('should correct apply arbitrary filter', () => {
      const query = new TestConnector()
        .getMany(mockInfo, { where: { age: 10 } })
        .toString();
      expect(query).toContain(`"age" = 10`);
    });
  });

  describe('count and nodes queries', () => {
    beforeEach(() => {
      graphqlFields.mockReturnValueOnce({
        count: {},
        nodes: {
          firstName: {},
          lastName: {},
        },
      });
    });

    it('should build correct query', () => {
      const query = new TestConnector()
        .fieldsByType(['firstName', 'lastName'])
        .getMany(mockInfo, { where: { age: 10 } })
        .toString();
      expect(query).toMatchInlineSnapshot(
        `"select "id", "first_name", "last_name", count(*) OVER() from "test_table" where "age" = 10 order by "name" asc, "created_at" desc, "id" asc"`,
      );
    });
  });

  describe('array queries without count and nodes', () => {
    beforeEach(() => {
      graphqlFields.mockReturnValueOnce({
        firstName: {},
        lastName: {},
      });
    });

    it('should build correct query', () => {
      const query = new TestConnector()
        .fieldsByType(['firstName', 'lastName'])
        .getMany(mockInfo, { where: { age: 10 } })
        .toString();
      expect(query).toMatchInlineSnapshot(
        `"select "id", "first_name", "last_name" from "test_table" where "age" = 10 order by "name" asc, "created_at" desc, "id" asc"`,
      );
    });
  });
});
