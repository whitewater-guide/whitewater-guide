import { SourceResolvers } from '~/apollo';

const gaugesResolver: SourceResolvers['gauges'] = (
  { id },
  { page },
  { dataSources },
  info,
) => dataSources.gauges.getMany(info, { page, where: { source_id: id } });

export default gaugesResolver;
