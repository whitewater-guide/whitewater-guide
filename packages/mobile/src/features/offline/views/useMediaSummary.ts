import { useRegionMediaSummaryQuery } from '../regionMediaSummary.generated';

export default (regionId?: string) => {
  const { data, error, refetch } = useRegionMediaSummaryQuery({
    fetchPolicy: 'network-only',
    variables: { regionId },
  });
  return {
    summary: data?.region?.mediaSummary,
    error: error,
    refetch: refetch,
  };
};
