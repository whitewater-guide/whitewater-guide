import { RegionResolvers } from '~/apollo';

const sourcesResolver: RegionResolvers['sources'] = (
  { id },
  { page },
  { dataSources },
  info,
) => {
  const query = dataSources.sources.getMany(info, { page });
  query
    .innerJoin(
      'sources_regions',
      'sources_view.id',
      'sources_regions.source_id',
    )
    .where('sources_regions.region_id', '=', id);

  return query;
};

export default sourcesResolver;
