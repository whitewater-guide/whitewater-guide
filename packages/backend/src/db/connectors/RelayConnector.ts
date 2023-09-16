import type { RelayConnection } from '@whitewater-guide/schema';
import type { Knex } from 'knex';
import { clamp } from 'lodash';

import type { Cursor } from '../../apollo/index';
import { db } from '../../db/index';
import { BaseConnector } from './BaseConnector';
import type { ManyBuilderOptions } from './types';

export abstract class RelayConnector<
  TGraphql,
  TSql extends { id: string },
> extends BaseConnector<TGraphql, TSql> {
  protected _defaultPageSize = 25;

  protected _maxPageSize = 100;

  protected abstract getAfterClause(cursor: Cursor): string;

  public getManyQuery(
    options: ManyBuilderOptions<TSql> = {},
  ): Knex.QueryBuilder {
    let query = this.buildGenericQuery().select(db().raw(`count(*) OVER()`));

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

    // Limit
    const limit = clamp(
      options.page?.limit || this._defaultPageSize,
      1,
      this._maxPageSize,
    );
    query = query.limit(limit);
    // Relay-style pagination
    const after = options.page?.after;
    if (after) {
      query = query.whereRaw(this.getAfterClause(after));
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

  public itemsToConnection<TItem = any>(
    items: any[] | undefined,
    total: number,
    orderBy?: string,
  ): RelayConnection<TItem> {
    const edges =
      items?.map((node) => {
        let value = orderBy ? node[orderBy] : undefined;
        if (value instanceof Date) {
          value = value.getTime().toString(10);
        }
        return {
          cursor: {
            ordId: node.ord_id,
            value,
          },
          node,
        };
      }) || [];
    const hasMore = edges.length < total;
    if (!edges.length) {
      return { edges, pageInfo: { hasMore, endCursor: null } };
    }
    const endEdge = edges[edges.length - 1];
    return { edges, pageInfo: { hasMore, endCursor: endEdge.cursor } };
  }
}
