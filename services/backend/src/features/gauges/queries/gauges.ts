import { ListQuery, TopLevelResolver } from '@apollo';

interface Vars extends ListQuery {
  sourceId?: string;
}

const gauges: TopLevelResolver<Vars> = (
  _,
  { sourceId, page },
  { dataSources },
  info,
) => {
  const where = sourceId ? { source_id: sourceId } : undefined;
  return dataSources.gauges.getMany(info, { where, page });
};

export default gauges;
