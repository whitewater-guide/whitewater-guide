import { Connection, ListType, updateList } from '@whitewater-guide/commons';

type QueryResult<T, R extends ListType> = { [prop in R]: Connection<T> };

interface FMResult<T, R extends ListType> {
  fetchMoreResult?: QueryResult<T, R>;
}

export const getListMerger = <T, R extends ListType>(propName: R) => (
  prevResult: QueryResult<T, R>,
  { fetchMoreResult: nextResult }: FMResult<T, R>,
): QueryResult<T, R> => {
  // This happens when fetchMore used without initial fetch (as in region sections container)
  if (!prevResult || !prevResult[propName]) {
    if (nextResult) {
      return nextResult;
    }
    return {
      [propName]: {
        count: 0,
        nodes: [],
      },
    } as any;
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
  } as any;
};
