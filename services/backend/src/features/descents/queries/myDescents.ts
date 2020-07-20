import { DescentsFilter, Page } from '@whitewater-guide/commons';
import { TopLevelResolver, isAuthenticatedResolver } from '~/apollo';

interface Vars {
  filter: DescentsFilter;
  page: Page;
}

const myDescents: TopLevelResolver<Vars> = async (
  _,
  { filter, page },
  { dataSources, user },
) => {
  const result = await dataSources.descents.getMany({
    filter: { ...filter, userId: user?.id },
    page,
  });
  return result;
};

export default isAuthenticatedResolver(myDescents);
