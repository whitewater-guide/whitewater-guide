/* eslint-disable @typescript-eslint/no-invalid-this */
import {
  Descent,
  DescentInput,
  DescentsFilter,
  RelayConnection,
} from '@whitewater-guide/schema';
import { DataSourceConfig } from 'apollo-datasource';
import { ForbiddenError, UserInputError } from 'apollo-server-koa';
import * as jwt from 'jsonwebtoken';
import { QueryBuilder } from 'knex';

import { Context, Cursor } from '~/apollo';
import config from '~/config';
import { db, Sql } from '~/db';
import { FieldsMap, ManyBuilderOptions } from '~/db/connectors';
import { RelayConnector } from '~/db/connectors/RelayConnector';

import { ShareToken } from './types';

const FIELDS_MAP: FieldsMap<Descent, Sql.Descents> = {
  section: 'section_id',
  level: ['level_unit', 'level_value'],
};

interface GetManyOptions extends ManyBuilderOptions<Sql.Descents> {
  filter?: DescentsFilter | null;
}

export class DescentsConnector extends RelayConnector<Descent, Sql.Descents> {
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

  initialize(cfg: DataSourceConfig<Context>) {
    super.initialize(cfg);
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
      let sectionsQuery: QueryBuilder =
        this._context.dataSources.sections.buildGenericQuery();
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
      const decoded = jwt.verify(
        shareToken,
        config.DESCENTS_TOKEN_SECRET,
      ) as ShareToken;
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
    return jwt.sign(token, config.DESCENTS_TOKEN_SECRET, {
      noTimestamp: true,
    });
  }

  public async getMany(options: GetManyOptions): Promise<RelayConnection<any>> {
    const query = super.getManyQuery(options);

    // Only public or owned descents
    if (this._user?.id) {
      const uid = this._user?.id;
      query.where(function () {
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
      query.whereExists(function () {
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
      const searchStr = sectionName.trim().toLocaleLowerCase();
      const isearchStr = `%${searchStr}%`;
      query.whereExists(function () {
        this.select('*')
          .from('sections_view')
          .whereRaw('"sections_view"."id" = "descents"."section_id"')
          .andWhere(function () {
            this.where('sections_view.name', 'ILIKE', isearchStr)
              .orWhere('sections_view.river_name', 'ILIKE', isearchStr)
              .orWhereRaw(
                `similarity("sections_view"."river_name" || ' ' || "sections_view"."name", ?::text) > 0.5`,
                searchStr,
              )
              .orWhereExists(function () {
                this.select('*')
                  .from(db().raw('unnest(sections_view.alt_names) namez'))
                  .where('namez', 'ILIKE', isearchStr);
              });
          });
      });
    }

    const result = await query;
    return result?.length
      ? this.itemsToConnection(result, result[0].count, 'started_at')
      : { edges: [], pageInfo: { hasMore: false, endCursor: null } };
  }

  public async deleteById(id: string) {
    const row = await db()
      .select(['user_id'])
      .from('descents')
      .where({ id })
      .first();
    if (!row?.user_id) {
      throw new UserInputError('not found');
    }
    if (row.user_id !== this._user?.id) {
      throw new ForbiddenError('forbidden');
    }
    await db().delete().from('descents').where({ id });
  }

  public async upsert(input: DescentInput, token?: string | null) {
    let shared: ShareToken | undefined;

    if (!this._user) {
      throw new Error('descent user not found');
    }

    if (token) {
      shared = jwt.verify(token, config.DESCENTS_TOKEN_SECRET) as any;
    }

    const parentDescentCTE = db()
      .select(['id', 'parent_id'])
      .from('descents')
      .where({ id: shared?.descent || null })
      .unionAll(function () {
        this.select(['descents.id', 'descents.parent_id'])
          .from('parent_descents')
          .join('descents', 'parent_descents.parent_id', 'descents.id');
      });

    const raw: Partial<Sql.Descents> = {
      parent_id: db().raw(
        '(SELECT parent_descents.id FROM parent_descents WHERE parent_descents.parent_id IS NULL)',
      ) as any,
      user_id: this._user.id,
      section_id: input.sectionId,
      started_at: new Date(input.startedAt),

      comment: input.comment || null,
      duration: input.duration || null,
      level_value: input.level?.value ?? null,
      level_unit: input.level?.unit ?? null,
      public: input.public || false,
    };
    if (input.id) {
      raw.id = input.id;
    }

    const result = await db().raw(
      `WITH RECURSIVE parent_descents( id, parent_id ) AS (?) ? ON CONFLICT (id)
      DO UPDATE SET
        parent_id   = EXCLUDED.parent_id,
        section_id  = EXCLUDED.section_id,
        started_at  = EXCLUDED.started_at,
        comment     = EXCLUDED.comment,
        duration    = EXCLUDED.duration,
        level_value = EXCLUDED.level_value,
        level_unit  = EXCLUDED.level_unit,
        public      = EXCLUDED.public
      RETURNING *
    `,
      [parentDescentCTE, db().table('descents').insert(raw)],
    );

    return result.rows[0];
  }
}
