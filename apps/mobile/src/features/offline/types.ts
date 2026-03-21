export type OfflineCategoryType = 'data' | 'media' | 'maps';

export type OfflineCategorySelection = {
  [key in OfflineCategoryType]?: boolean;
};

export const MapboxOfflinePackState = {
  ACTIVE: 'active',
  COMPLETE: 'complete',
};

export interface OfflineProgress {
  data?: [number, number];
  media?: [number, number];
  maps?: [number, number];
}
