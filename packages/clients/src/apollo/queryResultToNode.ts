import { ChildProps } from 'react-apollo';
import { ResourceType } from '../../ww-commons';
import { WithNode } from './types';

type QueryResult<T, R extends ResourceType> = {
  [prop in R]: T
};

type Result<T, R extends ResourceType> = {
  [prop in R]: WithNode<T>
};

export const queryResultToNode =
  <T, R extends ResourceType>(props: ChildProps<any, QueryResult<T, R>>, propName: R): Result<T, R> => {
  const { data } = props;
  const { [propName]: node, error, loading, refetch } = data;
  return {
    [propName]: {
      node,
      loading,
      error,
      refetch,
    },
  } as any;
};
