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
    .getMany({
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
