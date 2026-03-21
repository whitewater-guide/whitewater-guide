import type { QueryResolvers } from '../../../apollo/index';

const regions: QueryResolvers['regions'] = async (
  _,
  { page, filter },
  { dataSources },
  info,
) => {
  let query = dataSources.regions.getMany(info, { page });
  const { searchString } = filter ?? {};
  if (searchString) {
    query = query.where('name', 'ilike', `%${searchString}%`);
  }
  const result = await query;
  return result;
};

export default regions;
