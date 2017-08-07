import { gql } from 'react-apollo';
import { ComponentDecorator } from 'react-apollo/types';
import { enhancedQuery } from '../../apollo';
import { ErrorItem } from '../../apollo/enhancedQuery';
import { Region } from './types';

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

export interface WithRegionsResult {
  regions: Region[];
}

export interface WithRegionsChildProps {
  regions: Region[];
  regionsListLoading: boolean;
  refetchRegionsList: () => void;
}

export const withRegionsList = enhancedQuery<WithRegionsResult, any, WithRegionsChildProps>(
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

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let a: ComponentDecorator<any, any>;
let e: ErrorItem;
