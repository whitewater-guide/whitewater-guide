import { NamedNode, RegionMediaSummary } from '../../../ww-commons';
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
  summary?: RegionMediaSummary | null;
  isLoadingSummary?: boolean;
}

export type InnerProps = StateProps & DispatchProps & GraphqlProps;
