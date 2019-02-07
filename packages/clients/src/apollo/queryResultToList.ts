import {
  Connection,
  ListType,
  Page,
  updateList,
} from '@whitewater-guide/commons';
import { NetworkStatus } from 'apollo-client';
import { ChildProps } from 'react-apollo';
import { WithList } from './types';

type QueryResult<T, R extends ListType> = { [prop in R]: Connection<T> };

type Result<T, R extends ListType> = { [prop in R]: WithList<T> };

interface FMResult<T, R extends ListType> {
  fetchMoreResult: QueryResult<T, R>;
}

const noop = () => Promise.resolve(false);

export const getListMerger = <T, R extends ListType>(propName: R) => (
  prevResult: QueryResult<T, R>,
  { fetchMoreResult: nextResult }: FMResult<T, R>,
) => {
  // This happens when fetchMore used without initial fetch (as in region sections container)
  if (!prevResult || !prevResult[propName]) {
    return nextResult;
  }
  const {
    [propName]: { nodes: prevNodes, __typename },
  } = prevResult as any;
  const {
    [propName]: { nodes: newNodes, count },
  } = nextResult as any;
  const nodes = updateList(prevNodes, newNodes);
  return {
    [propName]: {
      __typename,
      count: Math.max(nodes.length, count),
      nodes,
    },
  };
};

export const queryResultToList = <T, R extends ListType>(
  props: ChildProps<any, QueryResult<T, R>>,
  propName: R,
  pageSize = 20,
): Result<T, R> => {
  const auxObject = props.hasOwnProperty('client') ? props : props.data;
  const listRaw = props.data ? props.data[propName] : null;
  const { error, loading, refetch, fetchMore, networkStatus } = auxObject;
  const list = listRaw || { nodes: [], count: 0 };
  const offset = list.nodes.length;
  const canLoadMore =
    listRaw && offset < list.count && networkStatus === NetworkStatus.ready;
  const page: Page = { offset, limit: pageSize };
  const loadMore = canLoadMore
    ? () =>
        fetchMore({
          variables: { page },
          updateQuery: getListMerger<T, R>(propName),
        })
    : noop;

  return {
    [propName]: {
      nodes: list.nodes,
      count: list.count,
      networkStatus,
      loading,
      error,
      refetch,
      fetchMore: loadMore,
    },
  } as any;
};
