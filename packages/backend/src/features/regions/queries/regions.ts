import { ListQuery, TopLevelResolver } from '@apollo';

const regions: TopLevelResolver<ListQuery> = async (_, {  page }, { models }, info) =>
  models.regions.getMany(info, { page });

export default regions;
