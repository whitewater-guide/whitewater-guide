import { SectionResolvers } from '~/apollo';

const gaugeResolver: SectionResolvers['gauge'] = (
  { gauge_id },
  _,
  { dataSources },
) => dataSources.gauges.getById(gauge_id);

export default gaugeResolver;
