import type {
  OfflineManager,
  OfflinePack,
  OfflinePackStatus,
} from '@rnmapbox/maps';
import noop from 'lodash/noop';

import { MapboxOfflinePackState } from '../types';

export const mockStatus = (
  name: string,
  n: number,
  total: number,
): OfflinePackStatus => ({
  completedResourceCount: Math.round((100 * n) / total),
  completedResourceSize: Math.round((100 * n) / total),
  completedTileCount: Math.round((100 * n) / total),
  completedTileSize: Math.round((100 * n) / total),
  name,
  percentage: Math.round((100 * n) / total),
  requiredResourceCount: Math.round((100 * n) / total),
  state:
    n === total
      ? MapboxOfflinePackState.COMPLETE
      : MapboxOfflinePackState.ACTIVE,
});

export const mockPack = (
  name: string,
  n: number,
  total: number,
  resume: jest.Mock = jest.fn(),
): OfflinePack => ({
  bounds: [
    [1, 1],
    [0, 0],
  ],
  name,
  metadata: null,
  pause: noop,
  resume,
  status: () => Promise.resolve(mockStatus(name, n, total)),
});

type Subscriber = OfflineManager['subscribe'];

export const mockPackSubscribe: Subscriber = (name, onProgress, onError) => {
  const total = 3;
  const notify = (n: number, progress: any, error: any) => {
    setTimeout(() => {
      progress({ name }, mockStatus(name, n, total));
      if (n < total) {
        notify(n + 1, progress, error);
      }
    }, 1);
  };
  notify(1, onProgress, onError);
};

export const mockPackError: Subscriber = (name, onProgress, onError) => {
  setTimeout(() => onError({ name } as any, new Error('mapbox error')), 1);
};
