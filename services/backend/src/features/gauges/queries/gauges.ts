import { ListQuery, TopLevelResolver } from '@apollo';

interface Vars extends ListQuery {
  sourceId?: string;
}

const gauges: TopLevelResolver<Vars> = async (
  _,
  { sourceId, page },
  { dataSources },
  info,
) => {
  const where = sourceId ? { source_id: sourceId } : undefined;
  const result = await dataSources.gauges.getMany(info, { where, page });
  return result;
};

export default gauges;
