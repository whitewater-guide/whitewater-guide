import db from '@db';
import DataLoader from 'dataloader';
import { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import Knex, { QueryBuilder } from 'knex';
import snakeCase from 'lodash/snakeCase';
import { Omit } from 'type-zoo';
import { BuilderOptions, FieldsMap, ManyBuilderOptions } from './types';

export function buildQuery<TGraphql, TSql>(
  tableName: string,
  options: BuilderOptions<TGraphql, TSql>,
): QueryBuilder<TSql> {
  const defaultMap: FieldsMap<TGraphql, TSql> = {};
  const { fields, fieldsMap = defaultMap, sqlFields = [], language } = options;

  const sqlFieldsSet: Set<keyof TSql> = new Set<keyof TSql>(sqlFields);
  for (const graphqlField of fields.values()) {
    if (typeof graphqlField !== 'string') {
      continue;
    }
    if (graphqlField === '__typename') {
      continue;
    }
    const mapped = fieldsMap[graphqlField];
    if (mapped === null) {
      continue;
    } else if (!mapped) {
      sqlFieldsSet.add(snakeCase(graphqlField) as any);
    } else if (Array.isArray(mapped)) {
      mapped.forEach((f) => sqlFieldsSet.add(f));
    } else {
      sqlFieldsSet.add(mapped as any);
    }
  }

  const query = db()
    .table(tableName)
    .select(Array.from(sqlFieldsSet));

  if (language) {
    query.where({ language });
  }

  return query as any;
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
  { page, count, orderBy, where }: ManyBuilderOptions<TSql>,
): QueryBuilder<TSql & { count?: number }> {
  const query = buildQuery(tableName, options);

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
    query.select(db().raw(`count(*) OVER()`));
  }

  // Sort
  if (orderBy) {
    orderBy.forEach(({ column, direction }) =>
      query.orderBy(column, direction),
    );
  }

  return query;
}

export function buildConnectionQuery<TGraphql, TSql>(
  tableName: string,
  options: Omit<BuilderOptions<TGraphql, TSql>, 'fields'>,
  manyOptions: ManyBuilderOptions<TSql>,
  info: GraphQLResolveInfo,
): QueryBuilder<TSql & { count?: number }> {
  const tree = gqf(info);
  const { nodes, count } = tree;
  const manyNodes = nodes || tree;

  if (!nodes && !!count) {
    const query = db()
      .count()
      .from(tableName);
    if (options.language) {
      query.where('language', options.language);
    }
    if (manyOptions.where) {
      query.where(manyOptions.where);
    }

    return query as any;
  }
  return buildManyQuery(
    tableName,
    { ...options, fields: new Set(Object.keys(manyNodes)) as any },
    { ...manyOptions, count: !!count },
  );
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
