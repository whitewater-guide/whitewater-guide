import { Context } from '@apollo';
import db, { knex } from '@db';
import { BaseConnector, FieldsMap } from '@db/connectors';
import log from '@log';
import { redis } from '@redis';
import { SocialMediaProvider, User } from '@whitewater-guide/commons';
import { DataSourceConfig } from 'apollo-datasource';
import { AuthenticationError, ForbiddenError } from 'apollo-server-errors';
import axios from 'axios';
import get from 'lodash/get';
import { UserRaw } from './types';

const { FB_APP_ID, FB_SECRET } = process.env;

const FIELDS_MAP: FieldsMap<User, UserRaw> = {
  purchasedRegions: null,
  purchasedGroups: null,
  accounts: knex.raw(
    '(SELECT json_agg(accounts.*) FROM accounts WHERE accounts.user_id = users.id) AS accounts',
  ),
  editor: knex.raw(
    'EXISTS (SELECT 1 from regions_editors WHERE regions_editors.user_id = users.id) AS editor',
  ),
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

  private async _checkEditorPermissions(
    query: PermissionsQuery,
  ): Promise<true | Error> {
    if (!this._user) {
      return Promise.resolve(new AuthenticationError('must authenticate'));
    }
    const { mediaId, sectionId, riverId } = query;
    if (this._user.admin) {
      return Promise.resolve(true);
    }
    if (isEmpty(query) && !this._user.admin) {
      return Promise.resolve(new ForbiddenError('must be admin'));
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
      if (k === 'riverId' && query.sectionId) {
        // If we know section id, river id is redundant
        // Moreover, when we change section's river having both id in query will lead to failing where clause
        continue;
      }
      if (v && dbField) {
        builder = builder.where(dbField, '=', v);
      }
    }
    const { count } = await builder.count().first();
    if (count === '0') {
      return Promise.resolve(new ForbiddenError('must be editor'));
    }
    return Promise.resolve(true);
  }

  async checkEditorPermissions(query: PermissionsQuery): Promise<boolean> {
    const result = await this._checkEditorPermissions(query);
    return result === true;
  }

  async assertEditorPermissions(query: PermissionsQuery): Promise<boolean> {
    const result = await this._checkEditorPermissions(query);
    if (result === true) {
      return true;
    } else {
      return Promise.reject(result);
    }
  }

  async getAvatar(user: UserRaw): Promise<string | null> {
    if (user.avatar) {
      return user.avatar;
    }
    if (user.accounts) {
      const fb = user.accounts.find(
        ({ provider }) => provider === SocialMediaProvider.FACEBOOK,
      );
      if (!fb) {
        return null;
      }
      try {
        const cacheKey = `FB_AVATAR_${fb.id}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
          return cached;
        }
        const { data } = await axios.get(
          `https://graph.facebook.com/${fb.id}/picture?redirect=false&access_token=${FB_APP_ID}|${FB_SECRET}`,
        );
        const downloaded = get(data, 'data.url', null);
        // ttl is in seconds
        await redis.set(
          cacheKey,
          downloaded,
          'EX',
          downloaded ? 24 * 60 * 60 : 60 * 60,
        );
        return downloaded;
      } catch (e) {
        log.error({ message: 'failed to fetch fb user pic', error: e });
        return null;
      }
    }
    return null;
  }
}
