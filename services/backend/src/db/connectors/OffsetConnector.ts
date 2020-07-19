import { DataSource } from 'apollo-datasource';
import { GraphQLResolveInfo } from 'graphql';
import gqf from 'graphql-fields';
import { Context } from '~/apollo';
import db from '~/db';
import { BaseConnector } from './BaseConnector';
import { ManyBuilderOptions } from './types';
import { QueryBuilder } from 'knex';

export class OffsetConnector<TGraphql, TSql extends { id: string }>
  extends BaseConnector<TGraphql, TSql>
  implements DataSource<Context> {
  public getMany(
    info: GraphQLResolveInfo,
    options: ManyBuilderOptions<TSql> = {},
  ): QueryBuilder {
    const tree = gqf(info);
    const { nodes, count } = tree;

    // Count-only queries
    if (!nodes && !!count) {
      const countQuery = db()
        .count()
        .from(this._tableName);
      if (this._language) {
        countQuery.where('language', this._language);
      }
      if (options.where) {
        countQuery.where(options.where);
      }

      return countQuery as any;
    }

    const query = this.buildGenericQuery();

    // Simple filtering
    if (options.where) {
      query.where(options.where);
    }

    // Offset pagination
    if (options.page?.limit) {
      query.limit(options.page.limit);
      if (options.page.offset) {
        query.offset(options.page.offset);
      }
    }

    // Count
    if (count) {
      query.select(db().raw(`count(*) OVER()`));
    }

    // Sort
    const orderBy = options.orderBy || this._orderBy;
    if (orderBy) {
      orderBy.forEach(({ column, direction }) =>
        query.orderBy(column, direction),
      );
    }

    return query;
  }
}
