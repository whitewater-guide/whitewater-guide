import { gql } from 'react-apollo';
import { enhancedQuery } from '../../apollo';
import regionsListReducer from './regionsListReducer';

const ListRegionsQuery = gql`
  query listRegions {
    regions {
      _id,
      name,
      riversCount,
      sectionsCount,
    }
  }
`;

const withRegionsList = enhancedQuery(
  ListRegionsQuery,
  {
    options: {
      fetchPolicy: 'cache-and-network',
      reducer: regionsListReducer,
      notifyOnNetworkStatusChange: true,
    },
    props: ({ data: { regions, loading, refetch } }) => ({
      regions: regions || [],
      regionsListLoading: loading && !regions,
      refetchRegionsList: refetch,
    }),
  },
);

export default withRegionsList;
