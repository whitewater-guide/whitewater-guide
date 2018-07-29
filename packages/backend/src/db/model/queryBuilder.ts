import { Page } from '@apollo';
import db from '@db';
import { Connection } from '@ww-commons';
import DataLoader from 'dataloader';
import { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import Knex from 'knex';
import snakeCase from 'lodash/snakeCase';
import { Omit } from 'type-zoo';
import { FieldsMap } from './types';

export interface BuilderOptions<TGraphql, TSql> {
  knex?: Knex;
  fields: Set<keyof TGraphql>;
  fieldsMap: FieldsMap<TGraphql, TSql>;
  sqlFields?: Array<keyof TSql>;
  language?: string;
}

export interface OrderBy {
  column: string;
  direction?: 'asc' | 'desc';
}

// tslint:disable-next-line:ban-types
export type Where<TSql> = {[P in keyof TSql]?: string | number | null } | Knex.QueryCallback | Knex.Raw;

export interface ManyBuilderOption<TSql> {
  count?: boolean;
  page?: Page;
  orderBy?: OrderBy[];
  where?: Where<TSql>;
}

export function buildQuery<TGraphql, TSql>(tableName: string, options: BuilderOptions<TGraphql, TSql>) {
  const {
    knex = db(),
    fields,
    fieldsMap,
    sqlFields = ['id', 'language'] as any,
    language,
  } = options;

  const sqlFieldsSet: Set<keyof TSql> = new Set<keyof TSql>(sqlFields);
  for (const graphqlField of fields.values()) {
    if (typeof graphqlField !== 'string') {
      continue;
    }
    const mapped = fieldsMap[graphqlField];
    if (mapped === null) {
      continue;
    } else if (!mapped) {
      sqlFieldsSet.add(snakeCase(graphqlField) as any);
    } else if (Array.isArray(mapped)) {
      mapped.forEach(f => sqlFieldsSet.add(f as any));
    } else {
      sqlFieldsSet.add(mapped as any);
    }
  }

  const query = knex.table(tableName)
    .select(Array.from(sqlFieldsSet) as any);

  if (language) {
    query.where({ language });
  }

  return query;
}

export function buildOneQuery<TGraphql, TSql>(
  tableName: string,
  options: BuilderOptions<TGraphql, TSql>,
  id: string,
) {
  const query = buildQuery(tableName, options);
  return query.where({ id });
}

export function buildBatchQuery<TGraphql, TSql>(
  tableName: string,
  options: BuilderOptions<TGraphql, TSql>,
  ids: string[],
) {
  const query = buildQuery(tableName, options);
  return query.whereIn('id', ids);
}

export function buildManyQuery<TGraphql, TSql>(
  tableName: string,
  options: BuilderOptions<TGraphql, TSql>,
  { page, count, orderBy, where }: ManyBuilderOption<TSql>,
) {
  const query = buildQuery(tableName, options);
  const { knex = db() } = options;

  // Filtering
  if (where) {
    query.where(where);
  }

  // Pagination
  if (page && page.limit) {
    query.limit(page.limit);
    if (page.offset) {
      query.offset(page.offset);
    }
  }

  // Count
  if (count) {
    query.select(knex.raw(`count(*) OVER()`));
  }

  // Sort
  const orders = orderBy || [
    { column: 'name', direction: 'asc' },
    { column: 'created_at', direction: 'desc' },
    { column: 'id', direction: 'asc' },
  ];
  orders.forEach(({ column, direction }) => query.orderBy(column, direction));

  return query;
}

export function buildConnectionQuery<TGraphql, TSql>(
  tableName: string,
  options: Omit<BuilderOptions<TGraphql, TSql>, 'fields'>,
  manyOptions: ManyBuilderOption<TSql>,
  info: GraphQLResolveInfo,
): Promise<Connection<TSql>> {
  const { nodes, count } = gqf(info);

  if (!nodes) {
    const knexInstance = options.knex || db();
    const query = knexInstance.count().from(tableName);
    if (options.language) {
      query.where('language', options.language);
    }
    if (manyOptions.where) {
      query.where(manyOptions.where);
    }

    return query.then((values: any) => {
      const cnt: number = (values && values.length) ? values[0].count : 0;
      return { count: Number(cnt), nodes: [] as TSql[] };
    }) as any;
  } else {
    const query = buildManyQuery(
      tableName,
      { ...options, fields: new Set(Object.keys(nodes)) as any },
      { ...manyOptions, count: !!count },
    );
    return query.then((values: any) => {
      return {
        nodes: values,
        count: (values && values.length) ? Number(values[0].count) : 0,
      };
    }) as any;
  }
}

export function maybePrimeCache<V extends { id: string }>(
  oneFields: Set<string>,
  manyFields: Set<string>,
  query: Knex.QueryBuilder,
  cache: DataLoader<string, V | null>,
) {
  let hasAllFields = true;
  for (const f of oneFields.values()) {
    if (!manyFields.has(f)) {
      hasAllFields = false;
      break;
    }
  }
  if (hasAllFields) {
    query.then((values: V[]) => {
      values.forEach((v) => cache.prime(v.id, v));
      return values;
    });
  }
}
