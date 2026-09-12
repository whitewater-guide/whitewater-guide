import type { PointCoreFragment } from '@whitewater-guide/schema';

import type { Coordinates } from '@/types/coordinates';

export interface MapRiver {
  __typename?: 'River';
  id: string;
  name: string;
}

export interface MapSection {
  __typename: 'Section';
  id: string;
  name: string;
  difficulty: number;
  difficultyXtra?: string | null;
  rating?: number | null;
  verified?: boolean | null;
  demo?: boolean | null;
  distance?: number | null;
  duration?: number | null;
  drop?: number | null;
  season?: string | null;
  seasonNumeric?: number[];
  river: MapRiver;
  putIn: PointCoreFragment;
  takeOut: PointCoreFragment;
  shape?: Coordinates[];
  flowsText?: string | null;
  approximate?: boolean;
}

export type MapSelectionNode = MapSection | PointCoreFragment;

export interface MapProps {
  sections: MapSection[];
  pois: PointCoreFragment[];
  initialBounds: Coordinates[];
}

export interface MapViewProps {
  mapType: string;
  detailed?: boolean;
  locationPermissionGranted: boolean;
  initialBounds: Coordinates[];
  testID?: string;
}
