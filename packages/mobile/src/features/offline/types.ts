import { NamedNode } from '@whitewater-guide/commons';
import { Platform } from 'react-native';

export type OfflineCategoryType = 'data' | 'media' | 'maps';

export type OfflineCategorySelection = {
  [key in OfflineCategoryType]: boolean;
};

export const MapboxOfflinePackState = {
  UNKNOWN: Platform.OS === 'ios' ? 0 : -11,
  INACTIVE: Platform.OS === 'ios' ? 1 : 0,
  ACTIVE: Platform.OS === 'ios' ? 2 : 1,
  COMPLETE: Platform.OS === 'ios' ? 3 : 2,
  INVALID: Platform.OS === 'ios' ? 4 : -10,
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
  error: string | null;
}

export interface OfflineProgressPayload {
  data?: number | [number, number]; // number for downloaded only, array for [downloaded, total]
  media?: number | [number, number];
  maps?: number | [number, number];
}

export interface OfflineContentError {
  message: string;
  fatal?: boolean;
}

export interface StartDownloadPayload {
  regionId: string;
  selection: OfflineCategorySelection;
}
