import { RegionMediaSummary } from '@whitewater-guide/commons';
import { ApolloError } from 'apollo-client';

export interface SummaryProps {
  summary: {
    summary?: RegionMediaSummary | null;
    loading?: boolean;
    error?: ApolloError;
    refetch?: () => Promise<any>;
  };
}
