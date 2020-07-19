import {
  Descent,
  DescentsFilter,
  RelayConnection,
} from '@whitewater-guide/commons';
import { DataSourceConfig } from 'apollo-datasource';
import { ForbiddenError, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { QueryBuilder } from 'knex';
import { Context } from '~/apollo';
import db from '~/db';
import { FieldsMap, ManyBuilderOptions } from '~/db/connectors';
import { RelayConnector } from '~/db/connectors/RelayConnector';
import { DescentRaw, ShareToken } from './types';
import { Cursor } from '~/apollo/cursor';

const FIELDS_MAP: FieldsMap<Descent, DescentRaw> = {
  section: 'section_id',
  level: ['level_unit', 'level_value'],
};

interface GetManyOptions extends ManyBuilderOptions<DescentRaw> {
  filter?: DescentsFilter | null;
}

export class DescentsConnector extends RelayConnector<Descent, DescentRaw> {
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

  protected getAfterClause(cursor: Cursor): string {
    const afterval = new Date(Number(cursor.value)).toISOString();
    return `("descents"."started_at", "descents"."ord_id") < ('${afterval}', ${cursor.ordId})`;
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

  public async getMany(
    options: GetManyOptions,
  ): Promise<RelayConnection<any, Cursor>> {
    const query = super.getManyQuery(options);

    // Only public or owned descents
    if (this._user?.id) {
      const uid = this._user?.id;
      query.where(function() {
        this.where('public', true).orWhere('user_id', uid);
      });
    } else {
      query.where('public', true);
    }

    const { difficulty, startDate, endDate, sectionId, sectionName, userId } =
      options.filter || {};

    if (difficulty) {
      if (difficulty.length !== 2) {
        throw new UserInputError('difficulty filter must contain two values');
      }
      query.whereExists(function() {
        this.select('*')
          .from('sections')
          .whereRaw('"sections"."id" = "descents"."section_id"')
          .where('sections.difficulty', '>=', difficulty[0])
          .where('sections.difficulty', '<=', difficulty[1]);
      });
    }

    if (startDate) {
      query.where('started_at', '>=', startDate);
    }

    if (endDate) {
      query.where('started_at', '<=', endDate);
    }

    if (sectionId) {
      query.where({ section_id: sectionId });
    }

    if (userId) {
      query.where({ user_id: userId });
    }

    if (sectionName) {
      const searchStr = `%${sectionName.trim().toLocaleLowerCase()}%`;
      query.whereExists(function() {
        this.select('*')
          .from('sections_view')
          .where('sections_view.id', '=', 'descents.section_id')
          .andWhere(function() {
            this.where('sections_view.name', 'ILIKE', searchStr)
              .orWhere('sections_view.river_name', 'ILIKE', searchStr)
              .orWhereExists(function() {
                this.select('*')
                  .from(db().raw('unnest(sections_view.alt_names) namez'))
                  .where('namez', 'ILIKE', searchStr);
              });
          });
      });
    }

    const result = await query;
    return result?.length
      ? this.itemsToConnection(result, result[0].count, 'started_at')
      : { edges: [], pageInfo: { hasMore: false, endCursor: null } };
  }
}
