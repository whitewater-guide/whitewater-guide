import type { Region } from '@whitewater-guide/schema';
import type { GraphQLResolveInfo } from 'graphql';
import type { Knex } from 'knex';

import type { Context } from '../../apollo/index';
import type { FieldsMap, ManyBuilderOptions } from '../../db/connectors/index';
import { OffsetConnector } from '../../db/connectors/index';
import { db } from '../../db/index';
import type { ResolvableRegion } from './types';

const FIELDS_MAP: FieldsMap<Region, ResolvableRegion> = {
  editable: null,
  hasPremiumAccess: null,
  favorite: null,
  rivers: null,
  gauges: null,
  sections: null,
  sources: null,
  mediaSummary: null,
  banners: null,
  room: 'room_id',
};

export class RegionsConnector extends OffsetConnector<
  Region,
  ResolvableRegion
> {
  constructor(context: Context) {
    super(context);
    this._tableName = 'regions_view';
    this._graphqlTypeName = 'Region';
    this._fieldsMap = FIELDS_MAP;
  }

  private addFavoriteColumn(query: Knex.QueryBuilder) {
    const regionFields = this._fieldsByType.get('Region') ?? new Set();
    if (this._user && regionFields.has('favorite')) {
      // Add 'favorite' column as subquery
      const favoriteQ = db()
        .select('region_id')
        .from('fav_regions')
        .where('fav_regions.user_id', '=', this._user.id)
        .whereRaw('fav_regions.region_id = regions_view.id');

      query.select(
        db().raw(`(SELECT EXISTS (${favoriteQ.toString()})) as favorite`),
      );
    }
    return query;
  }

  getBatchQuery(keys: string[]): Knex.QueryBuilder {
    const query = super.getBatchQuery(keys);
    const regionFields = this._fieldsByType.get('Region') ?? new Set();
    if (
      this._user &&
      (regionFields.has('hasPremiumAccess') || regionFields.has('editable'))
    ) {
      // Add 'editable' column as subquery
      const editableQ = db()
        .select('region_id')
        .from('regions_editors')
        .where('regions_editors.user_id', '=', this._user.id)
        .whereRaw('regions_editors.region_id = regions_view.id');

      query.select(
        db().raw(`(SELECT EXISTS (${editableQ.toString()})) as editable`),
      );
    }

    this.addFavoriteColumn(query);

    return query;
  }

  getMany(
    info: GraphQLResolveInfo,
    options: ManyBuilderOptions<ResolvableRegion> = {},
  ) {
    const query = super.getMany(info, options);
    this.addFavoriteColumn(query);
    if (!this._user) {
      // Anons should not see hidden regions
      query.where('regions_view.hidden', false);
    } else if (!this._user.admin) {
      // Add 'editable' column as subquery
      const editableQ = db()
        .select('region_id')
        .from('regions_editors')
        .where('regions_editors.user_id', '=', this._user.id)
        .whereRaw('regions_editors.region_id = regions_view.id');

      query.select(
        db().raw(`(SELECT EXISTS (${editableQ.toString()})) as editable`),
      );

      query.where(function (this: Knex.QueryBuilder) {
        this.where('regions_view.hidden', false).orWhereExists(editableQ);
      });
    }
    return query;
  }
}
