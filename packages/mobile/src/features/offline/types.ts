import { NamedNode, RegionMediaSummary } from '../../ww-commons';

export type OfflineCategoryType = 'data' | 'media' | 'maps';

export type OfflineCategorySelection = {
  [key in OfflineCategoryType]: boolean;
};

export interface OfflineProgress {
  data?: [number, number];
  media?: [number, number];
  maps?: [number, number];
}

export interface OfflineContentStore {
  dialogRegion: NamedNode | null;
  regionInProgress: string | null; // region id
  progress: OfflineProgress;
}

export interface OfflineProgressPayload extends OfflineProgress {
  regionInProgress: string | null;
}
