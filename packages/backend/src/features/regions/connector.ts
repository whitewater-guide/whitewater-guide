import { AuthenticationRequiredError, ForbiddenError } from '@apollo';
import db from '@db';
import { BaseConnector, FieldsMap, ManyBuilderOptions } from '@db/connectors';
import { Region } from '@ww-commons';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';
import { RegionRaw } from './types';

const FIELDS_MAP: FieldsMap<Region, RegionRaw> = {
  editable: null,
  hasPremiumAccess: null,
  rivers: null,
  gauges: null,
  sections: null,
  sources: null,
  mediaSummary: null,
};

export class RegionsConnector extends BaseConnector<Region, RegionRaw> {

  constructor() {
    super();
    this._tableName = 'regions_view';
    this._graphqlTypeName = 'Region';
    this._fieldsMap = FIELDS_MAP;
  }

  getBatchQuery(keys: string[]): QueryBuilder {
    const query = super.getBatchQuery(keys);
    const regionFields = this._fieldsByType.get('Region')!;
    if (this._user && (regionFields.has('hasPremiumAccess') || regionFields.has('editable'))) {
      // Add 'editable' column as subquery
      const editableQ = db().select('region_id').from('regions_editors')
        .where('regions_editors.user_id', '=', this._user.id)
        .whereRaw('regions_editors.region_id = regions_view.id');

      query.select(db().raw(`(SELECT EXISTS (${editableQ.toString()})) as editable`));
    }
    return query;
  }

  getMany(info: GraphQLResolveInfo, options: ManyBuilderOptions<RegionRaw>) {
    const query = super.getMany(info, options);
    if (!this._user) {
      // Anons should not see hidden regions
      query.where('regions_view.hidden', false);
    } else if (!this._user.admin) {

      // Add 'editable' column as subquery
      const editableQ = db().select('region_id').from('regions_editors')
        .where('regions_editors.user_id', '=', this._user.id)
        .whereRaw('regions_editors.region_id = regions_view.id');

      query.select(db().raw(`(SELECT EXISTS (${editableQ.toString()})) as editable`));

      query.where(function(this: QueryBuilder) {
        this.where('regions_view.hidden', false)
          .orWhereExists(editableQ);
      });
    }
    return query;
  }

  async assertEditorPermissions(id: string | null) {
    if (!this._user) {
      throw new AuthenticationRequiredError();
    }
    if (this._user.admin) {
      return true;
    }
    if (!id) {
      // only admin can create regions
      throw new ForbiddenError();
    }
    const { count } = await db(true).table('regions_editors')
      .where({ region_id: id, user_id: this._user.id })
      .count().first();
    if (Number(count) !== 1) {
      throw new ForbiddenError();
    }
    return true;
  }

}
