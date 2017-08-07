import { DocumentNode, FieldNode, OperationDefinitionNode } from 'graphql';
import { isFunction } from 'lodash';
import { graphql, OperationOption } from 'react-apollo';
import { ComponentDecorator } from 'react-apollo/types';

export interface ErrorItem {
  error: any;
  refetch: () => void;
}

type WithErrors = Record<string, ErrorItem>;

/**
 * Helper function to wrap error and refetch handlers of graphql containers and pass them down
 * Does not overwrite errors from other graphql containers. Instead, merges them.
 * @param errorPropName Name of grpahql container that caused error, it will be the key in errors object
 * @param dataPropName If network error is present, but data in this props is also present
 * (e.g. cached data), then swallow error
 * @param mapProps Function to map props when no error is found
 */
const wrapErrors = (errorPropName: string, dataPropName: string, mapProps: any) => (props: any) => {
  const { data, ownProps } = props;
  const { error, refetch } = data;
  let errors = ownProps.errors || {};
  if (error) {
    if (error.networkError && data.hasOwnProperty(dataPropName)) {
      console.log(`$Error ${error.errorMessage}`);
    } else {
      errors = { ...errors, [errorPropName]: { error, refetch } };
    }
  }
  return { ...mapProps(props), errors };
};

/**
 * Graphql query wrapper that stuffs errors into props of wrapped component
 * @param query Same as in graphql
 * @param config Same as in graphql
 * @returns {*}
 */
const enhancedQuery = <TResult, TProps, TChildProps>(
  query: DocumentNode,
  config: OperationOption<TProps, TResult>,
): ComponentDecorator<TProps, TChildProps & WithErrors> => {
  const queryDef: OperationDefinitionNode = query.definitions.find(
    ({ operation }: OperationDefinitionNode) => operation === 'query',
  ) as OperationDefinitionNode;
  const mapProps = config && config.props;
  if (queryDef && isFunction(mapProps)) {
    const errorPropName = queryDef.name!.value;
    const dataPropName = (queryDef.selectionSet.selections[0] as FieldNode).name.value;
    const wrappedMapProps = wrapErrors(errorPropName, dataPropName, mapProps);
    return graphql<TResult, TProps, TChildProps & WithErrors>(query, { ...config, props: wrappedMapProps });
  }
  return graphql<TResult, TProps, TChildProps & WithErrors>(query, config);
};

export default enhancedQuery;
