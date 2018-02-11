import { ChildProps } from 'react-apollo';
import { Connection, ListType } from '../../ww-commons';
import { WithList } from './types';

type QueryResult<T, R extends ListType> = {
  [prop in R]: Connection<T>
};

type Result<T, R extends ListType> = {
  [prop in R]: WithList<T>
};

export const queryResultToList =
  <T, R extends ListType>(props: ChildProps<any, QueryResult<T, R>>, propName: R): Result<T, R> => {
  const { data } = props;
  const { [propName]: list, error, loading, refetch, fetchMore } = data;
  return {
    [propName]: {
      nodes: list ? list.nodes : [],
      count: list ? list.count : 0,
      loading,
      error,
      refetch,
      fetchMore,
    },
  } as any;
};
