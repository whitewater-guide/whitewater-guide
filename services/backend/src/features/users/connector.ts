import { Context } from '@apollo';
import db from '@db';
import { BaseConnector, FieldsMap } from '@db/connectors';
import { User } from '@whitewater-guide/commons';
import { DataSourceConfig } from 'apollo-datasource';
import { AuthenticationError, ForbiddenError } from 'apollo-server-errors';
import { UserRaw } from './types';

const FIELDS_MAP: FieldsMap<User, UserRaw> = {
  purchasedRegions: null,
  purchasedGroups: null,
};

interface PermissionsQuery {
  mediaId?: string | null;
  sectionId?: string | null;
  riverId?: string | null;
  regionId?: string | null;
}

const isEmpty = (query: PermissionsQuery) =>
  !query.sectionId && !query.riverId && !query.regionId && !query.mediaId;

const Keys = new Map<keyof PermissionsQuery, string>([
  ['mediaId', 'media_id'],
  ['sectionId', 'sections.id'],
  ['riverId', 'rivers.id'],
  ['regionId', 'regions_editors.region_id'],
]);

export class UsersConnector extends BaseConnector<User, UserRaw> {
  constructor() {
    super();
    this._tableName = 'users';
    this._graphqlTypeName = 'User';
    this._fieldsMap = FIELDS_MAP;
  }

  initialize(config: DataSourceConfig<Context>) {
    super.initialize(config);
    // users are not multilingual table, language is just an attribute of user
    this._language = undefined;
  }

  async assertEditorPermissions(query: PermissionsQuery): Promise<boolean> {
    if (!this._user) {
      throw new AuthenticationError('must authenticate');
    }
    const { mediaId, sectionId, riverId } = query;
    if (this._user.admin) {
      return Promise.resolve(true);
    }
    if (isEmpty(query) && !this._user.admin) {
      throw new ForbiddenError('must be admin');
    }
    let builder = db()
      .table('regions_editors')
      .where({ user_id: this._user.id });
    if (mediaId || sectionId || riverId) {
      builder = builder.innerJoin(
        'rivers',
        'rivers.region_id',
        '=',
        'regions_editors.region_id',
      );
    }
    if (mediaId || sectionId) {
      builder = builder.innerJoin(
        'sections',
        'rivers.id',
        '=',
        'sections.river_id',
      );
    }
    if (mediaId) {
      builder = builder.innerJoin(
        'sections_media',
        'sections.id',
        '=',
        'sections_media.section_id',
      );
    }
    for (const [k, v] of Object.entries(query)) {
      const dbField = Keys.get(k as any);
      if (v && dbField) {
        builder = builder.where(dbField, '=', v);
      }
    }
    const { count } = await builder.count().first();
    if (count === '0') {
      throw new ForbiddenError('must be editor');
    }
    return Promise.resolve(true);
  }
}
