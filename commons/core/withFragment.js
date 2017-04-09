import { withApollo } from 'react-apollo';
import { compose, mapProps } from 'recompose';

/**
 * This is helper HOC that simply reads something from store and passes it to wrapped component
 * When using this, you must be sure that data is already in store
 * @param fragment gql compiled fragment
 * @param idFromProps function to get apollo id from wrapped component's props
 * @param propName name of new prop with retrieved data for fragment
 */
export const withFragment = ({ fragment, idFromProps, propName }) => compose(
  withApollo,
  mapProps(({ client, ...props }) => ({
    ...props,
    [propName]: client.readFragment({ id: idFromProps(props), fragment }),
  })),
);
