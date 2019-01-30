import { UnknownError } from '@apollo';
import db from '@db';
import { BaseConnector, FieldsMap } from '@db/connectors';
import { River } from '@whitewater-guide/commons';
import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { RiverRaw } from './types';

const FIELDS_MAP: FieldsMap<River, RiverRaw> = {
  region: 'region_id',
  sections: null,
};

export class RiversConnector extends BaseConnector<River, RiverRaw> {
  constructor() {
    super();
    this._tableName = 'rivers_view';
    this._graphqlTypeName = 'River';
    this._fieldsMap = FIELDS_MAP;
  }

  async assertEditorPermissions(id?: string | null, regionId?: string) {
    if (!this._user) {
      throw new AuthenticationError('must authenticate');
    }
    if (this._user.admin) {
      return true;
    }
    if (!id && !regionId) {
      // this should not happen, just in case
      throw new UnknownError('this should not happen');
    }
    const query = db()
      .select('regions_editors.region_id')
      .from('regions_editors')
      .where({ user_id: this._user.id });
    if (id) {
      query
        .innerJoin(
          'rivers',
          'rivers.region_id',
          '=',
          'regions_editors.region_id',
        )
        .where('rivers.id', id);
    } else if (regionId) {
      query.where({ region_id: regionId });
    }

    const {
      rows: [{ exists }],
    } = await db().raw(`SELECT EXISTS (${query.toString()})`);
    if (!exists) {
      throw new ForbiddenError('must be editor');
    }
    return true;
  }
}
