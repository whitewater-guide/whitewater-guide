import { gql } from 'react-apollo';
import { enhancedQuery } from '../../apollo';

const ListRegionsQuery = gql`
  query listRegions {
    regions {
      _id,
      name,
    }
  }
`;

const withRegionsList = enhancedQuery(
  ListRegionsQuery,
  {
    options: {
      notifyOnNetworkStatusChange: true,
    },
    props: ({ data: { regions, loading } }) => ({ regions: regions || [], regionsListLoading: loading }),
  },
);

export default withRegionsList;
