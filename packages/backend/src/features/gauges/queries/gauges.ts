import type { Knex } from 'knex';

import type { QueryResolvers } from '../../../apollo/index';

const gauges: QueryResolvers['gauges'] = async (
  _,
  { filter = {}, page },
  { dataSources },
  info,
) => {
  const { regionId, sourceId, search } = filter ?? {};
  const where = sourceId ? { source_id: sourceId } : undefined;
  let query = dataSources.gauges.getMany(info, { where, page });
  if (search) {
    query = query.where('name', 'ilike', `%${search}%`);
  }
  if (!sourceId && regionId) {
    query = query.whereExists((qb: Knex.QueryBuilder) =>
      qb
        .select('region_id')
        .from('sources_regions')
        .where({ region_id: regionId })
        .andWhereRaw('sources_regions.source_id = gauges_view.source_id'),
    );
  }
  const result = await query;
  return result;
};

export default gauges;
