import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

import type {
  RegionMediaSummaryQuery,
  RegionMediaSummaryQueryVariables,
} from '../regionMediaSummary.generated';
import { RegionMediaSummaryDocument } from '../regionMediaSummary.generated';

export default () => {
  const apollo = useApolloClient();
  return useCallback(
    (regionId: string) => {
      const q = apollo.readQuery<
        RegionMediaSummaryQuery,
        RegionMediaSummaryQueryVariables
      >({
        query: RegionMediaSummaryDocument,
        variables: { regionId },
      });
      return {
        photos: (q?.region?.mediaSummary?.photo?.count || 0) * 2,
        sections: q?.region?.sections?.count || 0,
      };
    },
    [apollo],
  );
};
