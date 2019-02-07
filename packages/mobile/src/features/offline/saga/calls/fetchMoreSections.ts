import { getListMerger } from '@whitewater-guide/clients';
import { Page } from '@whitewater-guide/commons';
import { ObservableQuery } from 'apollo-client';
import { Result, Vars } from '../../offlineSections.query';

export default async function fetchMoreSections(
  query: ObservableQuery<Result, Vars>,
  page?: Page,
) {
  await query.fetchMore({
    variables: { page },
    updateQuery: getListMerger('sections') as any,
  });
}
