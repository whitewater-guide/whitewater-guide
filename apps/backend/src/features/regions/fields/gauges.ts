import type { Knex } from 'knex';

import type { RegionResolvers } from '../../../apollo/index';

const gaugesResolver: RegionResolvers['gauges'] = (
  { id },
  { page },
  { dataSources },
  info,
) => {
  const query = dataSources.gauges.getMany(info, { page });
  query
    .innerJoin(
      'sources_regions',
      'gauges_view.source_id',
      'sources_regions.source_id',
    )
    .where('sources_regions.region_id', '=', id)
    .whereExists((qb: Knex.QueryBuilder) => {
      qb.select('*')
        .from('sections')
        .whereRaw('sections.gauge_id = gauges_view.id');
    });

  return query;
};

export default gaugesResolver;
