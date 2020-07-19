import { Cursor } from '~/apollo/cursor';
import { holdTransaction, rollbackTransaction } from '~/db';
import { RelayConnector } from './RelayConnector';
import { FieldsMap } from './types';

beforeAll(holdTransaction);
afterAll(rollbackTransaction);

class TestConnector extends RelayConnector<any, any> {
  constructor() {
    super();
    this._tableName = 'test_table';
    this._graphqlTypeName = 'TestType';
  }

  protected getAfterClause(cursor: Cursor): string {
    return `(birthday, ord_id) < (${cursor.value}, ${cursor.ordId})`;
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

it('should build correct query', () => {
  const query = new TestConnector()
    .fieldsByType(['birthday', 'name'])
    .sqlFields(['ord_id'])
    .getManyQuery({
      where: { name: 'foo' },
      page: { limit: 3, after: { value: '2020-01-01', ordId: 4 } },
      orderBy: [
        {
          column: 'birthday',
          direction: 'desc',
        },
        {
          column: 'ord_id',
          direction: 'desc',
        },
      ],
    });
  expect(query).toMatchSnapshot();
});

it('should produce relay-style connection', () => {
  const connector = new TestConnector();
  const actual = connector.itemsToConnection(
    [
      {
        name: 'foo',
        created_at: '1',
        ord_id: 1,
      },
      {
        name: 'bar',
        created_at: '2',
        ord_id: 2,
      },
    ],
    10,
    'created_at',
  );
  expect(actual).toEqual({
    edges: [
      {
        cursor: {
          ordId: 1,
          value: '1',
        },
        node: {
          created_at: '1',
          name: 'foo',
          ord_id: 1,
        },
      },
      {
        cursor: {
          ordId: 2,
          value: '2',
        },
        node: {
          created_at: '2',
          name: 'bar',
          ord_id: 2,
        },
      },
    ],
    pageInfo: {
      endCursor: {
        ordId: 2,
        value: '2',
      },
      hasMore: true,
    },
  });
});

it('should produce relay-style connection for date values', () => {
  const connector = new TestConnector();
  const actual = connector.itemsToConnection(
    [
      {
        name: 'foo',
        created_at: new Date(2010, 1, 1),
        ord_id: 1,
      },
      {
        name: 'bar',
        created_at: new Date(2012, 1, 1),
        ord_id: 2,
      },
    ],
    10,
    'created_at',
  );
  expect(actual).toEqual({
    edges: [
      {
        cursor: {
          ordId: 1,
          value: '1264971600000',
        },
        node: {
          created_at: new Date(2010, 1, 1),
          name: 'foo',
          ord_id: 1,
        },
      },
      {
        cursor: {
          ordId: 2,
          value: '1328040000000',
        },
        node: {
          created_at: new Date(2012, 1, 1),
          name: 'bar',
          ord_id: 2,
        },
      },
    ],
    pageInfo: {
      endCursor: {
        ordId: 2,
        value: '1328040000000',
      },
      hasMore: true,
    },
  });
});
