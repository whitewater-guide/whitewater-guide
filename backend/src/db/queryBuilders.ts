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
  [field in keyof T]?: () => any;
};

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
  info: GraphQLResolveInfo;
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

export const buildRootQuery = <T>(options: QueryBuilderOptions<T>) => {
  const {
    info,
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
  const fieldsTree = graphqlFields(info);
  const topLevelFields: Array<keyof T> = Object.keys(fieldsTree) as any;
  const primitiveColumns = getPrimitives<T>(
    topLevelFields,
    alias,
    context,
    Object.keys(connections) as any,
    customFieldMap,
  );
  result = result.select(primitiveColumns);
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
