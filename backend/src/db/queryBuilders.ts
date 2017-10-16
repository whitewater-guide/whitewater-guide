import { GraphQLResolveInfo } from 'graphql';
import * as Knex from 'knex';
import { snakeCase } from 'lodash';
import { Context } from '../apollo';
import graphqlFields = require('graphql-fields');
import db from './db';

type ColumnMap<T> = {
  [field in keyof T]?: (context?: Context) => any;
};

type ConnectionsMap<T> = {
  [field in keyof T]?: { build: Builder, join: Joiner } | null;
};

type Builder = (options: Partial<QueryBuilderOptions<any>>) => Knex.QueryBuilder;
type Joiner = (table: string, query: Knex.QueryBuilder) => Knex.QueryBuilder;

export const getPrimitives = <T>(
  topLevelFields: Array<keyof T>,
  prefix: string,
  context?: Context,
  connections?: Array<keyof T>,
  customMap?: ColumnMap<T>,
): string[] => {
  return topLevelFields.reduce((result, field) => {
    // connection types and __typename are ignored
    if (field === '__typename' || connections && connections.includes(field)) {
      return result;
    }
    // Custom map allows to conditionally drop some statements based on context
    if (customMap && field in customMap) {
      const mapped = customMap[field]!(context);
      return mapped ?  [...result, `${prefix}.${mapped}`] : result;
    }
    return [...result, `${prefix}.${snakeCase(field)}`];
  }, []);
};

export interface QueryBuilderOptions<T> {
  info?: GraphQLResolveInfo;
  fieldsTree?: {[key: string]: any};
  context: Context,
  table: string;
  tableAlias?: string;
  customFieldMap?: ColumnMap<T>;
  connections?: ConnectionsMap<T>;
  knex?: Knex;
  language?: string;
  orderBy?: string;
  id?: string;
}

export const buildRootQuery = <T>(options: QueryBuilderOptions<T>): Knex.QueryBuilder => {
  const {
    info,
    fieldsTree,
    context,
    table,
    tableAlias,
    customFieldMap = {},
    connections = {},
    knex = db(),
    language = 'en',
    orderBy = 'name',
    id,
  } = options;
  const alias = tableAlias || table;
  let result = knex.from(tableAlias ? `${table} AS ${tableAlias}` : table);
  if (!fieldsTree && !info) {
    throw new Error('Provide either resolver info or parsed fields tree from resolver info');
  }
  const rootFieldsTree = fieldsTree || graphqlFields(info!);
  const topLevelFields: Array<keyof T> = Object.keys(rootFieldsTree) as any;
  const primitiveColumns = getPrimitives<T>(
    topLevelFields,
    alias,
    context,
    Object.keys(connections) as any,
    customFieldMap,
  );
  result = result.select(primitiveColumns);
  Object.entries(connections).forEach(([connectionName, value]) => {
    if (value && rootFieldsTree[connectionName]) {
      const { build, join } = value;
      attachConnection({
        knex,
        query: result,
        build,
        join,
        context,
        language,
        name: connectionName,
        fieldsTree: rootFieldsTree[connectionName],
      });
    }
  });
  if (id) {
    result = result.where(`${alias}.id`, id);
  }
  if (language) {
    result = result.where(`${alias}.language`, language);
  }
  if (orderBy) {
    result = result.orderBy(`${alias}.${orderBy}`);
  }
  return result;
};

/**
 * This will build a knex query which selects json object with fields 'nodes' (optional) and 'count' required
 * 'nodes' will contain json array of all rows (this will also include redundant count in each item)
 * @param {string} table - CTE which has 'count' column made with window function
 * @param {boolean} includeNodes - include nodes or just count them?
 * @param {Knex.Transaction | Knex} knex
 * @returns {Knex.QueryBuilder}
 */
export const buildConnectionSubquery = (table: string, includeNodes = true, knex = db()) => {
  // Assumption: we can request count without nodes, but if we request nodes we also must request count
  const nodes = includeNodes ? knex.select(knex.raw(`json_agg(${table}.*)`)).from(table) : null;
  const count = includeNodes ?
    knex.select(`${table}.count`).from(table).limit(1) : // count comes from window function column
    knex.count(`${table}.*`).from(table);
  const parts = [`'count'`, `(${count.toQuery()})`];
  if (nodes) {
    parts.push(`'nodes'`, `(${nodes.toQuery()})`);
  }
  return knex.select(knex.raw(`json_build_object(${parts.join(', ')})`));
};

export interface ConnectionBuilderOptions {
  table: string;
  join: Joiner;
  includeNodes?: boolean;
  knex?: Knex;
  limit?: number;
  offset?: number;
}

export const buildConnectionField = (options: ConnectionBuilderOptions) => {
  const {
    table,
    join,
    includeNodes = true,
    knex = db(),
    limit,
    offset,
  } = options;
  const result = buildConnectionSubquery(`${table}_internal`, includeNodes, knex);
  return result.with(`${table}_internal`, (db2) => {
    let cte = db2.select(`${table}.*`, knex.raw(`count(${table}.*) OVER()`)).from(table);
    cte = join(table, cte);
    if (limit) {
      cte = cte.limit(limit);
      if (offset) {
        cte = cte.offset(offset);
      }
    }
    return cte;
  });
};

interface AttachConnectionOptions {
  query: Knex.QueryBuilder;
  context: Context;
  name: string;
  build: Builder;
  join: Joiner;
  language: string;
  fieldsTree: {[key: string]: any};
  knex?: Knex;
}

export const attachConnection = (options: AttachConnectionOptions) => {
  const {
    query,
    language,
    context,
    name,
    build,
    join,
    fieldsTree,
    knex,
  } = options;
  const connection = buildConnectionField({
    knex,
    table: `${name}_connection`,
    join,
    includeNodes: !!fieldsTree.nodes,
  });
  return query.with(`${name}_connection`, knex!.raw(build({
      fieldsTree: fieldsTree.nodes || { id: {} },
      context,
      language,
      knex,
    }).toQuery()),
  ).select(knex!.raw(`(${connection.toQuery()}) as ${name}`));
};
