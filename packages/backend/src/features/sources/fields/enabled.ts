import { SourceResolvers } from '~/apollo';

const sourceEnabledResolver: SourceResolvers['enabled'] = async (
  { id },
  _,
  { dataSources },
) => {
  const enabled = await dataSources.gorge.isSourceEnabled(id);
  return !!enabled;
};

export default sourceEnabledResolver;
