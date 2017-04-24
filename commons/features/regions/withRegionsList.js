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
      reducer: regionsListReducer,
      notifyOnNetworkStatusChange: true,
    },
    props: ({ data: { regions, loading } }) => ({ regions: regions || [], regionsListLoading: loading }),
  },
);

export default withRegionsList;
