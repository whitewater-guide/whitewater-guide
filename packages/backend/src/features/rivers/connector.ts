import { AuthenticationRequiredError, ContextUser, ForbiddenError } from '@apollo';
import db from '@db';
import { BaseModel, FieldsMap } from '@db/model';
import { River } from '@ww-commons';
import { RiverRaw } from './types';

const FIELDS_MAP: FieldsMap<River, RiverRaw> = {
  region: 'region_id',
  sections: null,
};

export class RiversConnector extends BaseModel<River, RiverRaw> {

  constructor(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
    super(user, language, fieldsByType);
    this._tableName = 'rivers_view';
    this._graphqlTypeName = 'River';
    this._fieldsMap = FIELDS_MAP;
  }

  async assertEditorPermissions(id?: string | null, regionId?: string) {
    if (!this._user) {
      throw new AuthenticationRequiredError();
    }
    if (this._user.admin) {
      return true;
    }
    if (!id && !regionId) {
      // this should not happen, just in case
      throw new ForbiddenError();
    }
    const query = db().select('regions_editors.region_id').from('regions_editors')
      .where({ user_id: this._user.id });
    if (id) {
      query.innerJoin('rivers', 'rivers.region_id', '=', 'regions_editors.region_id')
        .where('rivers.id', id);
    } else if (regionId) {
      query.where({ region_id: regionId });
    }

    const { rows: [{ exists }] } = await db().raw(`SELECT EXISTS (${query.toString()})`);
    if (!exists) {
      throw new ForbiddenError();
    }
    return true;
  }

}
