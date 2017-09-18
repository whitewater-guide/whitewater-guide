// tslint:disable:variable-name
import * as Knex from 'knex';
import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver, isInputValidResolver } from '../../../apollo';
import db from '../../../db';
import { RegionInput, RegionInputSchema } from '../../../ww-commons';
import { toRaw as toRawPoint } from '../../points';
import { toRaw } from '../types';

interface UpsertVariables {
  region: RegionInput;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, region: RegionInput) => {
  const raw = toRaw(region);
  const { id, ...rest } = raw;
  let result = null;
  await db().transaction(async (trx) => {
    let region_id = id;
    if (id) {
      await trx.table('regions').where({ id }).update(rest);
      // Delete and create all points again, CASCADE should delete points_regions rows
      await trx.table('points')
        .whereExists(function(this: Knex) {
          // tslint:disable-next-line:no-invalid-this
          this.select('*').from('points_regions').whereRaw(
            'region_id = ? AND point_id = points.id',
            [id],
          );
        })
        .del();
    } else {
      const inserted = await trx.table('regions').insert(raw).returning('id');
      region_id = inserted[0];
    }
    if (region.pois.length > 0) {
      const poiIds = await trx.table('points').insert(region.pois.map(toRawPoint)).returning('id');
      const poisRegions = poiIds.map((point_id: string) => ({ point_id, region_id }));
      await trx.table('points_regions').insert(poisRegions);
    }
    result = await trx.select('*').from('regions_view').where({ id: region_id }).first();
  });
  return result;
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  const { region } = args;
  return isInputValidResolver(RegionInputSchema).createResolver(resolver)(root, region, context, info);
};

const upsertRegion = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertRegion;
