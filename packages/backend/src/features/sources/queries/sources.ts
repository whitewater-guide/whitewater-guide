import { ListQuery, TopLevelResolver } from '@apollo';

const sources: TopLevelResolver<ListQuery> = async (_, {  page }, { models }, info) =>
  models.sources.getMany(
    info,
    {
      page,
    },
  );

export default sources;
