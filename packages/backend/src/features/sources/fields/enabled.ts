import type { SourceResolvers } from '../../../apollo/index';

const sourceEnabledResolver: SourceResolvers['enabled'] = async (
  { id },
  _,
  { dataSources },
) => {
  const enabled = await dataSources.gorge.isSourceEnabled(id);
  return !!enabled;
};

export default sourceEnabledResolver;
