import { Context } from '../apollo';
import { adminContext, anonContext } from '../test/context';
import { isAdmin } from '../ww-commons';
import * as Knex from 'knex';
import db from './db';
import {
  attachConnection,
  buildConnectionColumn,
  buildConnectionJSONQuery, buildListQuery,
  buildRootQuery,
  ConnectionBuilderOptions,
  getPrimitives, ListQueryBuilderOptions,
  QueryBuilderOptions,
} from './queryBuilders';
import gqf = require('graphql-fields');

jest.mock('graphql-fields', () => jest.fn());
const graphqlFields: jest.Mock<any> = gqf as any;

describe('getPrimitives', () => {
  const topLevelFields = ['__typename', 'camelCase', 'snake_case', 'regular', 'everyone', 'admin', 'connection', 'oneToOne'];
  const customMap = {
    admin: (c: Context) => isAdmin(c.user) ? 'admin' : null,
  };
  const prefix = 'tablename';

  it('should prefix fields', () => {
    const result = getPrimitives<any>(topLevelFields, prefix);
    result.forEach(field => expect(field.indexOf(prefix)).toBe(0));
  });

  it('should omit __typename', () => {
    const result = getPrimitives<any>(topLevelFields, prefix);
    expect(result).not.toContain('tablename.__typename');
  });

  it('should convert graphql camelCase to postgres snake_case', () => {
    expect(getPrimitives<any>(topLevelFields, prefix)).toContain('tablename.camel_case');
  });

  it('should not include connections', () => {
    expect(getPrimitives<any>(topLevelFields, prefix, undefined, ['connection']))
      .not.toContain('tablename.connection');
  });

  it('should omit based on context', () => {
    const userResult = getPrimitives<any>(topLevelFields, prefix, anonContext, ['connection'], ['oneToOne'], customMap);
    expect(userResult).not.toContain('tablename.admin');
    const adminResult = getPrimitives<any>(topLevelFields, prefix, adminContext, ['connection'], ['oneToOne'], customMap);
    expect(adminResult).toContain('tablename.admin');
  });

  it('should match snapshot', () => {
    const userResult = getPrimitives<any>(topLevelFields, prefix, anonContext, ['connection'], ['oneToOne'], customMap);
    expect(userResult).toMatchSnapshot();
  });

});

describe('buildRootQuery', () => {
  const commonOptions: QueryBuilderOptions<any> = {
    info: {} as any,
    context: anonContext,
    knex: db(true),
    table: 'tbl',
  };

  it('should construct basic query', () => {
    graphqlFields.mockReturnValueOnce({ bC: {} });
    const query = buildRootQuery(commonOptions);
    expect(query).toMatchSnapshot();
  });

  it('should use fields tree if provided', () => {
    const query = buildRootQuery({ ...commonOptions, info: undefined, fieldsTree: { bC: {} } });
    expect(query).toMatchSnapshot();
  });

  it('should throw if no info or fieldsTree provided', () => {
    expect(() => buildRootQuery({ ...commonOptions, info: undefined })).toThrow();
  });

  it('should use english by default', () => {
    graphqlFields.mockReturnValueOnce({ name: {} });
    const query = buildRootQuery({ ...commonOptions, language: undefined });
    expect(query).toMatchSnapshot();
  });

  it('should alias table', () => {
    graphqlFields.mockReturnValueOnce({ b: {} });
    const query = buildRootQuery({ ...commonOptions, tableAlias: 'als' });
    expect(query).toMatchSnapshot();
  });

  it('should specify language, id, sort order', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, id: {}, language: {} });
    const query = buildRootQuery({ ...commonOptions, id: 'foo', language: 'en', orderBy: 'b'  });
    expect(query).toMatchSnapshot();
  });

  it('should respect custom fields map', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, camelCase: {}, c: {} });
    const customFieldMap = {
      camelCase: () => 'snake_case',
      c: (c: Context) => isAdmin(c.user) ? 'c' : null,
    };
    const query = buildRootQuery({ ...commonOptions, customFieldMap });
    expect(query).toMatchSnapshot();
  });

  it('should exclude connections', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, connection: {}, c: {} });
    const connections = { connection: null };
    const query = buildRootQuery({ ...commonOptions, connections });
    expect(query).toMatchSnapshot();
  });

  it('should not include connection when not asked by graphql', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, c: {} });
    const connections = { connection: {
      build: () => db(true).select('*').from('k'),
      join: (t: any, q: any) => q.where(`${t}.fk`, '=', db(true).raw('??', ['tbl.id'])),
    }};
    const query = buildRootQuery({ ...commonOptions, connections });
    expect(query).toMatchSnapshot();
  });

  it('should attach connections', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, c: { id: {}, fk: {} } });
    const connections = { c: {
      build: () => db(true).select('*').from('k'),
      join: (t: any, q: any) => q.where(`${t}.fk`, '=', db(true).raw('??', ['tbl.id'])),
    }};
    const query = buildRootQuery({ ...commonOptions, connections });
    expect(query).toMatchSnapshot();
  });

  it('should attach one-to-one references', () => {
    graphqlFields.mockReturnValueOnce({ a: {}, b: { c: {} } });
    const oneToOnes = { b: {
      build: () => db(true).select('*').from('ref'),
      join: (t: any, q: any) => q.where(`${t}.fk`, '=', db(true).raw('??', ['tbl.ref_id'])),
    }};
    const query = buildRootQuery({ ...commonOptions, oneToOnes });
    expect(query).toMatchSnapshot();
  });
});

describe('build list query', () => {
  const commonOptions: ListQueryBuilderOptions<any> = {
    info: {} as any,
    context: anonContext,
    knex: db(true),
    table: 'regions_view',
  };

  it('should query count only', () => {
    graphqlFields.mockReturnValueOnce({ count: {} });
    expect(buildListQuery(commonOptions)).toMatchSnapshot();
  });

  it('should apply offset and limit', () => {
    graphqlFields.mockReturnValueOnce({ count: {}, nodes: { id: {}, name: {} } });
    expect(buildListQuery({ ...commonOptions, page: { limit: 10, offset: 20  } })).toMatchSnapshot();
  });
});

describe('buildConnectionJSONQuery', () => {
  it('should build correct sql without nodes', () => {
    const result = buildConnectionJSONQuery('regions_connection_internal', false, db(true));
    expect(result).toMatchSnapshot();
  });

  it('should build correct sql with nodes', () => {
    const result = buildConnectionJSONQuery('regions_connection_internal', true, db(true));
    expect(result).toMatchSnapshot();
  });
});

describe('buildConnectionColumn', () => {
  const options: ConnectionBuilderOptions = {
    knex: db(true),
    table: 'tbl',
    join: (table, query) => {
      return query.where(`${table}.fk`, '=', db(true).raw('??', ['src.id']));
    },
  };

  it('should build simple connection field select', () => {
    const result = buildConnectionColumn(options);
    expect(result).toMatchSnapshot();
  });

  it('should include limit and offset', () => {
    const result = buildConnectionColumn({ ...options, limit: 10, offset: 20 });
    expect(result).toMatchSnapshot();
  });

});

describe('attachConnection', () => {
  const rootQuery = db(true).select(['source.id', 'sources.name']).from('sources');
  const builder = (opts: QueryBuilderOptions<any>) => buildRootQuery({
    ...opts,
    table: 'regions',
  });

  let options: any;
  beforeEach(() => {
    options = {
      query: rootQuery.clone(),
      fieldsTree: { nodes: { id: {}, name: {} }, count: {} },
      context: adminContext,
      name: 'regions',
      knex: db(true),
      build: builder,
    };
  });

  it('should modify root query for many-to-may connections', () => {
    const joiner = (table: string, query: Knex.QueryBuilder) =>
      query
        .innerJoin('sources_regions', `${table}.id`, 'sources_regions.region_id')
        .where('sources_regions.source_id', '=', db(true).raw('??', ['source.id']));
    const result = attachConnection({ ...options, join: joiner });
    expect(result).toMatchSnapshot();
  });

  it('should modify root query for one-to-many connections', () => {
    const joiner = (table: string, query: Knex.QueryBuilder) =>
      query.where(`${table}.source_id`, '=', db(true).raw('??', ['source.id']));
    const result = attachConnection({ ...options, join: joiner, foreignKey: 'source_id' });
    expect(result).toMatchSnapshot();
  });

  it('should query ids if nodes are not required', () => {
    // this joiner is OK, since we don't need nodes, just count in this test
    const joiner = (table: string, query: Knex.QueryBuilder) => query;
    const result = attachConnection({ ...options, join: joiner, fieldsTree: { count: {} } });
    expect(result).toMatchSnapshot();
  });
});
