import type { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import type { Knex } from 'knex';

import { db } from '../../db/index';
import { BaseConnector } from './BaseConnector';
import type { ManyBuilderOptions } from './types';

export abstract class OffsetConnector<
  TGraphql,
  TSql extends { id: string },
> extends BaseConnector<TGraphql, TSql> {
  public getMany(
    info: GraphQLResolveInfo,
    options: ManyBuilderOptions<TSql> = {},
  ): Knex.QueryBuilder {
    const tree = gqf(info);
    const { nodes, count } = tree;

    // Count-only queries
    if (!nodes && !!count) {
      const countQuery = db().count().from(this._tableName);
      if (this._language) {
        countQuery.where('language', this._language);
      }
      if (options.where) {
        countQuery.where(options.where);
      }

      return countQuery as any;
    }

    let query = this.buildGenericQuery();

    // Simple filtering
    if (options.where) {
      query = query.where(options.where);
    }

    // Offset pagination
    if (options.page?.limit) {
      query = query.limit(options.page.limit);
      if (options.page.offset) {
        query = query.offset(options.page.offset);
      }
    }

    // Count
    if (count) {
      query = query.select(db().raw(`count(*) OVER()`));
    }

    // Sort
    const orderBy = options.orderBy || this._orderBy;
    if (orderBy) {
      orderBy.forEach(({ column, direction }) => {
        query = query.orderBy(column, direction);
      });
    }

    return query;
  }
}
