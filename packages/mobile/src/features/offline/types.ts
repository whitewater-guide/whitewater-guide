import { Platform } from 'react-native';

export type OfflineCategoryType = 'data' | 'media' | 'maps';

export type OfflineCategorySelection = {
  [key in OfflineCategoryType]?: boolean;
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
