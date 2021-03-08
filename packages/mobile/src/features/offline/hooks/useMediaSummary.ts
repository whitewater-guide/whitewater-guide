import { useCallback } from 'react';
import { useApolloClient } from 'react-apollo';

import {
  REGION_MEDIA_SUMMARY,
  Result,
  Vars,
} from '../regionMediaSummary.query';

export default () => {
  const apollo = useApolloClient();
  return useCallback(
    (regionId: string) => {
      const q = apollo.readQuery<Result, Vars>({
        query: REGION_MEDIA_SUMMARY,
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
