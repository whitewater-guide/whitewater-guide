import { holdTransaction, rollbackTransaction } from '~/db';
import gqf from 'graphql-fields';
import {
  buildBatchQuery,
  buildConnectionQuery,
  buildManyQuery,
  buildOneQuery,
  buildQuery,
} from './queryBuilder';

jest.mock('graphql-fields', () => jest.fn());
const graphqlFields: jest.Mock<any> = gqf as any;

const TABLE = 'test_table';

beforeAll(holdTransaction);
afterAll(rollbackTransaction);

describe('buildQuery', () => {
  it('should build basic query', () => {
    const query = buildQuery(TABLE, {
      fields: new Set(['name', 'age', '__typename']),
    });
    expect(query).toMatchSnapshot();
  });

  it('should omit __typename', () => {
    const query = buildQuery(TABLE, {
      fields: new Set(['name', 'age', '__typename']),
    });
    expect(query.toString()).not.toContain('typename');
  });

  it('should map camel-cased columns', () => {
    const query = buildQuery(TABLE, {
      fields: new Set(['firstName']),
    });
    expect(query.toString()).toContain('first_name');
  });

  it('should map columns based on fieldsMap', () => {
    const query = buildQuery<any, any>(TABLE, {
      fields: new Set(['firstName']),
      fieldsMap: { firstName: 'name' },
    });
    expect(query.toString()).not.toContain('first');
    expect(query.toString()).toContain('name');
  });

  it('should omit columns', () => {
    const query = buildQuery<any, any>(TABLE, {
      fields: new Set(['firstName', 'lastName']),
      fieldsMap: { lastName: null },
    });
    expect(query.toString()).toContain('first_name');
    expect(query.toString()).not.toContain('last_name');
  });

  it('should map one graphql field to many columns', () => {
    const query = buildQuery<any, any>(TABLE, {
      fields: new Set(['name']),
      fieldsMap: { name: ['first_name', 'last_name'] },
    });
    expect(query.toString()).toContain('first_name');
    expect(query.toString()).toContain('last_name');
  });

  it('should add arbitrary sql fields', () => {
    const query = buildQuery<any, any>(TABLE, {
      fields: new Set(['name']),
      sqlFields: ['age'],
    });
    expect(query.toString()).not.toContain('id');
    expect(query.toString()).toContain('age');
    expect(query.toString()).toContain('name');
  });

  it('should add language filter', () => {
    const query = buildQuery<any, any>(TABLE, {
      fields: new Set(['name']),
      language: 'en',
    });
    expect(query.toString()).toContain('"language" = \'en\'');
  });
});

describe('buildOneQuery', () => {
  it('shold filter by id', () => {
    const query = buildOneQuery(
      TABLE,
      {
        fields: new Set(['name', 'age']),
      },
      'a1',
    );
    expect(query.toString()).toContain(`"id" = 'a1'`);
  });
});

describe('buildBatchQuery', () => {
  it('should filter by id', () => {
    const query = buildBatchQuery(
      TABLE,
      {
        fields: new Set(['name', 'age']),
      },
      ['a1', 'b2'],
    );
    expect(query.toString()).toContain(`"id" in ('a1', 'b2')`);
  });
});

describe('buildManyQuery', () => {
  it('should apply custom where clause', () => {
    const query = buildManyQuery(
      TABLE,
      {
        fields: new Set(['name', 'age']),
      },
      {
        where: { location: 'somewhere' },
      },
    );
    expect(query.toString()).toContain(`"location" = 'somewhere'`);
  });

  it('should limit', () => {
    const query = buildManyQuery(
      TABLE,
      {
        fields: new Set(['name', 'age']),
      },
      {
        page: { limit: 5 },
      },
    );
    expect(query.toString()).toContain(`limit 5`);
  });

  it('should offset', () => {
    const query = buildManyQuery(
      TABLE,
      {
        fields: new Set(['name', 'age']),
      },
      {
        page: { limit: 5, offset: 3 },
      },
    );
    expect(query.toString()).toContain(`limit 5`);
    expect(query.toString()).toContain(`offset 3`);
  });

  it('should count', () => {
    const query = buildManyQuery(
      TABLE,
      {
        fields: new Set(['name', 'age']),
      },
      {
        count: true,
      },
    );
    expect(query.toString()).toContain(`count(*)`);
  });

  it('apply sort', () => {
    const query = buildManyQuery(
      TABLE,
      {
        fields: new Set(['name', 'age']),
      },
      {
        orderBy: [{ column: 'age' }, { column: 'name', direction: 'desc' }],
      },
    );
    expect(query.toString()).toContain(`order by`);
    expect(query.toString()).toContain(`"name" desc`);
    expect(query.toString()).toContain(`"age" asc`);
    expect(query.toString()).not.toContain(`"created_at" desc`);
  });
});

describe('buildConnectionQuery', () => {
  describe('count-only queries', () => {
    beforeEach(() => {
      graphqlFields.mockReturnValueOnce({ count: {} });
    });

    it('should build correct query', () => {
      const query = buildConnectionQuery<any, any>(TABLE, {}, {}, {} as any);
      expect(query).toMatchSnapshot();
    });

    it('should correct apply language filter', () => {
      const query = buildConnectionQuery<any, any>(
        TABLE,
        { language: 'ru' },
        {},
        {} as any,
      );
      expect(query.toString()).toContain(`"language" = 'ru'`);
    });

    it('should correct apply arbitrary filter', () => {
      const query = buildConnectionQuery<any, any>(
        TABLE,
        {},
        { where: { age: 10 } },
        {} as any,
      );
      expect(query.toString()).toContain(`"age" = 10`);
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
      const query = buildConnectionQuery<any, any>(TABLE, {}, {}, {} as any);
      expect(query).toMatchSnapshot();
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
      const query = buildConnectionQuery<any, any>(TABLE, {}, {}, {} as any);
      expect(query).toMatchSnapshot();
    });
  });
});
