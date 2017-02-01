import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const ListRegionsQuery = gql`
  query ListRegions {
    regions {
      _id,
      name,
    }
  }
`;

export default graphql(
  ListRegionsQuery, {
    props: ({data: {regions}}) => ({regions: regions || []})
  }
);