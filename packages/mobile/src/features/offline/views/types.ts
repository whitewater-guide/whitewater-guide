import { NamedNode, RegionMediaSummary } from '@whitewater-guide/commons';
import { ApolloError } from 'apollo-client';
import { OfflineCategorySelection, OfflineProgress } from '../types';

export interface StateProps {
  region: NamedNode | null;
  inProgress?: boolean;
  progress: OfflineProgress;
  isConnected?: boolean;
}

export interface DispatchProps {
  onDismiss?: () => void;
  onDownload?: (selection: OfflineCategorySelection) => void;
}

export interface GraphqlProps {
  summary: {
    summary?: RegionMediaSummary | null;
    loading?: boolean;
    error?: ApolloError;
    refetch?: () => Promise<any>;
  };
}

export type InnerProps = StateProps & DispatchProps & GraphqlProps;
