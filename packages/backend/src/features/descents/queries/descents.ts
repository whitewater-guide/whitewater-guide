import { DescentsFilter, Page } from '@whitewater-guide/commons';

import { TopLevelResolver } from '~/apollo';

interface Vars {
  filter: DescentsFilter;
  page: Page;
}

const descents: TopLevelResolver<Vars> = async (
  _,
  { filter, page },
  { dataSources },
) => {
  const result = await dataSources.descents.getMany({ filter, page });
  return result;
};

export default descents;
