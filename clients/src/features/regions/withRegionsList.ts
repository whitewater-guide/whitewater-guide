import { gql } from 'react-apollo';
import { Region } from '../../../ww-commons';
import { enhancedQuery } from '../../apollo';

const ListRegionsQuery = gql`
  query listRegions {
    regions {
      id
      name
      riversCount
      sectionsCount
    }
  }
`;

interface Result {
  regions: Region[];
}

export interface RegionsList {
  list: Region[];
  loading: boolean;
  refetch: () => void;
}

export interface WithRegionsList {
  regions: RegionsList;
}

export const withRegionsList = enhancedQuery<Result, any, WithRegionsList>(
  ListRegionsQuery,
  {
    options: {
      fetchPolicy: 'cache-and-network',
      // TODO: use update instead of reducer, as reducer is deprecated
      // reducer: regionsListReducer,
      notifyOnNetworkStatusChange: true,
    } as any, // TODO: https://github.com/apollographql/react-apollo/issues/896 should be fixed
    props: ({ data }) => {
      const { regions, loading, refetch } = data!;
      return { regions: { list: regions || [], loading, refetch } };
    },
  },
);
