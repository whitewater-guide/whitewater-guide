import { Descent } from '@whitewater-guide/commons';
import { DataSourceConfig } from 'apollo-datasource';
import { ForbiddenError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { QueryBuilder } from 'knex';
import { Context } from '~/apollo';
import db from '~/db';
import { BaseConnector, FieldsMap } from '~/db/connectors';
import { DescentRaw, ShareToken } from './types';

const FIELDS_MAP: FieldsMap<Descent, DescentRaw> = {
  section: 'section_id',
  level: ['level_unit', 'level_value'],
};

export class DescentsConnector extends BaseConnector<Descent, DescentRaw> {
  constructor() {
    super();
    this._tableName = 'descents';
    this._graphqlTypeName = 'Descent';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'started_at', direction: 'desc' },
      { column: 'ord_id', direction: 'desc' },
    ];
    this._sqlFields.push('ord_id', 'user_id');
  }

  initialize(config: DataSourceConfig<Context>) {
    super.initialize(config);
    // Descents are not i18ned
    this._language = undefined;
  }

  public buildGenericQuery(): QueryBuilder {
    const query = super.buildGenericQuery();
    if (this._fieldsByType.get(this._graphqlTypeName)?.has('section')) {
      let sectionsQuery: QueryBuilder = this._context.dataSources.sections.buildGenericQuery();
      sectionsQuery = sectionsQuery.whereRaw(
        '"sections_view"."id" = "descents"."section_id"',
      );
      query.select(
        db().raw(
          `( SELECT row_to_json(sec) FROM (${sectionsQuery.toQuery()}) sec ) as section`,
        ),
      );
    }
    return query;
  }

  async getOne(id?: string | null, shareToken?: string | null) {
    let identifier = id;
    let fromShareToken = false;
    if (!id && shareToken) {
      const decoded: ShareToken = jwt.verify(
        shareToken,
        process.env.DESCENTS_TOKEN_SECRET!,
      ) as any;
      if (!decoded.descent) {
        throw new ForbiddenError('share token does not contain descent id');
      }
      identifier = decoded.descent;
      fromShareToken = true;
    }
    if (!identifier) {
      return null;
    }
    const query = this.buildGenericQuery();
    query.where('descents.id', '=', identifier);
    const result = await query.first();
    if (
      !result.public &&
      !(
        result.user_id === this._context.user?.id ||
        (this._context.user?.id && fromShareToken)
      )
    ) {
      throw new ForbiddenError('forbidden');
    }

    return result || null;
  }

  public async getShareToken(id: string) {
    const row = await db()
      .table('descents')
      .select(['user_id', 'section_id'])
      .where({ id })
      .first();
    if (row.user_id !== this._context.user?.id) {
      throw new ForbiddenError('forbidden');
    }
    const token: ShareToken = {
      descent: id,
      section: row.section_id as any,
    };
    return jwt.sign(token, process.env.DESCENTS_TOKEN_SECRET!, {
      noTimestamp: true,
    });
  }
}
