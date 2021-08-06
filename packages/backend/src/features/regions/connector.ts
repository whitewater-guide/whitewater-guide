import { Region } from '@whitewater-guide/schema';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';

import { db } from '~/db';
import {
  FieldsMap,
  ManyBuilderOptions,
  OffsetConnector,
} from '~/db/connectors';

import { ResolvableRegion } from './types';

const FIELDS_MAP: FieldsMap<Region, ResolvableRegion> = {
  editable: null,
  hasPremiumAccess: null,
  rivers: null,
  gauges: null,
  sections: null,
  sources: null,
  mediaSummary: null,
  banners: null,
};

export class RegionsConnector extends OffsetConnector<
  Region,
  ResolvableRegion
> {
  constructor() {
    super();
    this._tableName = 'regions_view';
    this._graphqlTypeName = 'Region';
    this._fieldsMap = FIELDS_MAP;
  }

  getBatchQuery(keys: string[]): QueryBuilder {
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
    return query;
  }

  getMany(
    info: GraphQLResolveInfo,
    options: ManyBuilderOptions<ResolvableRegion> = {},
  ) {
    const query = super.getMany(info, options);
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

      query.where(function (this: QueryBuilder) {
        this.where('regions_view.hidden', false).orWhereExists(editableQ);
      });
    }
    return query;
  }
}
