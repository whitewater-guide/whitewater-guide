import { gql, graphql } from 'react-apollo';
import { wrapErrors } from '../../apollo';

const ListRegionsQuery = gql`
  query listRegions {
    regions {
      _id,
      name,
    }
  }
`;

const withRegionsList = graphql(
  ListRegionsQuery,
  {
    options: {
      notifyOnNetworkStatusChange: true,
    },
    props: wrapErrors(
      'regions',
      ({ data: { regions, loading } }) => ({ regions: regions || [], regionsListLoading: loading }),
    ),
  },
);

export default withRegionsList;
