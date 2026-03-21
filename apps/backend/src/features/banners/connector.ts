import type { Banner } from '@whitewater-guide/schema';
import type { GraphQLResolveInfo } from 'graphql';
import type { Knex } from 'knex';

import type { Context } from '../../apollo/index';
import type { FieldsMap, ManyBuilderOptions } from '../../db/connectors/index';
import { OffsetConnector } from '../../db/connectors/index';
import type { Sql } from '../../db/index';
import { db } from '../../db/index';

const FIELDS_MAP: FieldsMap<Banner, Sql.Banners> = {
  regions: null,
  groups: null,
  deleted: null,
};

interface GetManyOptions extends ManyBuilderOptions<Sql.Banners> {
  regionId?: string;
}

export class BannersConnector extends OffsetConnector<Banner, Sql.Banners> {
  constructor(context: Context) {
    super(context);
    this._tableName = 'banners';
    this._graphqlTypeName = 'Banner';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'group_priority', direction: 'desc' },
      { column: 'priority', direction: 'desc' },
    ];
    this._language = undefined;
  }

  getMany(
    info: GraphQLResolveInfo,
    { regionId, ...options }: GetManyOptions = {},
  ) {
    const query = super.getMany(info, options);
    if (regionId) {
      query.with('region_banners_own', (qb: Knex.QueryBuilder) => {
        qb.table('banners_regions').select().where({ region_id: regionId });
      });
      query.with('region_banners_group', (qb: Knex.QueryBuilder) => {
        qb.table('banners_groups')
          .innerJoin(
            'regions_groups',
            'banners_groups.group_id',
            '=',
            'regions_groups.group_id',
          )
          .select('banners_groups.*')
          .where({ region_id: regionId });
      });
      query.leftJoin(
        'region_banners_own',
        'region_banners_own.banner_id',
        '=',
        'banners.id',
      );
      query.select(
        db().raw(
          `CASE WHEN region_banners_own.banner_id IS NOT NULL THEN 1 ELSE 0 END AS group_priority `,
        ),
      );
      query.where((qb: Knex.QueryBuilder) => {
        qb.whereIn('id', function wherCond(this: Knex.QueryBuilder) {
          this.select('banner_id').from('region_banners_own');
        }).orWhereIn('id', function wherCond(this: Knex.QueryBuilder) {
          this.select('banner_id').from('region_banners_group');
        });
      });
    } else {
      query.select(db().raw('0 as group_priority'));
    }
    return query;
  }
}
