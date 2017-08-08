import { gql } from 'react-apollo';
import { enhancedQuery } from '../../apollo';
import { Region } from '../../ww-commons';

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

interface ChildProps {
  regions: Region[];
  regionsListLoading: boolean;
  refetchRegionsList: () => void;
}

export const withRegionsList = enhancedQuery<Result, any, ChildProps>(
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
      return {
        regions: regions || [],
        regionsListLoading: loading && !regions,
        refetchRegionsList: refetch,
      };
    },
  },
);
