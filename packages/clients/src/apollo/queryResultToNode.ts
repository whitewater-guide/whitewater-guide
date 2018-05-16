import { ChildProps, QueryResult } from 'react-apollo';
import { ResourceType } from '../../ww-commons';
import { WithNode } from './types';

type GraphqlResult<T, R extends ResourceType> = {
  [prop in R]: T
};

type Result<T, R extends ResourceType> = {
  [prop in R]: WithNode<T>
};

type Props<T, R extends ResourceType> = ChildProps<any, GraphqlResult<T, R>> | QueryResult<T>;

/**
 * Accepts both render function argument of new Apollo Query and childProps of old graphqlHoc
 * @param {Props<T, R extends ResourceType>} props
 * @param {R} propName
 * @returns {Result<T, R extends ResourceType>}
 */
export const queryResultToNode =
  <T, R extends ResourceType>(props: Props<T, R>, propName: R): Result<T, R> => {
  const auxObject = props.hasOwnProperty('client') ? props : props.data;
  const node = props.data ? props.data[propName] : null;
  const { error, loading, networkStatus, refetch } = auxObject;
  return {
    [propName]: {
      node,
      loading,
      networkStatus,
      error,
      refetch,
    },
  } as any;
};
