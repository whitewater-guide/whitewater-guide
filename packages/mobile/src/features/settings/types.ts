import Layers from 'components/map/layers';

export interface AppSettings {
  mapType?: string;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  mapType: Layers.TERRAIN.url,
};
