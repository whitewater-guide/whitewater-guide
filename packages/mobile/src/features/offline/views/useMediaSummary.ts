import { useQuery } from 'react-apollo';
import {
  REGION_MEDIA_SUMMARY,
  Result,
  Vars,
} from '../regionMediaSummary.query';

export default (regionId?: string) => {
  const qResult = useQuery<Result, Vars>(REGION_MEDIA_SUMMARY, {
    fetchPolicy: 'network-only',
    variables: { regionId },
  });
  return {
    summary: qResult.data?.region?.mediaSummary,
    error: qResult.error,
    refetch: qResult.refetch,
  };
};
