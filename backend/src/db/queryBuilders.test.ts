import { Context } from '../apollo';
import { adminContext, anonContext } from '../test/context';
import { isAdmin } from '../ww-commons';
import * as Knex from 'knex';
import db from './db';
import {
  attachConnection,
  buildConnectionColumn,
  buildConnectionJSONQuery,
  buildRootQuery,
  ConnectionBuilderOptions,
  getPrimitives,
  QueryBuilderOptions,
} from './queryBuilders';
import gqf = require('graphql-fields');

jest.mock('graphql-fields', () => jest.fn());
const graphqlFields: jest.Mock<any> = gqf as any;

describe('getPrimitives', () => {
  const topLevelFields = ['__typename', 'camelCase', 'snake_case', 'regular', 'everyone', 'admin', 'connection'];
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
    const userResult = getPrimitives<any>(topLevelFields, prefix, anonContext, ['connection'], customMap);
    expect(userResult).not.toContain('tablename.admin');
    const adminResult = getPrimitives<any>(topLevelFields, prefix, adminContext, ['connection'], customMap);
    expect(adminResult).toContain('tablename.admin');
  });

  it('should match snapshot', () => {
    const userResult = getPrimitives<any>(topLevelFields, prefix, anonContext, ['connection'], customMap);
    expect(userResult).toMatchSnapshot();
  });

});

describe('buildRootQuery', () => {
  const commonOptions: QueryBuilderOptions<any> = {
    info: {} as any,
    context: anonContext,
    knex: db(true),
    table: 'tbl',
    language: '', // empty string to avoid default language
    orderBy: '', // empty string to avoid sort
  };

  it('should construct basic query', () => {
    graphqlFields.mockReturnValueOnce({ bC: {} });
    const query = buildRootQuery(commonOptions);
    expect(query.toQuery()).toEqual('select "tbl"."b_c" from "tbl"');
  });

  it('should use fields tree if provided', () => {
    const query = buildRootQuery({ ...commonOptions, info: undefined, fieldsTree: { bC: {} } });
    expect(query.toQuery()).toEqual('select "tbl"."b_c" from "tbl"');
  });

  it('should throw if no info or fieldsTree provided', () => {
    expect(() => buildRootQuery({ ...commonOptions, info: undefined })).toThrow();
  });

  it('should use english by default', () => {
    graphqlFields.mockReturnValueOnce({ name: {} });
    const query = buildRootQuery({ ...commonOptions, language: undefined });
    expect(query.toQuery()).toEqual('select "tbl"."name" from "tbl" where "tbl"."language" = \'en\'');
  });

  it('should order by name by default', () => {
    graphqlFields.mockReturnValueOnce({ name: {} });
    const query = buildRootQuery({ ...commonOptions, orderBy: undefined });
    expect(query.toQuery()).toEqual('select "tbl"."name" from "tbl" order by "tbl"."name" asc');
  });

  it('should specify sort order', () => {
    graphqlFields.mockReturnValueOnce({ a: {}, b: {} });
    const query = buildRootQuery({ ...commonOptions, orderBy: 'b' });
    expect(query.toQuery()).toEqual('select "tbl"."a", "tbl"."b" from "tbl" order by "tbl"."b" asc');
  });

  it('should alias table', () => {
    graphqlFields.mockReturnValueOnce({ b: {} });
    const query = buildRootQuery({ ...commonOptions, tableAlias: 'als' });
    expect(query.toQuery()).toEqual('select "als"."b" from "tbl" as "als"');
  });

  it('should filter by id and language', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, id: {}, language: {} });
    const query = buildRootQuery({ ...commonOptions, id: 'foo', language: 'en' });
    // tslint:disable-next-line:max-line-length
    const qstring = 'select "tbl"."b", "tbl"."id", "tbl"."language" from "tbl" where "tbl"."id" = \'foo\' and "tbl"."language" = \'en\'';
    expect(query.toQuery()).toEqual(qstring);
  });

  it('should respect custom fields map', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, camelCase: {}, c: {} });
    const customFieldMap = {
      camelCase: () => 'snake_case',
      c: (c: Context) => isAdmin(c.user) ? 'c' : null,
    };
    const query = buildRootQuery({ ...commonOptions, customFieldMap });
    expect(query.toQuery()).toEqual('select "tbl"."b", "tbl"."snake_case" from "tbl"');
  });

  it('should exclude connections', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, connection: {}, c: {} });
    const connections = { connection: null };
    const query = buildRootQuery({ ...commonOptions, connections });
    expect(query.toQuery()).toEqual('select "tbl"."b", "tbl"."c" from "tbl"');
  });

  it('should attach connections', () => {
    graphqlFields.mockReturnValueOnce({ b: {}, c: { id: {}, fk: {} } });
    const connections = { c: {
      build: () => db(true).select('*').from('k'),
      join: (t: any, q: any) => q.where(`${t}.fk`, '=', db(true).raw('??', ['tbl.id'])),
    }};
    const query = buildRootQuery({ ...commonOptions, connections });
    expect(query.toQuery()).toMatchSnapshot();
  });
});

describe('buildConnectionJSONQuery', () => {
  it('should build correct sql without nodes', () => {
    const result = buildConnectionJSONQuery('regions_connection_internal', false, db(true));
    expect(result.toQuery()).toMatchSnapshot();
  });

  it('should build correct sql with nodes', () => {
    const result = buildConnectionJSONQuery('regions_connection_internal', true, db(true));
    expect(result.toQuery()).toMatchSnapshot();
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
    const result = buildConnectionColumn(options).toQuery();
    expect(result).toMatchSnapshot();
  });

  it('should include limit and offset', () => {
    const result = buildConnectionColumn({ ...options, limit: 10, offset: 20 }).toQuery();
    expect(result).toMatchSnapshot();
  });

});

describe('attachConnection', () => {
  const rootQuery = db(true).select(['source.id', 'sources.name']).from('sources');
  const builder = (opts: QueryBuilderOptions<any>) => buildRootQuery({
    ...opts,
    table: 'regions',
    language: '', // shorten query
    orderBy: '', // shorten query
  });
  // one-to-many relation, for shorter query
  const joiner = (table: string, query: Knex.QueryBuilder) =>
    query.where(`${table}.source_id`, '=', db(true).raw('??', ['source.id']));

  let options: any;
  beforeEach(() => {
    options = {
      query: rootQuery.clone(),
      language: '', // for shorter query
      fieldsTree: { nodes: { id: {}, name: {} }, count: {} },
      context: adminContext,
      name: 'regions',
      knex: db(true),
      join: joiner,
      build: builder,
    };
  });

  it('should modify root query', () => {
    const result = attachConnection(options);
    expect(result.toQuery()).toMatchSnapshot();
  });

  it('should query ids if nodes are not required', () => {
    const result = attachConnection({ ...options, fieldsTree: { count: {} } });
    expect(result.toQuery()).toMatchSnapshot();
  });
});
