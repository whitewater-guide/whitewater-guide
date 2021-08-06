import { Banner } from '@whitewater-guide/schema';
import { DataSourceConfig } from 'apollo-datasource';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';

import { Context } from '~/apollo';
import { db, Sql } from '~/db';
import {
  FieldsMap,
  ManyBuilderOptions,
  OffsetConnector,
} from '~/db/connectors';

const FIELDS_MAP: FieldsMap<Banner, Sql.Banners> = {
  regions: null,
  groups: null,
  deleted: null,
};

interface GetManyOptions extends ManyBuilderOptions<Sql.Banners> {
  regionId?: string;
}

export class BannersConnector extends OffsetConnector<Banner, Sql.Banners> {
  constructor() {
    super();
    this._tableName = 'banners';
    this._graphqlTypeName = 'Banner';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'group_priority', direction: 'desc' },
      { column: 'priority', direction: 'desc' },
    ];
  }

  initialize(config: DataSourceConfig<Context>) {
    super.initialize(config);
    // Banners are not i18ned
    this._language = undefined;
  }

  getMany(
    info: GraphQLResolveInfo,
    { regionId, ...options }: GetManyOptions = {},
  ) {
    const query = super.getMany(info, options);
    if (regionId) {
      query.with('region_banners_own', (qb: QueryBuilder) => {
        qb.table('banners_regions').select().where({ region_id: regionId });
      });
      query.with('region_banners_group', (qb: QueryBuilder) => {
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
      query.where((qb: QueryBuilder) => {
        qb.whereIn('id', function wherCond(this: QueryBuilder) {
          this.select('banner_id').from('region_banners_own');
        }).orWhereIn('id', function wherCond(this: QueryBuilder) {
          this.select('banner_id').from('region_banners_group');
        });
      });
    } else {
      query.select(db().raw('0 as group_priority'));
    }
    return query;
  }
}
