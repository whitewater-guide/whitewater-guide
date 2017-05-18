import { graphql } from 'react-apollo';
import _ from 'lodash';

/**
 * Helper function to wrap error and refetch handlers of graphql containers and pass them down
 * Does not overwrite errors from other graphql containers. Instead, merges them.
 * @param errorPropName Name of grpahql container that caused error, it will be the key in errors object
 * @param dataPropName If network error is present, but data in this props is also present (e.g. cached data), then swallow error
 * @param mapProps Function to map props when no error is found
 */
const wrapErrors = (errorPropName, dataPropName, mapProps) => (props) => {
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
 * TODO: automatically filter __typenames here
 * @param query Same as in graphql
 * @param config Same as in graphql
 * @returns {*}
 */
const enhancedQuery = (query, config) => {
  const queryDef = query.definitions.find(({ operation }) => operation === 'query');
  const mapProps = config && config.props;
  if (queryDef && _.isFunction(mapProps)) {
    const errorPropName = queryDef.name.value;
    const dataPropName = queryDef.selectionSet.selections[0].name.value;
    const wrappedMapProps = wrapErrors(errorPropName, dataPropName, mapProps);
    return graphql(query, { ...config, props: wrappedMapProps });
  }
  return graphql(query, config);
};

export default enhancedQuery;
