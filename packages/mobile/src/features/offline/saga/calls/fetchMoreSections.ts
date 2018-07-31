import { ObservableQuery } from 'apollo-client';
import { getListMerger, Page } from '../../../../ww-clients/apollo';
import { Result, Vars } from '../../offlineSections.query';

export default async function fetchMoreSections(query: ObservableQuery<Result, Vars>, page?: Page) {
  await query.fetchMore({
    variables: { page },
    updateQuery: getListMerger('sections') as any,
  });
}
