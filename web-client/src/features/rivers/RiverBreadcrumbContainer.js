import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withFeatureIds} from '../../commons/core';

const RiverBreadcrumbQuery = gql`
  query riverBreadcrumb($riverId:ID!, $language: String) {
    river(_id:$riverId, language:$language) {
      _id
      name
      region {
        _id
        name
      }
    }
  }
`;

export default compose(
  withFeatureIds('river'),
  graphql(
    RiverBreadcrumbQuery, {
      props: ({data: {river, loading}}) => ({river, loading}),
    }
  ),
);