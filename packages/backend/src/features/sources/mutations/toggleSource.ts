import { MutationResolvers } from '~/apollo';

const toggleSource: MutationResolvers['toggleSource'] = async (
  _,
  { id, enabled },
  { dataSources },
) => {
  const res = await dataSources.gorge.toggleJobForSource(id, enabled);
  return { id, enabled: res };
};

export default toggleSource;
