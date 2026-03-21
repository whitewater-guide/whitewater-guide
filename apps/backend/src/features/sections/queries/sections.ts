import type { QueryResolvers } from '../../../apollo/index';

const sections: QueryResolvers['sections'] = async (
  _,
  { filter, page, updatedAfter },
  { dataSources, user },
  info,
) => {
  if (filter?.editable && !user) {
    return [];
  }
  const result = await dataSources.sections.getMany(info, {
    filter: filter!,
    page,
    updatedAfter,
  });
  return result;
};

export default sections;
