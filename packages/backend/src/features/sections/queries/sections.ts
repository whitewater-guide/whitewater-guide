import { QueryResolvers } from '~/apollo';

const sections: QueryResolvers['sections'] = async (
  _,
  { filter, page },
  { dataSources, user },
  info,
) => {
  if (filter?.editable && !user) {
    return [];
  }
  const result = await dataSources.sections.getMany(info, { filter, page });
  return result;
};

export default sections;
