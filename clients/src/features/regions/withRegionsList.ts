import { Region } from '../../../ww-commons';
import { enhancedQuery } from '../../apollo';
import listRegions from './listRegions.query';

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
  listRegions,
  {
    options: ({ language }) => ({
      fetchPolicy: 'cache-and-network',
      // TODO: use update instead of reducer, as reducer is deprecated
      // reducer: regionsListReducer,
      notifyOnNetworkStatusChange: true,
      variables: { language },
    }),
    props: ({ data }) => {
      const { regions, loading, refetch } = data!;
      return { regions: { list: regions || [], loading, refetch } };
    },
  },
);
